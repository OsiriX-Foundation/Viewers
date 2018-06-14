import { Meteor } from 'meteor/meteor'
import { OHIF } from 'meteor/ohif:core';

const fs = Npm.require('fs');
const url = Npm.require('url');
const http = Npm.require('http');
const https = Npm.require('https');

let conn = DIMSE.connection;

KHEOPS.dicomWebStoreInstances = function(fileList, callback) {
    let authToken;
    let wadoRoot;

    try {
        authToken = KHEOPS.getUserAuthToken();
        wadoRoot = OHIF.servers.getCurrentServer().wadoRoot;
    } catch (error) {
        OHIF.log.error('unable to get the user auth token');
        OHIF.log.trace();
        fileList.forEach(file => callback(error, file));
        return;
    }

    let captureFunc = function(self, contexts, toSend, handle, metaLength) {
        KHEOPS.sendProcessedFiles(self, contexts, toSend, handle, metaLength, authToken, wadoRoot);
    };

    let handle = conn.storeInstances(fileList, captureFunc);
    handle.on('file', function (err, file, result) {
        callback(err, file, result);
    });
    handle.on('error', function (err, file) {
        callback(err, file);
    });
};

KHEOPS.sendProcessedFiles = function(self, contexts, toSend, handle, metaLength, authToken, wadoRoot) {

    let fileList = toSend.map(x => x.file);

    let sendNext = function sendNext() {
        if (fileList.length > 0) {
            let file = fileList.shift();
            storeInstance(file, authToken, wadoRoot, function (error, retval) {
                if (error) {
                    handle.emit('file', error, file);
                } else {
                    handle.emit('file', null, file, retval);
                }
                sendNext();
            });
        }
    };

    for (let i = 0; i < 10; i++) {
        sendNext();
    }
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
    readStream.on('error', () => {
        OHIF.log.error('Error reading the files stream.');
        callback(new Meteor.Error('Error reading the files stream'), null);
    });
}

function storeInstance(file, authToken, wadoRoot, callback) {

    let options = {
        file: file,
        authToken: authToken,
    };

    makestoreInstanceRequest(wadoRoot + '/studies', options, function (error, retval) {
        callback(error, retval);
    });
}

