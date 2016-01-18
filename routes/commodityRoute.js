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


var fs = require('fs');



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

    var page = tools.parsePageQuery(req.query);

    var queryPara = {};

    if (req.query.query) {
        queryPara.name = {"$regex": req.query.query, "$options": "i"};
    }

    var query = Commodity.find(queryPara);
    query.sort({update_at:-1});
    query.skip(page.start).limit(page.size);

    //query.populate('user','lastname avatar');

    query.exec(function (err, list) {
        if (err) {
            res.json(Results.ERR_DB_ERR);
        } else {
            res.json({result: true, data: list});
        }
    });
};

