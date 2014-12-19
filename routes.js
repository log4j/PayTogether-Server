var home = require('./routes/home');
var others = require('./routes/others');
var sign = require('./routes/sign');
var group = require('./routes/group');
var user = require('./routes/user');
var pay = require('./routes/pay');

var passport = require('passport');

module.exports = function (app) {

    //console.log('routes!!');


    app.use(home.websiteFilter);

    //show login
    app.get('/login', sign.showLogin);


    app.post('/login',
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: true
        }),
        function (req, res) {
            res.redirect('/dashboard');
        }
    );
    app.get('/logout', sign.logout);


    app.post('/register', sign.register);

    // home page
    app.get('/', home.home);
    app.get('/dashboard', sign.ensureAuthenticated, home.dashboard);
    // sitemap
    //app.get('/sitemap.xml', site.sitemap);


    app.get('/creategroup', sign.ensureAuthenticated, group.create_group_init);

    app.get('/editgroup/:id', sign.ensureAuthenticated, group.create_group_init);

    app.post('/creategroup', sign.ensureAuthenticated, group.create_group_submit);

    app.get('/m_creategroup', sign.ensureAuthenticated, group.create_group_submit_mobile);

    app.get('/example', others.example);

    app.get('/test', home.test);

    app.get('/testadd', home.test_add_group);


    app.get('/group', sign.ensureAuthenticated, group.list_group);


    app.get('/getuserinfo', user.jsonGetUserByName);

    /**
     * pay add
     */
    app.get('/pay/add/:id', sign.ensureAuthenticated, pay.add_pay_init);
    //submit by post
    app.post('/pay/add/:id', sign.ensureAuthenticated, pay.add_pay_submit);

    app.get('/pay/m_add', sign.ensureAuthenticated, pay.add_pay_submit_mobile);


    app.get('/pay', sign.ensureAuthenticated, pay.show_pay_page);

    //show summary page
    app.get('/summary/:id', sign.ensureAuthenticated, pay.show_summary_page);

    //show profile
    app.get('/profile', sign.ensureAuthenticated, user.show_profile);


    app.get('/m_login_submit', function(req, res, next) {
      passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            return res.jsonp({result: false, message:info}); 
            //return res.redirect('/m_login_failure?callback='+req.body.callback); 
        }
        req.logIn(user, function(err) {
          if (err) { return next(err); }

          var user = {};
                user.id = req.user._id;
                user.name = req.user.name;
                user.avatar = req.user.avatar;
                //user.

               return res.jsonp({
                    user:user,
                    result: true
                });

          //return res.redirect('/users/' + user.username);
        });
      })(req, res, next);
    });

    
    // for mobile
    app.get('/m_login_submit_1', passport.authenticate('local', {
            failureRedirect: '/m_login_failure?callback=',
            failureFlash: true
        }),
        function (req, res) {
            var user = {};
            user.name = req.user.name;
            user.avatar = req.user.avatar;
            //user.

            res.jsonp({
                user:user,
                result: true
            });
        });
    app.get('/m_login_failure', function (req, res) {
        res.jsonp({result: false, message:req.flash("error")});
    });
    
    app.get('/m_is_login', function(req, res){
        res.jsonp(req.user!=null);
    });
};