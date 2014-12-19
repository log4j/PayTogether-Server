var flash = require('connect-flash')
  , express = require('express')
  , passport = require('passport')
  , util = require('util')
  , LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');
var eventproxy = require('eventproxy');
var tools = require('../common/tools');
var User = require('../proxy').User;




exports.jsonGetUserByName = function(req, res){
    
    
    User.getUserByName(req.query.name, function(err, user){
        var ret = null;
        if(user){
          ret = {};
          ret.id = user._id;
          ret._id = user._id;
          ret.name = user.name;
          ret.avatar = user.avatar;

        }
        if(req.query.callback){
          res.jsonp(ret);
        }else{
          res.json(ret);
        }
            
    });
};


/**
 * get user infor and present Profile page
 */ 
exports.show_profile = function(req, res, next){
    res.render('profile',{title:'Profile'});
};