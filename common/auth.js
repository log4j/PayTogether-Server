


exports.authUser = function( req, res, next){
  
    if(req.user){
        res.locals.current_user = req.user;
        
        console.log('user in session');
        next();
    }else{
        res.locals.current_user = null;
        console.log('user not in session');
        next();
    }
    
};