const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGOURL

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })