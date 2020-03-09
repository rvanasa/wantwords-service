var express = require('express');
var compression = require('compression');

module.exports = function()
{
	var app = express();
	app.use(compression());
	
	return app;
}