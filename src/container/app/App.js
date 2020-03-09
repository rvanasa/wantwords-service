var express = require('express');
var compression = require('compression');

module.exports = () => {

    var app = express();
    app.use(compression());

    return app;
};