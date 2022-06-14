require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://0.0.0.0:27017/aroundb');

app.use(express.json());
app.use(helmet());
app.use((req, res, next) => {
  req.user = { _id: '628410cc3b24b82df2516edc' };
  next();
});
app.use('/', usersRouter, cardsRouter);
app.use('/', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.listen(PORT);

// process.on('uncaughtException', (err, origin) => {
//   console.log(`${origin} ${err.name} with the message
//   ${err.message} was not handled. Pay attention to it!`);
// });
