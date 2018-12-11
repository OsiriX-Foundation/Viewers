#!/bin/bash

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

docker build ./docker/tls/ -t osirixfoundation/viewer:tls
docker push osirixfoundation/viewer:tls
