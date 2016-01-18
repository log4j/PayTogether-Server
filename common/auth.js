
var config = require('../config.js');

exports.authUser = function( req, res, next){
  
    if(req.user){
        res.locals.current_user = req.user;
        
        console.log('user in session');
        next();
    }else{
        
        var cookie = req.cookies[config.auth_cookie_name];
        
        if(cookie){
            
        }
        
        res.locals.current_user = null;
        console.log('user not in session');
        next();
    }
    
};