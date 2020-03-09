// var spdy = require('spdy');

module.exports = function(App, Config, Turn)
{
	// var Server = spdy.createServer({
	// 	spdy: {
	// 		plain: true,
	// 	},
	// }, App);
	
	// return Server.listen(Config.server.port || process.env.PORT || 80);
	return App.listen(Config.server.port || process.env.PORT || 80);
}