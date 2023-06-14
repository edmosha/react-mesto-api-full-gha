require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose').default;
const bodyParser = require('body-parser');
const helmet = require('helmet');
const index = require('./routes/index');
const limiter = require('./utils/rateLimite');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(limiter);

app.use(helmet());

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://mesto.edmosha.nomoredomains.rocks',
    'https://mesto.edmosha.nomoredomains.rocks',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  maxAge: 3000,
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', index);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
