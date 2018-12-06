#!/bin/sh

PROJECT_DIR="../StandaloneViewer/StandaloneViewer"
PACKAGE_DIR="../../Packages"
COMPILED_DIR="../../KheopsDocker/appCompiled"

(cd $PROJECT_DIR && meteor npm install)
(cd $PROJECT_DIR && METEOR_PACKAGE_DIRS="${PACKAGE_DIR}" meteor-build-client $COMPILED_DIR -u default )
