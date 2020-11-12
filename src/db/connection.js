const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })