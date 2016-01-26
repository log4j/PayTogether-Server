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

var Pay = require('../models').Pay;
var Group = require('../models').Group;

var fs = require('fs');

exports.createItem = function (req, res, next){
    var pay = new Pay();
    pay.group = req.body.group;
    pay.from = req.body.from;
    pay.to = req.body.to;
    pay.split_percentage = req.body.split_percentage;
    pay.split_amount = req.body.split_amount;
    pay.is_pay = req.body.is_pay;
    pay.amount = req.body.amount;
    pay.memo = req.body.memo;
    
    pay.save(function(err,item){
        if(err){
            res.json(Results.ERR_DB_ERR);
        }else{
            //update Group
            Group.findById(pay.group, function(groupErr, item){
                if(groupErr)
                    return res.json(Results.ERR_DB_ERR);
                    
                Group.pays.push(item._id);
                Group.save(function(groupSaveErr){
                    if(groupSaveErr)
                        return res.json(Results.ERR_DB_ERR);
                        
                    return res.json({result:true,data:item}); 
                });
            });
        }
    });

};



exports.getItem = function (req, res, next) {

    var itemId = req.param('id');
    if (itemId) {
        var query = Pay.findOne({'order_no':itemId});
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

    var query = Pay.find({"group":req.query.group});
    //query.populate('user','lastname avatar');
    query.populate('from','firstname lastname avatar','User');
    query.populate('to','firstname lastname avatar','User');
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

    Pay.findById(id,function(err,pay){
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
        if(req.body.memo)
            pay.memo = req.body.memo;
    
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
    Pay.findById(id).remove(function(err){
        if(err)
            return res.json(Results.ERR_DB_ERR);
        return res.json({result:true});
    })

};
