server {
        listen 80;
        server_name localhost;
        root /home/viewer/www;
        index index.html;
}
