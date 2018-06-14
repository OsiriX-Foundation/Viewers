Package.describe({
    name: 'naturalimage:kheops',
    version: '0.0.1',
    summary: 'Interaction with the Kheops authentication server',
});

Package.onUse(function(api) {
    api.versionsFrom('1.4');

    api.use('http');
    api.use('ecmascript');
    api.use('ohif:dicom-services');

    api.addFiles('server/namespace.js', 'server');
    api.addFiles('server/getUserAuthToken.js', 'server');
    api.addFiles('server/dicomWebStoreInstances.js', 'server');

    api.export('KHEOPS', 'server');
});
