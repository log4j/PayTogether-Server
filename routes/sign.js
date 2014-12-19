
var flash = require('connect-flash')
  , express = require('express')
  , passport = require('passport')
  , util = require('util')
  , LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');
var eventproxy = require('eventproxy');
var tools = require('../common/tools');
var User = require('../proxy').User;

exports.showLogin = function(req,res){
	var errors = req.flash("error");

	//req.flash('hi','asdf');

	//console.log(req.flash('hi'));



	res.render('login',{errors:errors});
};


exports.register = function(req, res, next){
	var loginname = validator.trim(req.body.loginname).toLowerCase();
	var email = validator.trim(req.body.email).toLowerCase();
	var password = validator.trim(req.body.password);
	var rePassword = validator.trim(req.body.re_password);
	var errors = [];
	
	var eproxy = new eventproxy();
	eproxy.fail(next);
	eproxy.on('register_err', function(msg){
		errors.push(msg);
		res.status(422);
		res.render('login',{showRegister:true,errors:errors, loginname:loginname, email:email});
	});

	if ([loginname, password, rePassword, email].some(function (item) { return item === ''; })) {
		eproxy.emit('register_err', '信息不完整。');
		return;
	}
	if (loginname.length < 5) {
		eproxy.emit('register_err', '用户名至少需要5个字符。');
		return;
	}
	if (!tools.validateId(loginname)) {
		return eproxy.emit('register_err', '用户名不合法。');
	}
	if (!validator.isEmail(email)) {
		return eproxy.emit('register_err', '邮箱不合法。');
	}
	if (password !== rePassword) {
		return eproxy.emit('register_err', '两次密码输入不一致。');
	}
    
    
    //Existance checking : name & email
    var epOK = new eventproxy();
    epOK.all('loginnameok','emailok',function(){
        User.newAndSave(loginname,loginname,password,email,'default.png',function(err){
                if (err) {
                  return next(err);
                }
                return res.render('login',{success:'Welcome, '+loginname+'!'});
            });
    });

    // finding user, exist then return error info
    User.getUserByLoginName(loginname, function(err,loginUser){
        if(loginUser!=null)
            return eproxy.emit('register_err', 'Login Name has alread been registered');
        else{
            return epOK.emit('loginnameok','');
        }
    });
    
    // finding user, exist then return error info
    User.getUserByMail(email, function(err,emailUser){
        if(emailUser!=null)
            return eproxy.emit('register_err', 'Email has alread been registered');
        else{
            return epOK.emit('emailok','');
        }
    });

};

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
exports.ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) { 
		return next(); 
	}
	res.redirect('/login');

};

exports.logout = function(req, res){
	req.logout();
	res.redirect('/');
};

exports.submitLogin = function(req,res){

};