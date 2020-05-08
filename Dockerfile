FROM nginx:1.17.1-alpine
COPY /dist/fta /usr/share/nginx/html
