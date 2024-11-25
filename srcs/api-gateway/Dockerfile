
FROM nginx:alpine

COPY ./frontend/                     /usr/share/nginx/html/
COPY ./api-gateway/config/nginx.conf  /etc/nginx/nginx.conf
COPY ./api-gateway/config/conf.d/     /etc/nginx/conf.d/

EXPOSE 443
EXPOSE 8080
