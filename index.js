require('dotenv').config();
require('./src/database/db-connection');
const expressFileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require('body-parser');

HOST = 'http://localhost';
PORT = process.env.PORT || 3000;

app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  expressFileUpload({
    useTempFiles: true,
  }),
);

app.get('/', function (req, res) {
  res.send(`Server is running at ${HOST}:${PORT}`);
});
app.use('/grade', require('./src/routers/grade.route'));
app.use('/subject', require('./src/routers/subject.route'));
app.use('/', require('./src/routers/auth.route'));
app.use('/user', require('./src/routers/user.route'));
app.use('/customer', require('./src/routers/customer.route'));
app.use('/course', require('./src/routers/course.route'));
app.use('/tutor', require('./src/routers/tutor.route'));
app.use('/transaction', require('./src/routers/transaction.route'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
