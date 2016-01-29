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

var fs = require('fs');

exports.createItem = function (req, res, next){
    var activity = new Activity();
    activity.group = req.body.group;
    activity.from = req.body.from;
    activity.to = req.body.to;
    activity.users = req.body.users;
    activity.share_by_percentage = req.body.share_by_percentage;
    activity.amount = req.body.amount;
    activity.name = req.body.name;
    activity.is_pay = req.body.is_pay;
    if(req.body.date)
        activity.date = req.body.date;
    
    activity.save(function(err,item){
        if(err){
            res.json(Object.assign(Results.ERR_DB_ERR,{msg:err}));
        }else{
            //update Group
            Group.findById(activity.group, function(groupErr, group){
                if(groupErr)
                    return res.json(Object.assign(Results.ERR_DB_ERR,{msg:groupErr}));
                    
                group.activities.push(activity._id);
                group.save(function(groupSaveErr){
                    if(groupSaveErr)
                        return res.json(Object.assign(Results.ERR_DB_ERR,{msg:groupSaveErr}));
                        
                    return res.json({result:true,data:item}); 
                });
            });
        }
    });

};



exports.getItem = function (req, res, next) {

    var itemId = req.param('id');
    if (itemId) {
        var query = Activity.findOne({'order_no':itemId});
        query.populate('items.commodity','name price images','Commodity');
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

    if(!req.query.group){
        return res.json(Results.ERR_PARAM_ERR);
    }

    var query = Activity.find({"group":req.query.group});
    //query.populate('user','lastname avatar');
    query.populate('from','username firstname displayName tag lastname avatar invisible','User');
    query.populate('to.user','username firstname displayName tag lastname avatar invisible','User');
    query.sort({create_at:-1});
    query.exec(function(err,list){
        if(err)
            return res.json(Object.assign(Results.ERR_DB_ERR,{msg:err}));
        return res.json({result:true,data:list});
    });
};

exports.updateItem = function (req, res, next){
    var id = req.param('id');

    if(!id){
        return res.json(Results.ERR_PARAM_ERR);
    }

    Activity.findById(id,function(err,pay){
        if(err)
            return res.json(Results.ERR_DB_ERR);
        
        if(req.body.from)
            pay.from = req.body.from;
        if(req.body.to)
            pay.to = req.body.to;
        if(req.body.split_percentage)
            pay.split_percentage = req.body.split_percentage;
        if(req.body.split_amount)
            pay.split_amount = req.body.split_amount;
        if(req.body.is_pay == true || req.body.is_pay==false)
            pay.is_pay = req.body.is_pay;
        if(req.body.amount)
            pay.amount = req.body.amount;
        if(req.body.name)
            pay.name = req.body.name;
        if(req.body.date)
            pay.date = req.body.date;
    
    
        pay.save(function(saveErr,saveItem){
            if(saveErr){
                return res.json(Results.ERR_DB_ERR);
            }
            return res.json({result:true,data:saveItem});
        });
    });
};

exports.deleteItem = function(req, res, next){
    var id = req.param('id');
    if(!id){
        return res.json(Results.ERR_PARAM_ERR);
    }
    Activity.findById(id,function(activityErr, activity){
        
        if(activityErr)
            return res.json(Object.assign(Results.ERR_DB_ERR,{msg:activityErr}));
            
        activity.remove(function(err){
            if(err)
                return res.json(Object.assign(Results.ERR_DB_ERR,{msg:err}));
            
            console.log('remove activity',activity);
            
            Group.findById(activity.group,function(err, group){
                for(var i=0;i<group.activities.length;i++)
                    if(group.activities[i]==id){
                        group.activities.splice(i,1);
                        break;
                    }
                group.save(function(groupSaveErr){
                    if(err)
                        return res.json(Object.assign(Results.ERR_DB_ERR,{msg:groupSaveErr}));
                    else
                        return res.json({result:true});
                })
            })    
            
        })  
    });

};
