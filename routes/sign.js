
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

exports.submitLogin = function(req,res){

}