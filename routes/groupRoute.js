/**
 * Created by yangmang on 9/7/15.
 */


var flash = require('connect-flash'),
    express = require('express'),
    passport = require('passport'),
    util = require('util'),
    LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');
var EventProxy = require('eventproxy');
var tools = require('../common/tools');
var Results = require('./commonResult');

var Activity = require('../models').Activity;
var Group = require('../models').Group;
var User = require('../models').User;

var fs = require('fs');

exports.createItem = function (req, res, next){
    var group = new Group();
    group.name = req.body.name;
    group.creator = req.body.creator;
    group.color = req.body.color;
    group.icon = req.body.icon;
    
    var users = req.body.users;
    
    console.log('req.body',req.body);
    //group.fresh_users = req.body.fresh_users;
    
    //not all users have _id, create invisible user account for those users
    var inVisibleUsers = [];
    var visibleUserIds = [];
    for(var i=0;i<users.length;i++){
        if(!users[i]._id){
            inVisibleUsers.push(users[i]);
        }else{
            visibleUserIds.push(users[i]._id);
        }
    }
    
    var userEP = EventProxy();
    userEP.after('createInvisibleUser',inVisibleUsers.length,function(newUsers){
        for(var i=0;i<newUsers.length;i++){
            visibleUserIds.push(newUsers[i]._id);
        }
        console.log('visible user id:',visibleUserIds);
        group.users = visibleUserIds;
        
        group.save(function(err,item){
            if(err){
                return res.json(Object.assign(Results.ERR_DB_ERR,{msg:'fail to create group:'+err}));
            }else{
                //update each user in Group
                var ep = EventProxy();
                ep.after('userUpdated',item.users.length,function(list){
                    return res.json({result:true,data:item});
                });
                ep.fail(function (err) {
                    return res.json(Object.assign(Results.ERR_DB_ERR,{msg:'can not update all users'+err}));
                });
                for(var i=0;i<item.users.length;i++){
                    User.findById(item.users[i], function (userErr, user){
                        if(userErr)
                            return ep.emit('error',userErr);
                        else{
                            user.groups.push(item._id);
                            user.save(ep.done('userUpdated'));
                        }
                    });
                }
            }
        });
        
    });
    userEP.fail(function(err){
        return res.json(Object.assign(Results.ERR_DB_ERR,{msg:'can not create all invisible users'+err}));
    });
    
    for(var i=0;i<inVisibleUsers.length;i++){
        var user = new User();
        user.username = user._id;
        user.firstname = inVisibleUsers[i].username;
        user.email = user._id +'@paytogether.me';
        user.invisible = true;
        user.invitor = users[0]._id;
        user.save(userEP.done('createInvisibleUser'));
    }
    
    
};



exports.getItem = function (req, res, next) {

    var itemId = req.param('id');
    if (itemId) {
        var query = Group.findById(itemId);
        query.populate('users','username email firstname lastname avatar invisible','User');
        query.exec(function(err,item){
            if(err){
                res.json(Results.ERR_DB_ERR);
            }else{
                res.json({result:true,data:item});
            }
        });
    }else{
        res.json(Results.ERR_PARAM_ERR);
    }
};

/**
 * get records list
 * query:
 * page&size&query
 * @param req
 * @param res
 * @param next
 */
exports.getList = function (req, res, next) {

    if(!req.query.user){
        return res.json(Results.ERR_PARAM_ERR);
    }

    var query = User.findById(req.query.user);
    //query.populate('user','lastname avatar');
    query.populate('groups','name users color icon','Group');
    query.sort({create_at:-1});
    query.exec(function(err,item){
        if(err)
            return res.json(Results.ERR_DB_ERR);
            
        // Group.populate(item.groups)
            
        return res.json({result:true,data:item.groups});
    });
};

exports.updateItem = function (req, res, next){
    var id = req.param('id');

    if(!id){
        return res.json(Results.ERR_PARAM_ERR);
    }

    Group.findById(id,function(err,group){
        if(err)
            return res.json(Object.assign(Results.ERR_DB_ERR,{msg:err}));
        
        if(req.body.name)
            group.from = req.body.name;

        if(req.body.fresh_users){
            group.fresh_users = req.body.fresh_users;
        }
        
        var toRemoveUser = [];
        var toAddUser = [];

        if(req.body.users){
            //check which user is removed and which one is new
            var existUser = {};
            for(var i=0;i<group.users.length;i++){
                existUser[group.users[i]] = 1;
            }
            for(var i=0;i<req.body.users.length;i++){
                if(existUser[req.body.users[i]]){
                    existUser[req.body.users[i]] = 2;
                }else{
                    toAddUser.push(req.body.users[i]);
                }
            }
            for(var i=0;i<group.users.length;i++){
                if(existUser[group.users[i]] == 1){
                    toRemoveUser.push(group.users[i]);
                }
            }
            group.users = req.body.users;
        }

        group.save(function(saveErr,saveItem){
            if(saveErr){
                return res.json(Results.ERR_DB_ERR);
            }else{
                if(toRemoveUser.length>0 || toAddUser.length>0){
                    var ep = EventProxy();
                    ep.atfer('userUpdated',toRemoveUser.length+toAddUser.length,function(list){
                        return res.json({result:true,data:saveItem});
                    });
                    ep.bind('error', function (err) {
                        ep.unbind();
                        return res.json(Object.assign(Results.ERR_DB_ERR,{mes:'can not update all users'}));
                    });
                    for(var i=0;i<toRemoveUser.length;i++){
                        User.findById(toRemoveUser[i],function(userFindErr,targetUser){
                            if(userFindErr)
                                return ep.emit('error');
                            var newGroupList = [];
                            for(var j=0;j<targetUser.groups.length;j++)
                                if(targetUser.groups[j]!=saveItem._id)
                                    newGroupList.push(targetUser.groups[i]);
                            targetUser.groups = newGroupList;
                            targetUser.save(function(userSaveErr){
                                if(userSaveErr)
                                    return ep.emit('error');
                                else
                                    return ep.emit('userUpdated');
                            });
                        });
                    }
                    for(var i=0;i<toAddUser.length;i++){
                        User.findById(toAddUser[i],function(userFindErr,targetUser){
                            if(userFindErr)
                                return ep.emit('error');
                            targetUser.groups.push(saveItem._id);
                            targetUser.save(function(userSaveErr){
                                if(userSaveErr)
                                    return ep.emit('error');
                                else
                                    return ep.emit('userUpdated');
                            });
                        });
                    }
                }else{
                    return res.json({result:true,data:saveItem});
                }
            }
            
        });
    });
};

exports.deleteItem = function(req, res, next){
    var id = req.param('id');
    if(!id){
        return res.json(Results.ERR_PARAM_ERR);
    }
    Group.findById(id).remove(function(err,item){
        if(err)
            return res.json(Results.ERR_DB_ERR);
        updateGroupInUsers(id,[],item.users,function(updateErr){
            if(updateErr)
                return res.json(Results.ERR_DB_ERR);
            return res.json({result:true});
        })
    })

};

function updateGroupInUsers (groupId,toAddUser,toRemoveUser,callback){
    if(toRemoveUser.length>0 || toAddUser.length>0){
        var ep = EventProxy();
        ep.atfer('userUpdated',toRemoveUser.length+toAddUser.length,function(list){
            return callback(null);
        });
        ep.bind('error', function (err) {
            ep.unbind();
            return callback('can not update all users');
        });
        for(var i=0;i<toRemoveUser.length;i++){
            User.findById(toRemoveUser[i],function(userFindErr,targetUser){
                if(userFindErr)
                    return ep.emit('error');
                var newGroupList = [];
                for(var j=0;j<targetUser.groups.length;j++)
                    if(targetUser.groups[j]!=groupId)
                        newGroupList.push(targetUser.groups[i]);
                targetUser.groups = newGroupList;
                targetUser.save(function(userSaveErr){
                    if(userSaveErr)
                        return ep.emit('error');
                    else
                        return ep.emit('userUpdated');
                });
            });
        }
        for(var i=0;i<toAddUser.length;i++){
            User.findById(toAddUser[i],function(userFindErr,targetUser){
                if(userFindErr)
                    return ep.emit('error');
                targetUser.groups.push(groupId);
                targetUser.save(function(userSaveErr){
                    if(userSaveErr)
                        return ep.emit('error');
                    else
                        return ep.emit('userUpdated');
                });
            });
        }
    }else{
        return callback(null);
    }
}