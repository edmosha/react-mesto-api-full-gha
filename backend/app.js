require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose').default;
const bodyParser = require('body-parser');
const index = require('./routes/index');

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(cors({
  origin: ['http://localhost:3000', 'https://api.mesto.edmosha.nomoredomains.rocks'],
  credentials: true,
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', index);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
