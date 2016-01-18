/**
 * Created by yangmang on 9/7/15.
 */


var express = require('express');
var router = express.Router();
var config = require('../config');
var fs = require('fs');

var Results = require('./commonResult');
var imageTool = require('../common/imageTool');


/**
 * upload one image, return image file name if success
 * @param req
 * @param res
 * @param next
 */

exports.uploadImage = function (req, res, next) {

    //console.log('hihi');
    //console.log(req);
    //console.log('req.file',req.file);
    imageTool.uploadImage(req.file,'market',function(err,imageName){
        if(err){
            console.log('update avatar err:',err);
              res.json(Results.ERR_PARAM_IMAGE);
        }else{
            return res.json({result:true,image:imageName});
        }
    });
};
