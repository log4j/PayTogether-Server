var express = require('express');
var router = express.Router();
var config = require('../config');
var Group = require('../proxy').Group;
var User = require('../proxy').User;
var Pay = require('../proxy').Pay;
var EventProxy = require('eventproxy');
var validator = require('validator');


/**
 * show add a payment form page
 */
exports.add_pay_init = function (req, res, next) {

    var groupid = req.param('id');
    User.getUsersByGroupId(groupid, function (err, users) {
        if (err)
            return next();

        if(req.body.callback||req.param("callback")){
            res.jsonp({
                title: 'Add Pay',
                users: users,
                groupid: groupid
            });
        }else{
            res.render('addpay', {
                title: 'Add Pay',
                users: users,
                groupid: groupid
            });
        }

        
    });


};

/**
 * submit the form
 */
exports.add_pay_submit = function (req, res, next) {

    var groupid = req.param('id');
    var type = req.body.type;
    var amount = parseFloat(req.body.amount);
    var forWho = req.body.for_who;
    var forWhoList = req.body.for_who_list;
    var memo = req.body.memo;
    var toWho = req.body.to_who;

    var saveObj = new Object();
    saveObj.group = groupid;
    saveObj.from = req.user.id;
    saveObj.isPay = type == 'pay';
    saveObj.memo = memo;
    saveObj.amount = amount;
    if (saveObj.isPay) {
        if (forWho == 'list')
            saveObj.to = forWhoList;
        else
            saveObj.to = null;
    } else {
        saveObj.to = [];
        saveObj.to.push(toWho);
    }


    Pay.newAndSave(saveObj, function (err) {
        if (err)
            res.send(err);
        else
            res.redirect('/summary/'+groupid);
    });

};

exports.add_pay_submit_mobile = function(req, res, next){

    var obj = JSON.parse(req.param("obj"));

    var groupid = obj.groupid;
    var type = obj.type;
    var amount = obj.amount;
    var forWho = "list";
    var forWhoList = obj.for_who_list;
    var memo = obj.memo;
    var toWho = obj.to_who;

    var saveObj = new Object();
    saveObj.group = groupid;
    saveObj.from = req.user.id;
    saveObj.isPay = type == 'pay';
    saveObj.memo = memo;
    saveObj.amount = amount;
    if (saveObj.isPay) {
        if (forWho == 'list')
            saveObj.to = forWhoList;
        else
            saveObj.to = null;
    } else {
        saveObj.to = [];
        saveObj.to.push(toWho);
    }


    Pay.newAndSave(saveObj, function (err) {
        var result = {};
        if (err)
            result.result = false;
        else{
            result.result = true;
            result.groupid = groupid;
        }
        res.jsonp(result);
    });

};

var findSolution = function (pays, group){
    //how many people;
    var size = group.member_amount;
    
    // a map to store how much every member costs, initialize with 0
    var spend = [];
    
    var paid = [];
    
    var diff = [];
    for(var i=0;i<size;i++){
        spend[group.users[i]] = 0;
        paid[group.users[i]] = 0;
        diff[group.users[i]] = 0;
    }
    
    console.log(diff+" size:"+size);
    for(var i=0;i<size;i++){
        console.log(diff[group.users[i]] );
    }
    
    //loop the pay list
    for(var i=0;i<pays.length;i++){
        var pay = pays[i];
        if(pay.isPay){
            //record for pay
            
            //incease the paid value for whom paid this record
            paid[pay.from]+=parseFloat(pay.amount);
            var forWho = pay.to;
            if(forWho == null || forWho.length==0)
                forWho = group.users;
            
            //increase the spend value for those who share this cost
            var value = pay.amount / forWho.length;
            for(var j=0;j<forWho.length;j++)
                spend[forWho[j]]+=value;
        }else{
            //record for transfer
            
            //incease the paid value for whom paid this record
            paid[pay.from]+=pay.amount;
            //decease the paied value for who reviced this transfer
            paid[pay.to[0]]-=pay.amount;
        }
    }
    
    /**
     * calculate the difference
     * 
     * value > 0  means member should tranfer money to others
     */ 
    
    for(var i=0;i<size;i++){
        diff[group.users[i]] = spend[group.users[i]] - paid[group.users[i]];
        if(Math.abs(diff[group.users[i]])<0.02)
            diff[group.users[i]] = 0;
    }
    
    //save difference data
    var solution = new Object();
    var difList = [];
    for(var i=0;i<size;i++){
        difList[i] = new Object();
        difList[i].user = group.users[i];
        difList[i].name = group.userInfo[i].name;
        difList[i].avatar = group.userInfo[i].avatar;
        difList[i].value = diff[group.users[i]];
    }
    solution.diff = difList;
    
    
    //find the simplest solution
    var todo = [];
    var unfinishFlag = true;
    while(unfinishFlag){
        //find who has the smallest difference (exclude zero)
        var smallest = -1;
        var smallestUser = '';
        var smallestIndex = 0;
        // who has the biggest positive difference
        var posiBig = 0;
        var posiBigUser = '';
        var posiBigIndex = 0;
        // who has the biggest negative difference
        var negaBig = 0;
        var negaBigUser = '';
        var negaBigIndex = 0;
        
        for(var i=0;i<size;i++){
            var rawValue = diff[group.users[i]];
            var absValue = Math.abs(rawValue);
            //ignore when current user is already balanced
            if(absValue<0.01){
                diff[group.users[i]] = 0;
                continue;
            }
            
            if(smallest==-1){
                smallest = absValue;
                smallestUser = group.users[i];   
                smallestIndex = i;
            }
            if(smallest>absValue){
                smallest = absValue;
                smallestUser = group.users[i];
                smallestIndex = i;
            }
            
            if(posiBig<rawValue){
                posiBig = rawValue;
                posiBigUser = group.users[i];
                posiBigIndex = i;
            }
            
            if(negaBig>rawValue){
                negaBig = rawValue;
                negaBigUser = group.users[i];
                negaBigIndex = i;
            }
            
        }
        
        if(smallest.toFixed(2)>0){
            //find another member to transfer/be transfered with this smallest user
            var rawValue = diff[smallestUser];
            var todoObj = new Object();
            if(rawValue > 0){
                todoObj.from = group.userInfo[smallestIndex];
                todoObj.to = group.userInfo[negaBigIndex];
                todoObj.amount = smallest;
                diff[smallestUser] = 0;
                diff[negaBigUser]+=smallest;
                if(Math.abs(diff[negaBigUser])<0.01)
                    diff[negaBigUser] = 0;
            }else{
                todoObj.to = group.userInfo[smallestIndex];
                todoObj.from = group.userInfo[posiBigIndex];
                todoObj.amount = smallest;
                diff[smallestUser] = 0;
                diff[posiBigUser]-=smallest;
                if(Math.abs(diff[posiBigUser])<0.01)
                    diff[posiBigUser] = 0;
            }
            todo.push(todoObj);
        }else{
            //everyone is balanced, set finish flag
            unfinishFlag = false;
            break;
        }
    }
    
    
    
    solution.todo = todo;
    return solution;
};

/**
 * show the sumarry page
 */
exports.show_summary_page = function (req, res, next) {
    //get groupid
    var groupid = req.param('id');

    var ep = new EventProxy();
    ep.all('pays', 'group', function (pays, group) {
        
        var solution = findSolution(pays, group);
        
        if(req.body.callback||req.param("callback")){

            var paysArray = [];
            for(var i=0;i<pays.length;i++){
                var obj = JSON.parse(JSON.stringify(pays[i]));
                obj.fromUser = pays[i].fromUser;
                obj.toUser = pays[i].toUser;
                paysArray.push(obj);
            }
            res.jsonp({
                title: 'Summary',
                pays: paysArray,
                group: group,
                solution: solution
            });
        }else{
            res.render('summary', {
                title: 'Summary',
                pays: pays,
                group: group,
                solution: solution
            });   
        }
        
    });
    ep.fail(function (err) {
        next(err);
    });

    //prepare pay list
    Pay.getPayWithUserInfoByGroupid(groupid, ep.done('pays'));

    //prepare group data
    Group.getGroupWithUserInfoById(groupid, ep.done('group'));
    
    //
};

exports.show_pay_page = function (req, res, next){
    
    var ep = new EventProxy();
    
    ep.all('pays', 'groupMap', function( pays ,groupMap){
        res.render('pays',{title:'Pays',pays:pays,groupMap:groupMap});
    });
    
    ep.fail(function(err){
        next(err);
    });
    
    Pay.getResentPayByUserId(req.user.id, ep.done('pays'));
    
    Group.getUserGroupsInfo(req.user.id, ep.done('groupMap'));
};