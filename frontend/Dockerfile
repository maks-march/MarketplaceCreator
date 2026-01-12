FROM node:20-alpine AS builder

WORKDIR /app

# Копируем зависимости
COPY package*.json ./
RUN npm ci

# Копируем исходники
COPY . .

# Собираем приложение
RUN npm run build

# Финальный образ только с билдом
FROM nginx:alpine

# Копируем сборку в nginx
COPY --from=builder /app/dist staticfiles/usr/share/nginx/html

# Права для nginx
RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80