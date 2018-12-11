#!/bin/bash

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

docker build ./docker/ -t="osirixfoundation/viewer"
docker push osirixfoundation/viewer


chmod +x docker/ssh/deployssh.sh
mv $TRAVIS_BUILD_DIR/docker/standaloneViewerBuild $TRAVIS_BUILD_DIR/docker/ssh/standaloneViewerBuild
./docker/ssh/deployssl.sh
