const express = require('express');
const app  =  express();
const userRouter = require('./Routes/user')
const infoRouter = require('./Routes/data')
const morgan = require('morgan')
const cors = require('cors')
app.use(morgan('tiny'))
app.use(cors())
require('./mongoose/URI')
app.use('/userapi',userRouter)
app.use('/detailsapi',infoRouter)
app.listen(3000)