
FROM nginx:stable

ENV SERVER_NAME=localhost

COPY standaloneViewerBuild /usr/share/nginx/html
COPY viewer.conf /etc/nginx/conf.d/viewer.conf
COPY script.sh /etc/nginx/conf.d/script.sh

RUN chmod +x /etc/nginx/conf.d/script.sh

CMD ["./etc/nginx/conf.d/script.sh"]
