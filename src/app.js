'use strict';

const path = require('path');
const express = require('express');

let app = express();

app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api', require('./api'));

let port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening on port', port));

module.exports = app;