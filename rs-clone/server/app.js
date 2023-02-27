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
  cors: {
    origin: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  },
});
// Multer

const connections = [null, null];
io.on('connection', (socket) => {
  io.emit('message', 'User 111 connected');
  let playerIndex = -1;
  for (const i in connections) {
    if (connections[i] === null) {
      playerIndex = i;
      break;
    }
  }
  if (playerIndex === -1) return;
  socket.emit('player-number', playerIndex);
  console.log(`a user ${playerIndex} connected`);
});
server.listen(PORT, () => console.log('Success'));
