var express = require('express');
var router = express.Router();
var config = require('../config');
var Group = require('../proxy').Group;
var User = require('../proxy').User;
var Pay = require('../proxy').Pay;
var EventProxy = require('eventproxy');
var validator = require('validator');




/**
 * show create group form page
 */ 
exports.create_group_init = function (req, res, next){

    var title = '';
    var groupid = req.param('id');
    
    console.log('group id:'+groupid);
    
    var ep = new EventProxy();
    ep.all('group',function(group){
        res.render('creategroup',{title:title,group:group});
    });
    
    ep.fail(function(err){
        next(err);
    })
    
    if(groupid){
        title = 'Edit Group';
        Group.getGroupWithUserInfoById(groupid, function(err,group){
            
            Pay.getRelatedUserIdsByGroupId(groupid, function(err, idlist){
                group.relatedUsers = idlist;
                ep.emit('group',group);
            });
        });
    }else{
        title = 'Create new Group';
        ep.emit('group',null);
    }
    
    
};


/**
 * submit group form page via POST
 */ 
exports.create_group_submit = function (req, res, next){
    
    
    var name = validator.trim(req.body.name);
    var type = validator.trim(req.body.type);
    var color = validator.trim(req.body.color);
    var amount = validator.trim(req.body.amount);
    var members = JSON.parse(validator.trim(req.body.members));
    
    
    
    var groupid = validator.trim(req.body.groupid);
    
    
    if(groupid){
        //if groupid != null, update existed group
        Group.updateGroup(groupid,name,type,amount,color,members,function(err, group){
             if(err)
                 return res.send(err);

            res.redirect('/summary/'+groupid);
        });
        
    }else{
        // if groupid == null, create a new group
        //check if input has errors
        var ep = new EventProxy();
        ep.fail(next);
        ep.on('input_err', function(msg){
            console.log('error mesg:'+msg);

            res.render('creategroup', {title:'',name:name,type:type,color:color,amount:amount});
        });


        if([name,type,color,amount].some(function(item){return item ==null||item==''})){
            return ep.emit('input_err', 'Please check you input');   
        }

        //var flow = new EventProxy();
        //flow.all('


        Group.newAndSaveAndAddMembersIn(name, req.user.id, type, amount, color, members,function(err,group){
            if(err)
                return res.send(err);
            res.redirect('/summary/'+group._id);
        });
    }

    
    
};

exports.create_group_submit_mobile = function(req, res, next){
    
    var obj = JSON.parse(req.param("obj"));
    
    var name = obj.name;
    var type = obj.type;
    var color = config.randomCardColor();
    var amount = obj.expected_amount;
    var members = obj.users;
    
    
    
    
    var groupid = obj.id;
    
    
    if(groupid){
        //if groupid != null, update existed group
        Group.updateGroup(groupid,name,type,amount,color,members,function(err, group){
             if(err)
                 return res.jsonp(err);

            res.jsonp({groupid:groupid});
        });
        
    }else{
        // if groupid == null, create a new group
        //check if input has errors
        var ep = new EventProxy();
        ep.fail(next);
        ep.on('input_err', function(msg){
            console.log('error mesg:'+msg);
            res.render('creategroup', {title:'',name:name,type:type,color:color,amount:amount});
        });


        if([name,type,color,amount].some(function(item){return item ==null||item==''})){
            return ep.emit('input_err', 'Please check you input');   
        }

        //var flow = new EventProxy();
        //flow.all('


        Group.newAndSaveAndAddMembersIn(name, req.user.id, type, amount, color, members,function(err,group){
            if(err)
                return res.send(err);
            res.jsonp({groupid:group._id});
        });
    }

};

exports.list_group = function (req, res, next){
    
    var ep = new EventProxy();
    ep.all('groups',function(groups){
        res.render('group', {
            title: 'Group',
            groups: groups
        });
    });
    
    ep.fail(function(){
        res.render('group', {
            title: 'Group',
            groups:[]
        });
    });
            
    Group.getGroupsByUserId(req.user.id,ep.done('groups'));
};