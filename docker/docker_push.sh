#!/bin/bash
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

mv Packages OHIFViewer/packages
mv docker/Dockerfile OHIFViewer/Dockerfile
mv docker/custom_entrypoint.sh OHIFViewer/custom_entrypoint.sh

cd OHIFViewer
docker build --build-arg INSTALL_MONGO=true --build-arg VCS_REF=`git rev-parse --short HEAD` -t osirixfoundation/kheops-viewer:$BRANCH .

docker push osirixfoundation/kheops-viewer:$BRANCH
