var express = require('express');
var morgan = require('morgan');

module.exports = function(Logger, App, Auth, API, Config, ClientConfig, AuthMiddleware)
{
	App.set('views', 'view');
	App.set('view engine', 'ejs');
	if(this.env != 'dev')
	{
		App.set('view cache', true);
	}
	
	var config = Config.server;
	
	if(config.resourcePath)
	{
		App.use(express.static(config.resourcePath));
	}
	else
	{
		var webpack = require('webpack');
		var devMiddleware = require('webpack-dev-middleware');
		
		var compiler = webpack(require(`${this.config.basePath}/webpack.config`));
		// App.use(require('webpack-hot-middleware')(compiler, {
		// 	log: console.log,
		// }));
		App.use(devMiddleware(compiler, {
			stats: {colors: true},
			inline: true,
			hot: true,
		}));
	}
	
	App.use('/assets', express.static(`${this.config.basePath}/www/assets`), (req, res) => res.status(404).send('Unknown asset'));
	App.use(express.static(`${this.config.basePath}/www/meta`));
	
	Auth.setup(App);
	Auth.routes(App);
	
	App.use((req, res, next) =>
	{
		res.locals.user = req.isAuthenticated() ? req.user.toJSON() : null;
		res.locals.config = ClientConfig;
		next();
	});
	
	App.use(morgan('dev'));
	
	App.use('/api', API);
	
	App.get('/offline', (req, res) => res.render('offline'));
	App.get('*', AuthMiddleware, (req, res) => res.render('webapp'));
	
	this.queue(() =>
	{
		App.use((err, req, res, next) =>
		{
			Logger.error(err.stack || err);
			res.render('error', {
				error: err,
				status: res.statusCode,
			});
		});
	});
}