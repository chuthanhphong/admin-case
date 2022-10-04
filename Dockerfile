# build stage
FROM node:14.17 as node
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install && npm cache clean --force
COPY .  /usr/src/app/
RUN npm run build

# production stage
# FROM nginx:stable-alpine as production-stage
# COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
ARG PORT=6688
ENV PORT $PORT
EXPOSE 6688

FROM bitnami/nginx:1.21.3
COPY --from=node /usr/src/app/dist /var/www/vue-app
COPY ./nginx.conf /opt/bitnami/nginx/conf/nginx.conf


# CMD ["nginx", "-g", "daemon off;"]