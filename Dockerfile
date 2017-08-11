FROM node:boron

RUN mkdir -p /usr/src/app/client

# Bundle app source
COPY . /usr/src/app

# Install app dependencies
WORKDIR /usr/src/app
RUN cd client && \
    npm install && \
    npm run build && \
    cd .. && \
    npm install --production

ENV PORT 3001
ENV NODE_ENV production
ENV DB_LOCATION db_location
ENV JWT_SECRET override_this

EXPOSE $PORT

CMD [ "npm", "run", "server" ]