#!/bin/bash

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

docker build ./docker/ssh/ -t osirixfoundation/viewer:ssl
docker push osirixfoundation/viewer:ssl
