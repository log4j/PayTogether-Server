
var flash = require('connect-flash')
  , express = require('express')
  , passport = require('passport')
  , util = require('util')
  , LocalStrategy = require('passport-local').Strategy;


exports.showLogin = function(req,res){
	var errors = req.flash("error");

	req.flash('hi','asdf');

	console.log(req.flash('hi'));



	res.render('login',{errors:errors});
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