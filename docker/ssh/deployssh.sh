#!/bin/bash

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
irixfoundation/viewer

docker build ./ssh/ -t osirixfoundation/viewer:ssh
docker push osirixfoundation/viewer:ssh
