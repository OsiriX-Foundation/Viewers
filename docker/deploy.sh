#!/bin/bash

docker build ./docker/ -t="osirixfoundation/viewer"

docker build ./docker/ssh/ -t osirixfoundation/viewer:ssh

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

docker push osirixfoundation/viewer
docker push osirixfoundation/viewer:ssh
