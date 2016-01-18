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
var Order = require('../models').Order;


var fs = require('fs');


exports.createItem = function (req, res, next){
    var order = new Order();
    order.user = req.body.user;
    order.price_before_tax = req.body.price_before_tax;
    order.price_tax = req.body.price_tax;
    order.items = req.body.items;
    order.phone = req.body.phone;
    order.ship_address = req.body.ship_address;
    order.billing_address = req.body.billing_address;

    //generate order number
    Order.findOne({}).sort({ create_at: -1 }).exec(function(err,item){
        var previousNo;
        if(item && item.order_no){
            previousNo = parseInt(item.order_no);
        }else{
            previousNo = 10000000;
        }
        var nextNo = previousNo + parseInt(Math.random()*1000);
        order.order_no = nextNo+'';
        order.save(function(err,item){
            if(err){
                res.json({result:false,err:err});
            }else{

                //empty cart!
                if(item.user){
                    Cart.remove({user:item.user},function(err,result){
                        res.json({result:true,data:item});
                    });
                }else{
                    res.json({result:true,data:item});
                }



            }
        });
    });


};



exports.getItem = function (req, res, next) {

    var itemId = req.param('id');
    if (itemId) {
        var query = Order.findOne({'order_no':itemId});
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

    if(!req.query.user){
        return res.json(Results.ERR_PARAM_ERR);
    }

    var query = Order.find({"user":req.query.user});
    //query.populate('user','lastname avatar');
    query.populate('items.commodity','name price images','Commodity');
    query.sort({create_at:-1});
    query.exec(function(err,list){
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

    Order.findById(id,function(err,item){
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

    Order.findById(id).remove(function(err){
        if(err)
            return res.json(Results.ERR_DB_ERR);
        return res.json({result:true});
    })

};
