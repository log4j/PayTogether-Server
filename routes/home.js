var express = require('express');
var router = express.Router();
var config = require('../config');

var cvWebnames = ['lindalin','yangmang'];

var Group = require('../proxy').Group;

var User = require('../proxy').User;


var EventProxy = require('eventproxy');



exports.dashboard = function (req, res, next) {

    console.log('in exports.dashboard');

    var isJsonp = req.query.callback;
    
    var ep = new EventProxy();
    ep.all('groups',function(groups){
        if(isJsonp){
            return res.jsonp(groups);
        }else{
            res.render('dashboard', {
                title: 'Home',
                groups: groups
            });
        }
        
    });
    
    ep.fail(function(){
        res.render('dashboard', {
            title: 'Home',
            groups:[]
        });
    });
            
    Group.getGroupsByUserId(req.user.id,ep.done('groups'));
    
    
    
};



exports.home = function (req, res, next) {

    if(req.user){
        return exports.dashboard(req,res,next);
    }

    res.render('welcome', {
        title: 'Home'
    });
};


exports.websiteFilter = function (req, res, next) {

    var host = req.headers.host;

    for (var i = 0; i < cvWebnames.length; i++) {
        if (host.indexOf(cvWebnames[i]) >= 0) {
            res.render(cvWebnames[i]);
            return;
        }
    }

    next();

};

exports.test = function (req, res, next) {
    User.getUserByLoginName('yangmang', function (err, user) {

        /*
        Group.newAndSave('test group1',user.id,function(err){
            if(err==null){
                res.send("created!");   
            }else{
                res.send(err);
            }
        });
        */

        Group.getGroupsByUserId(user.id, function (err, groups) {
            var data = '';
            for (var i = 0; i < groups.length; i++) {
                data += groups[i].name + '<br>';
            };
            res.send(data);
        });

        /*
        Group.addUserIntoGroup(user.id,'54611d9a49d8216a04830e24',function(err){
            if(err==null){
                res.send("added!");   
            }else{
                res.send(err);
            }
        });
        */


        //res.send(user.id); 
    });
};

exports.test_add_group = function (req, res, next) {
    User.getUserByLoginName('yangmang', function (err, user) {

        /*
        Group.newAndSave('test group2', user.id, function (err, group) {
            if (err == null) {
                res.send("created!");
            } else {
                roup.addUserIntoGroup(user.id, group.id, function (err) {
                    if (err == null) {
                        res.send("added!");
                    } else {
                        res.send(err);
                    }
                });

                res.send(err);
            }
        });
        */

        /*
        Group.addUserIntoGroup(user.id, '546157bd23c84a140633073a', function (err) {
            if (err == null) {
                res.send("added!");
            } else {
                res.send(err);
            }
        });
        */
        
        User.setDefaultAvatar();
        res.send('ok');
        
    });
};