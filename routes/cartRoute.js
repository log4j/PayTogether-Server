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

var Commodity = require('../models').Commodity;
var Cart = require('../models').Cart;


var fs = require('fs');

exports.createItem = function (req, res, next){
    var cart = new Cart();
    cart.user = req.body.user;
    cart.commodity = req.body.commodity;
    cart.amount = req.body.amount;
    cart.save(function(err,item){
        if(err){
            res.json({result:false,err:err});
        }else{
            res.json({result:true,data:item});
        }
    })
};



exports.getItem = function (req, res, next) {

    var itemId = req.param('id');
    if (itemId) {
        var query = Commodity.findById(itemId);
        //query.populate('user','lastname avatar');
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

    var query = Cart.find({"user":req.query.user})
    //.populate('user','lastname avatar')
    .populate('commodity','name price images')

    .exec(function(err,list){
        if(err)
            return res.json(Results.ERR_DB_ERR);
        return res.json({result:true,data:list});
    });
};

exports.updateItem = function (req, res, next){
    var id = req.param('id');


    if(!id){
        return res.json(Results.ERR_PARAM_ERR);
    }

    Cart.findById(id,function(err,item){
        if(err)
            return res.json(Results.ERR_DB_ERR);
        for(var key in req.body){
            item[key] = req.body[key];
        }
        item.save(function(saveErr,saveItem){
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

    Cart.findById(id).remove(function(err){
        if(err)
            return res.json(Results.ERR_DB_ERR);
        return res.json({result:true});
    })

};
