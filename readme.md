docker run -e API_HOST=10.10.10.1 -e API_PORT=3000 -p 8080:80 my-web-app

```
docker run -d --name my-nginx -p 80:80 -v $(pwd)/html:/usr/share/nginx/html -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf nginx:alpine
```
