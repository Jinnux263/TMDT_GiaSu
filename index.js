HOST = "http://localhost";
PORT = 3000;

const bodyParser = require("body-parser");
const express = require("express");
app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.send(`Server is running at ${HOST}:${PORT}`);
});

app.listen(PORT, () => {
  console.log("Server is listening...");
});
