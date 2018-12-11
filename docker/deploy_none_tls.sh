#!/bin/bash

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

docker build ./docker/ -t osirixfoundation/viewer:nonetls
docker push osirixfoundation/viewer:nonetls
