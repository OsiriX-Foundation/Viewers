#!/bin/bash

ls

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

docker build ./docker/ssl/ -t osirixfoundation/viewer:ssl
docker push osirixfoundation/viewer:ssl
