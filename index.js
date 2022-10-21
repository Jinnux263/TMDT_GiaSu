require('dotenv').config();
const expressFileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const cors = require('cors');

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

const URI = process.env.MONGODB_URL;

app.get('/', function (req, res) {
  res.send(`Server is running at ${HOST}:${PORT}`);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

// app.use('/user', require('./routers/users.route'));
// app.use('/api', require('./routers/category.route'));
// app.use('/api', require('./routers/upload'));
// app.use('/api', require('./routers/products.route'));
// app.use('/api', require('./routers/payments.route'));
