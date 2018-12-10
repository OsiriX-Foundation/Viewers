
FROM nginx:stable

COPY localhost.com /etc/nginx/sites-available/localhost.com
COPY ~/standaloneViewerBuild /home/viewer/www/

CMD ["nginx", "-g", "daemon off;"]
