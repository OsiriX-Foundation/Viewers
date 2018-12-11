#!/bin/bash

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

docker build ./docker/ -t="osirixfoundation/viewer"
docker push osirixfoundation/viewer

docker build ./docker/ssh/ -t osirixfoundation/viewer:ssh
docker push osirixfoundation/viewer:ssh
