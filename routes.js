
var home = require('./routes/home');
var others = require('./routes/others');


module.exports = function (app) {

	console.log('routes!!');
  // home page
  app.get('/dashboard', home.dashboard);
  // sitemap
  //app.get('/sitemap.xml', site.sitemap);


  app.get('/example', others.example);

};