
FROM nginx:alpine

# COPY ./api-gateway/tools/            /etc/nginx/certificates/
COPY ./frontend/                     /usr/share/nginx/html/
COPY ./api-gateway/config/nginx.conf  /etc/nginx/nginx.conf
COPY ./api-gateway/config/conf.d/     /etc/nginx/conf.d/

EXPOSE 443
