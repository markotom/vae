FROM node:10-alpine
RUN apk add python gcc g++ make curl

ARG WORKING_DIR=/vae
ARG PORT=5858

ENV PORT=$PORT

RUN mkdir -p $WORKING_DIR
WORKDIR $WORKING_DIR

COPY package.json $WORKING_DIR
RUN npm i -g grunt
RUN npm install

COPY . $WORKING_DIR/
RUN grunt build:production

ENV NODE_ENV=production

CMD ["node", "./server.js"]
