var flash = require('connect-flash'),
    express = require('express'),
    passport = require('passport'),
    util = require('util'),

    LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');
var EventProxy = require('eventproxy');
var tools = require('../common/tools');
var Results = require('./commonResult');
var imageTool = require('../common/imageTool');
var User = require('../models').User;


var fs = require('fs');

var md5 = require('MD5');


exports.test = function (req, res, next) {
    res.json(Results.ERR_DB_ERR);
};

exports.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.json({
        result: false,
        err: 'ERR_NOT_ALLOWED'
    });

};

exports.login = function (req, res, next){
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            console.log(err);
            return next(err);
        }
        if (!user) {
            return res.json({
                result: false,
                err: info
            });
            //return res.redirect('/m_login_failure?callback='+req.body.callback);
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }

            var user = {};
            user.id = req.user._id;
            user.username = req.user.username;
            user.firstname = req.user.firstname;
            user.lastname = req.user.lastname;
            user.gender = req.user.gender;
            user.avatar = req.user.avatar;

            return res.json({
                id: user.id,
                result: true,
                data: req.user
            });

        });
    })(req, res, next);
};


/**
 * check email & password
 * @param req
 * @param res
 * @param next
 */
exports.createUser = function (req, res, next) {


    var user = new User();
    user.email =  req.body.email;
    user.password = req.body.password;
    user.username = req.body.username;

    if(tools.isEmpty(user.email)||tools.isEmpty(user.password)){
        return res.json(Results.ERR_PARAM_ERR);
    }

    user.password = md5(user.password);


    var ep = new EventProxy();
    ep.all('checkEmail','checkUsername', function () {
        user.save(function (err, user) {

            if (err)
                res.json({result:false,err:err});
            else
                res.json({
                    result: true,
                    id: user.id
                });
        });
    });

    ep.fail(function (err) {
        res.json({
            result: false,
            err: err
        });
    });

    User.findOne({
        email: user.email
    }, function (err, item) {
        if (item != null) {
            ep.emit("error", 'ERR_EXISTED_EMAIL');
        } else {
            ep.emit('checkEmail');
        }
    });
    
    User.findOne({
        username: user.username
    }, function (err, item) {
        if (item != null) {
            ep.emit("error", 'ERR_EXISTED_NAME');
        } else {
            ep.emit('checkUsername');
        }
    });
    
};

exports.getUserList = function (req, res, next) {


    var query = {$and:[]};
    if (req.query.gender)
        query.$and.push({gender:req.query.gender});
        
    if(req.query.usernameOrEmail)
        query.$and.push({
            $or:[
                {username:req.query.usernameOrEmail},
                {email:req.query.usernameOrEmail}
                ]
            });


    User.find(
        query,
        function (err, users) {
            if (err) {
                res.json(Object.assign(Results.ERR_DB_ERR,{msg:err}));
            } else {
                
               // console.log(users[0].age,users[0].displayName);
                res.json({
                    result: true,
                    data: users
                });
            }
        });
};



exports.getUser = function (req, res, next) {
    var userId = req.param('id');
    if (userId) {
        User.findById(userId,
            function (err, user) {
                if (err) {
                    res.json(Results.ERR_DB_ERR);
                }else{

                    var data = {
                        id:user.id,
                        first_name: user.firstname,
                        last_name: user.lastname,
                        gender: user.gender,
                        avatar: user.avatar,
                        avatar_url: user.avatar_url,
                        basic_visible: user.basic_visible,
                        habit_visible: user.habit_visible,
                        rent_duration: user.rent_duration,
                        rent_start: user.rent_start,
                        max_roommates: user.max_roommates,
                        seeking: user.seeking
                    };

                    //console.log(req.user._id,user._id);
                    //console.log(req.user.id,user.id);
                    //console.log(user.toObject());

                    var userObject = user.toObject();
                    /**
                     *
                     */
                    if(req.user.id == user.id){
                        //console.log('same');
                        User.schema.eachPath(function(path){

                            //console.log(path);
                            if(userObject.hasOwnProperty(path)){
                                //console.log('yes!');
                                data[path] = userObject[path];

                            }
                        });
                    }
                    else{

                        if(user.basic_visible){
                            data.birthday = user.birthday;
                            data.description = user.description;
                        }

                        if(user.habit_visible){
                            data.smoking = user.smoking;
                            data.drinking = user.drinking;
                            data.cooking = user.cooking;
                            data.pet = user.pet;
                        }

                    }

                    res.json({result:true,data:data});
                }
            });
    } else {
        res.json(Results.ERR_URL_ERR);
    }
};

exports.updateUser = function(req,res,next){
    var userId = req.param('id');
    if (userId) {

        var data = {};
        User.schema.eachPath(function(path){
            if(req.body.hasOwnProperty(path))
                data[path] = req.body[path];
        });

        //console.log(data);
        //console.log(req.body);

        User.update({_id:userId},data,function(err, user){
            if(err)
                res.json(Results.ERR_DB_ERR);
            return res.json({result:true,data:user});
        });
    } else {
        res.json(Results.ERR_URL_ERR);
    }
};


exports.updateAvatar = function (req, res, next) {
    //console.log(req);
    //console.log('req.file',req.file);
    imageTool.uploadImage(req.file,'avatar',function(err,imageName){
        //if(err){
            console.log('update avatar err:',err);
          //  res.json(Results.ERR_PARAM_IMAGE);
        //}else{
            User.update({_id:req.user.id},{'avatar':imageName}, function(updateErr, user){
                if(updateErr){
                    return res.json(Results.ERR_DB_ERR);
                }
                return res.json({result:true,image:imageName});
            });
        //}
    });
};


