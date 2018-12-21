FROM node:alpine

RUN mkdir -p /usr/src/app/client

# Bundle app source
COPY . /usr/src/app

# Install app dependencies
WORKDIR /usr/src/app
RUN cd client && \
    npm install --production && \
    npm run build && \
    cd .. && \
    npm install --production

ENV PORT 3001
ENV NODE_ENV production
ENV DB_LOCATION db_location
ENV JWT_SECRET override_this
ENV EMAIL_ADDRESS override_this
ENV EMAIL_FROM override_this
ENV EMAIL_HOST override_this
ENV EMAIL_PASSWORD override_this
ENV EMAIL_PORT override_this
ENV EMAIL_USERNAME override_this
ENV SERVER_ADDRESS override_this

EXPOSE $PORT

CMD [ "npm", "run", "server" ]