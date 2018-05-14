#!/bin/bash
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

mv Packages OHIFViewer/packages

cd OHIFViewer
docker build --build-arg INSTALL_MONGO=true -t osirixfoundation/kheops-viewer .

docker push osirixfoundation/kheops-viewer
