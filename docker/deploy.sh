#!/bin/bash

docker build ./docker/ -t="osirixfoundation/viewer"

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

docker push osirixfoundation/viewer
