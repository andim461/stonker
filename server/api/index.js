const express = require('express');
const authRouter = require('./auth');
const stocksRouter = require('./stocks');

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/stocks', stocksRouter);

module.exports = apiRouter;
