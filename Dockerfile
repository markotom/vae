FROM node:10-alpine
RUN apk add python gcc g++ make curl

ARG WORKING_DIR=/vae

RUN mkdir -p $WORKING_DIR
WORKDIR $WORKING_DIR

COPY package.json $WORKING_DIR
RUN npm i -g grunt pm2
RUN npm install

COPY . $WORKING_DIR/
RUN grunt build:production

RUN pm2 install pm2-logrotate

CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production", "--only", "app"]
