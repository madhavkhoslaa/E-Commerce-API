const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGOURL;
console.log(url);
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
