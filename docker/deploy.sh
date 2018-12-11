#!/bin/bash

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

docker build ./docker/ -t="osirixfoundation/viewer"
docker push osirixfoundation/viewer


chmod +x ssh/deployssh.sh
./deployssh.sh
