const querystring = require("querystring");
const { URL, URLSearchParams } = require('url');

WADOProxy.convertURL = (url, serverConfiguration) => {
    if (!Settings.enabled) {
        return url;
    }

    if (!url) {
        return null;
    }

    const serverId = serverConfiguration._id;
    const query = querystring.stringify({url, serverId});
    return `${Settings.uri}?${query}`;
}

WADOProxy.seriesFromWadoURL = function (wadoURLString) {
    // this can be either WADO-URI or WADO-RS.
    // it looks like everything goes through WADO-URI for now, so we pull out the query parameter
    let wadoURL = new URL(wadoURLString);
    return wadoURL.searchParams.get('seriesUID');
}

WADOProxy.studyFromWadoURL = function (wadoURLString) {
    // this can be either WADO-URI or WADO-RS.
    // it looks like everything goes through WADO-URI for now, so we pull out the query parameter
    let wadoURL = new URL(wadoURLString);
    return wadoURL.searchParams.get('studyUID');
}