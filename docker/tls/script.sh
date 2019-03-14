#!/bin/bash

chmod a+w /etc/nginx/conf.d/viewer.conf
sed -i "s|\${server_name}|$SERVER_NAME|" /etc/nginx/conf.d/viewer.conf



#######################################################################################
#ELASTIC SEARCH

if ! [ -z "$VIEWER_ENABLE_ELASTIC" ]; then
    if [ "$VIEWER_ENABLE_ELASTIC" = true ]; then
        missing_env_var_secret=false

        #Verify secrets
        if ! [ -f ${SECRET_FILE_PATH}/elastic_cloud_id ]; then
            echo "Missing elastic_cloud_id secret"
            missing_env_var_secret=true
        else
           echo -e "secret elastic_cloud_id \e[92mOK\e[0m"
        fi

        if ! [ -f ${SECRET_FILE_PATH}/elastic_cloud_auth ]; then
            echo "Missing elastic_cloud_auth secret"
            missing_env_var_secret=true
        else
           echo -e "secret elastic_cloud_authm \e[92mOK\e[0m"
        fi


        #get secrets and verify content
        for f in ${SECRET_FILE_PATH}/*
        do
          filename=$(basename "$f")
          value=$(cat ${f})
          sed -i "s|\${$filename}|$value|" /etc/metricbeat/metricbeat.yml
          sed -i "s|\${$filename}|$value|" /etc/filebeat/filebeat.yml
        done

        if [[ -z $VIEWER_ELASTIC_NAME ]]; then
          echo "Missing VIEWER_ELASTIC_NAME environment variable"
          missing_env_var_secret=true
        else
           echo -e "environment variable VIEWER_ELASTIC_NAME \e[92mOK\e[0m"
           sed -i "s|\${elastic_name}|$VIEWER_ELASTIC_NAME|" /etc/metricbeat/metricbeat.yml
           sed -i "s|\${elastic_name}|$VIEWER_ELASTIC_NAME|" /etc/filebeat/filebeat.yml
        fi
        if [[ -z $VIEWER_ELASTIC_TAGS ]]; then
          echo "Missing VIEWER_ELASTIC_TAGS environment variable"
          missing_env_var_secret=true
        else
           echo -e "environment variable VIEWER_ELASTIC_TAGS \e[92mOK\e[0m"
           sed -i "s|\${elastic_tags}|$VIEWER_ELASTIC_TAGS|" /etc/metricbeat/metricbeat.yml
           sed -i "s|\${elastic_tags}|$VIEWER_ELASTIC_TAGS|" /etc/filebeat/filebeat.yml
        fi

        #if missing env var or secret => exit
        if [[ $missing_env_var_secret = true ]]; then
          exit 1
        else
           echo -e "all elastic secrets and all env var \e[92mOK\e[0m"
        fi

        metricbeat modules enable nginx
        filebeat modules enable nginx
        metricbeat modules disable system
        filebeat modules disable system

        service filebeat start
        service metricbeat start

        echo "Ending setup METRICBEAT and FILEBEAT"
    fi
else
    echo "[INFO] : Missing VIEWER_ENABLE_ELASTIC environment variable. Elastic is not enable."
fi
#######################################################################################



nginx-debug -g 'daemon off;'
