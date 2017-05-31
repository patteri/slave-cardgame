FROM node:boron

RUN mkdir -p /usr/src/app/client

# Bundle app source
COPY . /usr/src/app

# Install app dependencies
WORKDIR /usr/src/app/client
RUN npm install
RUN npm run build
WORKDIR /usr/src/app
RUN npm install --production

EXPOSE 3001

ENV NODE_ENV production
ENV DB_LOCATION db_location
ENV JWT_SECRET override_this

CMD [ "npm", "run", "server" ]