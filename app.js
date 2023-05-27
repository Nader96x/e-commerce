const express = require('express');
const morgan = require('morgan');

const app = express();

// MiddleWares
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev')); // log the URL
}

app.use(express.json());

module.exports = app;
