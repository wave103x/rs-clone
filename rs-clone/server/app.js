/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const { Sequelize } = require('sequelize');
const express = require('express');

const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const formidable = require('express-formidable');
const userRouter = require('./src/routes/user.router');
const winnerRouter = require('./src/routes/winner.router');

const PORT = process.env.PORT || 3001;
const sequelize = new Sequelize(
  // process.env.DB_NAME,
  // process.env.DB_USER,
  // process.env.DB_PASS,
  'clone_38aq',
  'clone_38aq_user',
  'EM4REnz1xuvBlHIj6oDMZqiy8O6L1kTR',

  {
    // host: process.env.HOST,
    // host: 'postgres://dpg-cft1v3arrk0c834202g0-a',
    host: 'dpg-cft1v3arrk0c834202g0-a',
    // host: '127.0.0.1',
    // host: 'localhost',
    port: 5432,
    dialect: 'postgres',
  },
);

async function connect() {
  try {
    await sequelize.authenticate();
    console.log(
      'Connection has been established successfully.',
      process.env.DB_NAME,
      process.env.DB_USER,
    );
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
// console.log('*********************');
// console.log(process.env.DB_NAME);
// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);
// console.log(process.env.HOST);
// console.log('*********************');

connect();

const corsOptions = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(formidable());
app.use(express.json());
app.use(cookieParser());
app.use('/api', userRouter);
app.use('/api/winners', winnerRouter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { corsOptions },
});
// Multer
// eslint-disable-next-line prefer-const
let playerMap = new Map();
let clientNumber = 0;
let roomNumber;
const gameBoard = null;

function connected(socket) {
  clientNumber += 1;
  socket.on('newPlayer', (user, board) => {
    if (playerMap.size === 0) {
      console.log('First player joined');
      const userObj = JSON.parse(user);
      console.log(userObj);
      console.log('====================================');
      playerMap.set(userObj, board);
      console.log(playerMap);
      // socket.on('newPlayer', (user, board) => {
      //   const userObj = JSON.parse(user);
      //   console.log('====================================');
      //   console.log(userObj);
      //   console.log('====================================');
      //   playerMap.set(userObj, board);
      //   console.log(playerMap);
      // });
    } else if (playerMap.size === 1) {
      console.log('Second player joined');
      const userObj = JSON.parse(user);
      console.log(userObj);
      console.log('====================================');
      playerMap.set(userObj, board);
      console.log(playerMap);
      // socket.on('newPlayer', (user, board) => {
      //   const userObj = JSON.parse(user);
      //   console.log('====================================');
      //   console.log(userObj);
      //   console.log('====================================');
      //   playerMap.set(userObj, board);
      //   console.log(playerMap);
      // });
      const mapKeysArray = Array.from(playerMap.keys());
      const mapValuesArray = Array.from(playerMap.values());
      console.log('====================================');
      console.log(mapKeysArray, `gameStarted${mapKeysArray[0]._id}`);
      console.log('====================================');
      const dataObj = {
        // 1: [2, 'f'],
        // mapKeysArray[0]._id: [mapKeysArray[1], mapValuesArray[1], 0],
        // mapKeysArray[1]._id: [mapKeysArray[0], mapValuesArray[0], 1],
      };
      socket.emit(`gameStarted${mapKeysArray[0]._id}`, mapKeysArray[1], mapValuesArray[1], 0);
      socket.emit(`gameStarted${mapKeysArray[1]._id}`, mapKeysArray[0], mapValuesArray[0], 1);
    } else if (playerMap.size > 1) {
      console.log('Too much');
    }
    // for (let user of playerMap.keys()) {
    //   socket.emit(`gameStarted${user.id}`,)
    // }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    clientNumber -= 1;
    // playerMap = new Map();
  });
}

io.on('connect', connected);
server.listen(PORT, () => console.log('Success'));
