var models = require('../models');
var tools = require('../common/tools.js');
var Group = models.Group;
var User = models.User;
var Pay = models.Pay;


var EventProxy = require('eventproxy');



/**
 * get group via ObjectId
 */
exports.getGroupById = function (id, callback) {
    if (id == null) {
        return callback(null, null);
    }
    Group.findOne({
        '_id': id
    }, callback);
};

/**
 * get group via ObjectId, results will be filled with user info
 */
exports.getGroupWithUserInfoById = function (id, callback) {
    if (id == null) {
        return callback(null, null);
    }
    Group.findOne({
        '_id': id
    }, function(err, group){
        //collect all the user ids
        //get users info
        User.find({_id:{'$in':group.users}}).select('_id name avatar').exec(function(err, users){
            if(err)
                return callback(err);
            
            //keep in the same order
            var userMap = [];
            var newList = [];
            for(var i=0;i<users.length;i++){
                userMap[users[i]._id] = users[i];
            }
            for(var i=0;i<group.users.length;i++){
                newList.push(userMap[group.users[i]]);
            }
            group.userInfo = newList;
            
            callback(null, group);
            
        });
    });
};

/**
 * create a group
 */
exports.newAndSave = function (name, creator, callback) {
    var group = new Group();
    group.name = name;
    group.creator = creator;
    //group.member_amount = 1;
    //group.users = [creator];

    group.save(callback);
};

/**
 * create a group and add the creator into that group
 */ 
exports.newAndSaveAndAddMembersIn = function (name, creator, type, expected_amount,color, members, callback){
    var group = new Group();
    group.name = name;
    group.creator = creator;
    group.card_icon = type;
    group.card_color = color;
    //group.member_amount = 1;
    //group.users = [creator];
    
    group.member_amount = members.length;
    group.users = members;
    group.expected_amount = expected_amount;
    
    group.save(function(err){
        if(err){
            return callback(err);
        }
        //return addUserIntoGroup();
        
        //console.log('new and save and add :'+group.id);
        
        
        //update users data
        var ep = new EventProxy();
        ep.after('add_user',members.length,function(content){
            callback(null,group);
        });
        ep.fail(callback);
        
        //find user and add current group id into their groups
        User.find({'_id':{'$in':members}},function(err, users){
            for(var i=0;i<users.length;i++){
                users[i].groups.push(group.id);
                users[i].save(ep.done('add_user'));
            }
        });
        
        
        //return exports.addUserIntoGroup(creator, group.id, callback);
        //return callback();
    });
    
};

exports.getGroupsByUserId = function (userid, callback) {
    User.findById(userid, function(err, user) {
        if (err)
            return callback(err);

        Group.find({
            '_id': {
                '$in': user.groups
            }
        }).sort('-create_at').exec(function(err, groups){
            callback(err,groups);
        });
    });

};

/**
 * add a user into a group
 */
exports.addUserIntoGroup = function (userid, groupid, callback) {
    Group.findOne({
        '_id': groupid
    }, function (err, group) {
        if (err)
            return callback(err);

        //add user_id into group
        group.users.push(userid);
        group.member_amount++;
        group.save(function () {
            //add group_id into user

            User.findById(userid, function (err, user) {
                if (err)
                    return callback(err);

                if (user.groups == null)
                    user.groups = [];

                user.groups.push(groupid);

                user.save(callback);
                //callback(null);
            });
        });

    });
};

/**
 * add users into a group
 */
exports.addUsersIntoGroup = function (userid, groupid, callback) {
    Group.findOne({
        '_id': groupid
    }, function (err, group) {
        if (err)
            return callback(err);

        //add user_id into group
        group.users.push(userid);
        group.member_amount++;
        group.save(function () {
            //add group_id into user

            User.findById(userid, function (err, user) {
                if (err)
                    return callback(err);

                if (user.groups == null)
                    user.groups = [];

                user.groups.push(groupid);

                user.save(callback);
                //callback(null);
            });
        });

    });
};

/**
 * remove a user from a group
 */
exports.removeUserFromGroup = function (userid, groupid, callback) {
    Group.findById(groupid, function (err, group) {
        if (err)
            return callback(err);

        //remove userid from group.users
        group.users.remove(userid);
        group.member_amount--;
        group.save(function (err) {

            User.findById(userid, function (err, user) {
                if (err)
                    return callback(err);

                if (user.groups == null)
                    user.groups = [];

                user.groups.remove(groupid);
                user.save(callback);
                //callback(null);
            });
        });

    });

};

/**
 * re-calculate the pay amount information in group and update it
 */ 
exports.updatePayAmount = function(groupid, callback){
    Pay.find({group:groupid},function(err, pays){
        var total = 0.0;
        for(var i=0;i<pays.length;i++){
            if(pays[i].isPay)
                total+=pays[i].amount;
        }
        Group.update({_id:groupid},{'$set':{pay_amount:total}},callback);
    });
};

exports.getUserGroupsInfo = function(userid, callback){
    User.findById(userid, function(err, user){
        if(err)
            return callback(err);
        Group.find({_id:{'$in':user.groups}}, function(err, groups){
            if(err)
                return callback(err);
            var map = [];
            for(var i=0;i<groups.length;i++)
                map[groups[i]._id] = groups[i];
            return callback(null, map);
        });
    });
};


/**
 * 
 */ 
exports.updateGroup = function(groupid, name, type, amount, color, members, callback){
    Group.findById(groupid, function(err, group){
        if(err)
            return callback(err);
        
        var deletedUsers = group.users.minusAsString(members);
        
        
        group.name = name;
        group.card_color = color;
        group.card_icon = type;
        group.update_at = new Date();
        group.expected_amount = amount;
        group.member_amount = members.length;
        group.users = members;
        
        

        group.save(function(err){
            if(err){
                return callback(err);
            }
            //return addUserIntoGroup();

            //console.log('new and save and add :'+group.id);
            

            //update users data
            var epAll = new EventProxy();
            epAll.all('add_all_user', 'remove_all_user',function(add_all_user,remove_all_user){
                callback(null);
            });
            epAll.fail(callback);
            
            var epAdd = new EventProxy();
            epAdd.after('add_user',members.length,function(){
                epAll.emit('add_all_user');
            });
            epAdd.fail(callback);

            
            
            //find user and add current group id into their groups
            User.find({'_id':{'$in':members}},function(err, users){
                for(var i=0;i<users.length;i++){
                    users[i].groups.pushIfNotExist(group.id);
                    users[i].save(epAdd.done('add_user'));
                }
            });
            
            var eppRemove = new EventProxy();
            eppRemove.after('remove_user',deletedUsers.length,function(){
                epAll.emit('remove_all_user');
            });
            eppRemove.fail(callback);
            User.find({'_id':{'$in':deletedUsers}},function(err, users){
                for(var i=0;i<users.length;i++){
                    users[i].groups.remove(group.id);
                    users[i].save(eppRemove.done('remove_user'));
                }
            });
            
            
            //return exports.addUserIntoGroup(creator, group.id, callback);
            //return callback();
        });

    });
};