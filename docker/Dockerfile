
FROM nginx:stable

COPY standaloneViewerBuild /usr/share/nginx/html
COPY viewer.conf /etc/nginx/conf.d/viewer.conf

CMD ["nginx", "-g", "daemon off;"]
