#!/bin/bash

ls 
pwd

mv /home/travis/standaloneViewerBuild docker/standaloneViewerBuild
ls
ls standaloneViewerBuild
pwd
cd docker
ls
docker build . -t="osirixfoundation/viewer"

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

docker push osirixfoundation/viewer
