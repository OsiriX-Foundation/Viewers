import { Meteor } from 'meteor/meteor'
import { OHIF } from 'meteor/ohif:core';

const fs = Npm.require('fs');
const fiber = Npm.require('fibers');
const url = Npm.require('url');
const http = Npm.require('http');
const https = Npm.require('https');

KHEOPS.dicomWebStoreInstances = function(fileList, callback) {
    let authToken;

    try {
        authToken = KHEOPS.getUserAuthToken();
    } catch (error) {
        OHIF.log.error('unable to get the user auth token');
        OHIF.log.trace();
        throw error;
    }

    fileList.forEach(function(file) {
        storeInstance(file, authToken);
        callback(null, file);
    });
};

function makestoreInstanceRequest(geturl, options, callback) {
    const parsed = url.parse(geturl);
    const jsonHeaders = ['application/dicom+json'];

    let file = options.file;

    let requestOpt = {
        hostname: parsed.hostname,
        path: parsed.path,
        method: 'POST'
    };

    let requester;
    if (parsed.protocol === 'https:') {
        requester = https.request;

        const allowUnauthorizedAgent = new https.Agent({ rejectUnauthorized: false });
        requestOpt.agent = allowUnauthorizedAgent;
    } else {
        requester = http.request;
    }

    if (parsed.port) {
        requestOpt.port = parsed.port;
    }

    if (options.auth) {
        requestOpt.auth = options.auth;
    }

    if (options.method) {
        requestOpt.method = options.method;
    }

    const postData = options.postData;

    if (options.headers) {
        requestOpt.headers = Object.assign({}, options.headers);
    } else {
        requestOpt.headers = {};
    }

    let boundary = "0f974adb38fcc82c64c63e077a1c0452d79232cb"
    requestOpt.headers['Content-Type'] = "multipart/related; type='application/dicom'; boundary=" + boundary + ";";
    requestOpt.headers['Accept'] = "application/dicom+json";
    requestOpt.headers['Authorization'] = "Bearer "+options.authToken;


    const req = requester(requestOpt, function(resp) {
        // TODO: handle errors with 400+ code
        if (resp.statusCode < 200 || resp.statusCode >= 300) {
            const errorMessage = `Error (${resp.statusCode}) when storing an instance`;
            callback(new Error(errorMessage), null);
            return;
        }

        const contentType = (resp.headers['content-type'] || '').split(';')[0];
        if (jsonHeaders.indexOf(contentType) === -1) {
            const errorMessage = `We only support dicom+json but "${contentType}" was sent by the server`;
            callback(new Error(errorMessage), null);
            return;
        }


        let output = '';

        resp.setEncoding('utf8');

        resp.on('data', function(chunk){
            output += chunk;
        });

        resp.on('error', function (responseError) {
            OHIF.log.error('There was an error in the Kheops PACS Server')
            OHIF.log.error(requestOpt);
            OHIF.log.error(error.stack);
            OHIF.log.trace();

            callback(new Meteor.Error('server-internal-error', responseError.message), null);
        });

        resp.on('end', function(){
            if (output) {
                let outputObj = JSON.parse(output);
                let retrieveURI = outputObj["00081199"].Value[0]["00081190"].Value[0];
                let studiesIndex = retrieveURI.indexOf("/studies/");
                let seriesIndex = retrieveURI.indexOf("/series/");
                let instancesIndex = retrieveURI.indexOf("/instances/");

                let studyUID = retrieveURI.slice(studiesIndex + 9, seriesIndex);
                let seriesUID = retrieveURI.slice(seriesIndex + 8, instancesIndex);

                callback(null, {data: {seriesUID:seriesUID, studyUID:studyUID}});
            } else {
                callback(null, null);
            }
        });
    });

    req.on('error', function (requestError) {
        OHIF.log.error('Couldn\'t connect to the Kheops PACS server.');
        OHIF.log.error('Make sure you are trying to connect to the right server and that it is up and running.');
        OHIF.log.error(requestOpt);
        OHIF.log.error(requestError.stack);
        OHIF.log.trace();

        callback(new Meteor.Error('server-connection-error', requestError.message), null);
    });

    req.write('--' + boundary + '\r\nContent-Type: application/dicom\r\n\r\n');
    var readStream = fs.createReadStream(file);
    readStream.pipe(req, { end: false });
    readStream.on('end', () => {
        req.write('\r\n--' + boundary + '--\r\n');

        req.end();
    });

}


const makestoreInstanceRequestSync = Meteor.wrapAsync(makestoreInstanceRequest);

function storeInstance(file, authToken) {

    let options = {
        file: file,
        authToken: authToken,
        // userJWT: googleOAuthIdToken,
        // headers: {
        //     Accept: 'application/json',
        //     'Content-Type': 'application/x-www-form-urlencoded',
        // },
        // postData: {
        //     'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        //     'assertion': googleOAuthIdToken,
        // },
    };

    let result;
    try {
        let wadoRoot = OHIF.servers.getCurrentServer().wadoRoot;
        result = makestoreInstanceRequestSync(wadoRoot + '/studies', options);
        try {
            KHEOPS.shareSeriesWithUser(result.data.studyUID, result.data.seriesUID);
        }catch (error) {
            OHIF.log.error('Unable to claim the series StudyInstanceUID:' + result.data.studyUID + 'SeriesInstanceUID:' + result.data.seriesUID);
            OHIF.log.error(error);
            OHIF.log.trace();
            throw error;
        }
    } catch (error) {
        OHIF.log.error(`error while storing instance of file:${file}`);
        OHIF.log.error(error);
        OHIF.log.trace();
        throw error;
    }


}

