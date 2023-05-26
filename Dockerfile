FROM node:16.17.0 as base
RUN apt-get update && apt-get install git -y
WORKDIR /code
COPY package*.json /code/   
RUN mkdir .husky
RUN npm install
COPY . /code/

RUN npm run build 


FROM nginx:latest
RUN apt-get update && apt-get install gettext-base -y
COPY --from=base /code/dist /var/www/html
COPY --from=base /code/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80