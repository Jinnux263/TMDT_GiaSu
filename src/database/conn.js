const mongoose = require('mongoose');

const DB_URL = process.env.MONGODB_URL;
const db = mongoose.connection;
//connect db
mongoose
  .connect(DB_URL, { useNewUrlParser: true })
  .then(() => console.log('DB Connected!'));

db.on('error', (err) => {
  console.log('DB connection error:', err.message);
});

// module.exports = db;
