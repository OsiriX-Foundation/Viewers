#!/bin/bash

export METEOR_SETTINGS="{\"servers\":{\"dicomWeb\":[{\"name\":\"DCM4CHEE\",\"wadoUriRoot\":\"$KHEOPS_wadoUriRoot\",\"qidoRoot\":\"$KHEOPS_qidoRoot\",\"authorizationRoot\":\"$KHEOPS_authorizationRoot\",\"wadoRoot\":\"$KHEOPS_wadoRoot\",\"qidoSupportsIncludeField\":false,\"imageRendering\":\"wadouri\",\"thumbnailRendering\":\"wadors\",\"requestOptions\":{\"auth\":\"admin:admin\",\"logRequests\":true,\"logResponses\":false,\"logTiming\":true}}]},\"defaultServiceType\":\"dicomWeb\",\"dropCollections\":true,\"public\":{\"verifyEmail\":false,\"ui\":{\"studyListFunctionsEnabled\":true,\"leftSidebarOpen\":false,\"displaySetNavigationLoopOverSeries\":false,\"displaySetNavigationMultipleViewports\":true,\"autoPositionMeasurementsTextCallOuts\":\"TRLB\"}},\"proxy\":{\"enabled\":true},\"private\":{\"oAuth\":{\"google\":{\"clientId\":\"$KHEOPS_clientId\",\"secret\":\"52Q-3JwelmKAn2CQKs5pd0Jr\"}}}}"
echo $METEOR_SETTINGS

./entrypoint.sh node main.js
