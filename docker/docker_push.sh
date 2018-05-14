#!/bin/bash
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
ls

#mv Packages OHIFViewer/packages

cd OHIFViewer
ls

#docker build --building-arg INSTALL_MONGO=true -t osirixfoundation/kheops-viewer .

#docker push osirixfoundation/kheops-viewer
