#!/bin/bash

chmod a+w /etc/nginx/conf.d/viewer.conf
sed -i "s|\${server_name}|$SERVER_NAME|" /etc/nginx/conf.d/viewer.conf

nginx-debug -g 'daemon off;'
