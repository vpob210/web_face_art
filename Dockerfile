# Dockerfile
FROM nginx:alpine

# Копируем файлы в контейнер
COPY html /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# При старте контейнера создаем файл конфигурации с нужными значениями
CMD sh -c "echo \"window.API_CONFIG = { endpoint: 'http://${API_HOST}:${API_PORT}' };\" > /usr/share/nginx/html/js/config.js && nginx -g 'daemon off;'" 
