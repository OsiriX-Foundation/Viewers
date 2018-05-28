#!/bin/bash

OAuth2_secret=$(cat /run/secrets/OAuth2_secret)
echo $OAuth2_secret 
export METEOR_SETTINGS="{\"servers\":{\"dicomWeb\":[{\"name\":\"DCM4CHEE\",\"wadoUriRoot\":\"$KHEOPS_WADO_URI_ROOT\",\"qidoRoot\":\"$KHEOPS_QIDO_ROOT\",\"authorizationRoot\":\"$KHEOPS_AUTHORIZATION_ROOT\",\"wadoRoot\":\"$KHEOPS_WADO_ROOT\",\"qidoSupportsIncludeField\":false,\"imageRendering\":\"wadouri\",\"thumbnailRendering\":\"wadors\",\"requestOptions\":{\"auth\":\"admin:admin\",\"logRequests\":true,\"logResponses\":false,\"logTiming\":true}}]},\"defaultServiceType\":\"dicomWeb\",\"dropCollections\":true,\"public\":{\"verifyEmail\":false,\"ui\":{\"studyListFunctionsEnabled\":true,\"leftSidebarOpen\":false,\"displaySetNavigationLoopOverSeries\":false,\"displaySetNavigationMultipleViewports\":true,\"autoPositionMeasurementsTextCallOuts\":\"TRLB\"}},\"proxy\":{\"enabled\":true},\"private\":{\"oAuth\":{\"google\":{\"clientId\":\"$KHEOPS_CLIENT_ID\",\"secret\":\"$OAuth2_secret\"}}}}"
echo $METEOR_SETTINGS

./entrypoint.sh node main.js
