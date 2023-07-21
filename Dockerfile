# ------------------- V1 -------------------

#FROM node:18-alpine
#
#RUN yarn global add http-server
#
#WORKDIR /app
#
#COPY package*.json ./
#
#RUN yarn
#
#COPY . .
#
#RUN yarn run build
#
#ENTRYPOINT ["sh", "-c", "chmod +x set_env_vars.sh && sh set_env_vars.sh && yarn run build && http-server dist -f /index.html -P http://localhost:80?"]

#CMD [ "http-server", "dist" ]

# ------------------- V2 -------------------

#FROM node:18-alpine AS builder
#
#WORKDIR /app
#
#COPY package*.json ./
#
#RUN yarn
#
#COPY . .
#
#RUN chmod +x set_env_vars.sh
#
#RUN sh set_env_vars.sh
#
#RUN yarn run build
#
#
#FROM nginx:1.25.0 AS production-build
#
#COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
#
#RUN rm -rf /usr/share/nginx/html/*
#
#COPY --from=builder /app/dist /usr/share/nginx/html
#
#EXPOSE 80
#
#ENTRYPOINT ["nginx", "-g", "daemon off;"]

# ------------------- V3 -------------------

FROM node:18-alpine

RUN apk update

RUN apk add nginx

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

RUN mkdir /usr/share/nginx/html

RUN rm -rf /usr/share/nginx/html/*

EXPOSE 80

ENTRYPOINT ["sh", "-c", "chmod +x set_env_vars.sh && sh set_env_vars.sh && yarn run build && cp -r /app/dist/* /usr/share/nginx/html && nginx -g \"daemon off;\""]