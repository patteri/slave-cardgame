# 'Slave' card game

This project implements server and web client for a card game called 'Slave'.

Features in the game:

- Creating and joining games
- Playing against humans and/or computers
- Computer AI
- Game chat
- Highscores and statistics
- Email-based account registration and managament 

The server is built on NodeJS + Express using MongoDB. The client is implemented with React + Redux and utilizes `create-react-app`.

## Running the project

Prerequisites:
- NodeJS + npm
- MongoDB
- (Docker)

### Using Docker

```
docker build -t slave-game .
docker run -p 3001:3001 -d slave-game
```

The server is started and runs on `localhost:3001`.

### Using npm

```
npm install

cd client
npm install

cd ..
npm start
```

A Webpack development server is started and runs on `localhost:3000`.
