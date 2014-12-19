var models = require('../models');
var tools = require('../common/tools.js');
var Group = models.Group;
var User = models.User;
var Pay = models.Pay;
var GroupProxy = require('../proxy').Group;

var EventProxy = require('eventproxy');



exports.newAndSave = function(data, callback){
    
    var pay = new Pay();
    pay.group = data.group;
    pay.from = data.from;
    pay.to = data.to;
    pay.isPay = data.isPay;
    pay.memo = data.memo;
    pay.amount = data.amount;
    pay.save(function(err){
        if(err)
            return callback(err);
        
        //update group pay amount, re-calculor
        GroupProxy.updatePayAmount(data.group,callback);
    });
};

/**
 * get pay information by group id
 */ 
exports.getPayByGroupid = function(group, callback){
    Pay.find({group:group},callback);
}

/**
 * get pay list by groupid
 * user id in pay will be replaced by user detail
 */ 
exports.getPayWithUserInfoByGroupid = function(group, callback){
    Pay.find({group:group},function(err, pays){
        if(err)
            return callback(err);
        
        return exports.fillPayWithUserInfo(pays, callback);
    });
}

exports.fillPayWithUserInfo = function(pays, callback){
    
    
    //collect all the user ids
    var ids = [];
    for(var i=0;i<pays.length;i++){
        var pay = pays[i];
        ids.push(pay.from);
        if(pay.to!=null){
            for(var j=0;j<pay.to.length;j++)
                ids.push(pay.to[j]);
        }
    }

    //get users info
    User.find({_id:{'$in':ids}}).select('_id name avatar').exec(function(err, users){
        if(err)
            return callback(err);

        var idMap = [];
        for(var i=0;i<users.length;i++){
            idMap[users[i]._id] = users[i];   
        }
        for(var i=0;i<pays.length;i++){
            var pay = pays[i];
            pay.fromUser = idMap[pay.from];
            if(pay.to!=null){
                pay.toUser = [];
                for(var j=0;j<pay.to.length;j++){
                    pay.toUser.push(idMap[pay.to[j]]);
                }
            }else{
                pay.toUser = null;
            }
        }

        callback(null, pays);
    });
};

exports.getResentPayByUserId = function(user, callback){
    User.findById(user,function(err, user){
        if(err)
            return callback(err);
        
        Pay.find({'group':{'$in':user.groups}}).sort('-create_at')
            .exec(function(err,pays){
            if(err)
                return callback(err);
            return exports.fillPayWithUserInfo(pays, callback);
        });
        
    });
}

/**
 * return the id list of who has been metioned in the given group
 * 'metioned' means user id is in a pay/transfer record [from/to] under that group
 */ 
exports.getRelatedUserIdsByGroupId = function(groupid, callback){
    Pay.find({group:groupid},function(err, pays){
        if(err)
            return callback(err);
        var result = [];
        for(var i=0;i<pays.length;i++){
            var pay = pays[i];
            result.pushIfNotExist(pay.from.toString());
            if(pay.to){
                for(var j=0;j<pay.to.length;j++)
                    result.pushIfNotExist(pay.to[j].toString());
            }
        }
        
        callback(null, result);
    });
};