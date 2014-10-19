
var home = require('./routes/home');
var others = require('./routes/others');
var sign = require('./routes/sign');

var passport = require('passport');

module.exports = function (app) {

	console.log('routes!!');

	//show login
	app.get('/login', sign.showLogin);

	app.post('/login', 
		passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
		function(req, res){
			res.redirect('/dashboard');
		});

	// home page
	app.get('/dashboard', home.dashboard);
	// sitemap
	//app.get('/sitemap.xml', site.sitemap);



	app.get('/example', others.example);

};