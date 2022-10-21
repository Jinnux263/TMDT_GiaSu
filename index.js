require('dotenv').config();
const expressFileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

HOST = 'http://localhost';
PORT = process.env.PORT || 3000;

app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  expressFileUpload({
    useTempFiles: true,
  }),
);

const DB_URL = process.env.MONGODB_URL;
const db = mongoose.connection;
//connect db
mongoose
  .connect(DB_URL, { useNewUrlParser: true })
  .then(() => console.log('DB Connected!'));
db.on('error', (err) => {
  console.log('DB connection error:', err.message);
});

app.get('/', function (req, res) {
  res.send(`Server is running at ${HOST}:${PORT}`);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.use('/user', require('./src/routers/users.route'));
app.use('/api', require('./src/routers/category.route'));
app.use('/api', require('./src/routers/products.route'));
app.use('/api', require('./src/routers/payments.route'));
