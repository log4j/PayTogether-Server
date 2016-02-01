angular.module('MetronicApp').controller('GroupController', 
function($rootScope, $scope, $state, $http, $timeout, $uibModal,
userService,growl,groupService) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        //App.initAjax();
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    
    console.log('group inited');
    if(userService.getStoredUser()){
        
    }else{
        $state.go('login');
    }
    
    $scope.showDetail = function(group){
        $state.go('group-detail',{groupId:group._id});
    }
    
    $scope.groups = [];
    $scope.$watch(function(){
        return groupService.groupsUpdated;
    },function(){
        if(groupService.groupsUpdated){
            $scope.groups = groupService.groups;
        } 
    });
    
    $scope.fetchGroups = function(){
        groupService.getGroupList(userService.user._id);
    }
    $scope.fetchGroups();
    
    
    $scope.items = [1,2,3];
    
    $scope.startCreateGroup = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            keyboard: false,
            windowTopClass: 'modal-no-border',
            templateUrl : 'views/group-create.html',
            size: 'md',
            controller: 'GroupCreateController',
            resolve : {
                items: function() {
                    console.log('Init '+$scope.items);
                    return $scope.items;
                }
            }
        });
        
        modalInstance.result.then(function(result){
            //refresh page
            $scope.fetchGroups();
        },function(){
            console.log('Modal dismessed at: ' + new Date()); 
        });
        
    }
});

angular.module('MetronicApp').controller('GroupCreateController', 
function($rootScope, $scope, $http, $state, $timeout, $uibModal, items, 
userService, optionService, growl, groupService) {
    
 
    $scope.keyword = "";
    
    $scope.group = {
        color: 'blue',
        icon: 'users',
        users: [{username:userService.user.username,_id:userService.user._id,order:1, status:'verified',type:'self'}]
    }
    
    $scope.addUser = function(username){
        //check if username already exists in users
        for(var i=0;i<$scope.group.users.length;i++){
            console.log(username);
            if(username == $scope.group.users[i].username){
                //$scope.keyword = "";
                
                growl.addWarnMessage("User already exists in group!");
                return ;
            }
        }
        
        var newUser = {
            username: username,
            order: $scope.group.users[$scope.group.users.length-1].order+1,
            status: 'verifying'
        }
        
        $scope.group.users.push(newUser);
        $scope.keyword = "";
        
        $timeout(function(){
            userService.getUserByUsernameOrEmail(newUser.username)
            .then(function(res){
                //console.log(res);
                if(res.result){
                    newUser.username = res.data.username;
                    newUser.email = res.data.email;
                    newUser._id = res.data._id;
                    //check if exist 
                    var exist = 0;
                    var duplicated = -1;
                    for(var i=0;i<$scope.group.users.length;i++){
                        if($scope.group.users[i].username == res.data.username){
                            console.log('test',$scope.group.users[i].username,res.data.username);
                            exist ++;
                            if(exist ==2){
                                duplicated = i;
                                break;
                            }
                        }
                    }
                    if(duplicated >=0 ){
                        $scope.group.users.splice(duplicated,1);
                        growl.addWarnMessage(res.data.username+" and "
                            +res.data.email+" is the same account!");
                    }else{
                        newUser.status = "verified";
                    }
                    
                }else{
                    newUser.status = "fresh";
                }
            });
        },500);
        
        
    }
    
    $scope.removeUser = function($index){
        $scope.group.users.splice($index,1);
    }
    
    $scope.onNameChange = function(){
        $scope.hasError = false;
    }
    
    $scope.submitGroup = function(){
        
        if(!$scope.group.name){
            $scope.hasError = true;
            return;
        }
        
        var postData = {
            name : $scope.group.name,
            creator: userService.user._id,
            color: $scope.group.color,
            icon: $scope.group.icon
        }
        
        var users = [];
        for(var i=0;i<$scope.group.users.length;i++){
            var user = $scope.group.users[i];
            users.push({
                _id:user._id,
                username:user.username,
                email: user.email
               
            });
        }
        postData.users = users;
        
        console.log(postData);
        
        groupService.createGroupList(postData)
        .then(function(res){
            console.log('result:',res); 
            if(res.result){
                growl.addSuccessMessage('Group created!');
                $scope.$close(true);
            }else{
                growl.addWarnMessage('Something happened!');
            }
        });
    }
    
    //console.log($scope.group);
    
    $scope.randomColor = function(){
        $scope.group.color = optionService.randomColor();  
    };
    $scope.randomColor();
    
    $scope.randomIcon = function(){
        $scope.group.icon = optionService.randomIcon();  
    };
    $scope.randomIcon();
    
    
    
    $scope.colors = optionService.colors;
    $scope.icons = optionService.icons;
    
    $scope.cancel = function(){
        $scope.$dismiss('cancel');
    }
});


MetronicApp.controller('GroupDetailController', 
function($scope, $stateParams, $http, $state, $timeout, $uibModal, $filter,
userService, optionService, growl, groupService, alertService, activityService) {
    // console.log($stateParams);
    $scope.groupId = $stateParams.groupId;
    
    if(userService.getStoredUser()){
        
    }else{
        $state.go('login');
    }
    
    
    groupService.getGroup($scope.groupId)
    .then(function(res){
        if(res.result){
            $scope.group = res.data;
            $scope.calculateSpending();
        }
    });
    
    $scope.fetchActivities = function(){
        activityService.getActivityList($scope.groupId)
        .then(function(res){
            if(res.result){
                $scope.activities = res.data;
                $scope.calculateSpending();
            } 
        });
    }
    $scope.fetchActivities();
    
    $scope.calculateSpending = function(){
        // console.log($scope.group);
        // console.log($scope.activities);
        if(!$scope.group)
            return;
        if(!$scope.activities) 
            return;
        
        //build user map and initialize value
        var userMap = {};
        $scope.group.totalSpent = 0;
        for(var i=0;i<$scope.group.users.length;i++){
            $scope.group.users[i].totalPaid = 0;
            $scope.group.users[i].totalSpent = 0;
            $scope.group.users[i].totalReceived = 0;
            $scope.group.users[i].activityHistory = [];
            userMap[$scope.group.users[i]._id] = $scope.group.users[i];
        }
            
            
        for(var i=0;i<$scope.activities.length;i++){
            var act = $scope.activities[i];
            
            //who paid
            userMap[act.from._id].totalPaid += act.amount;
            //who spent
            for(var j=0;j<act.to.length;j++){
                if(act.is_pay)
                    userMap[act.to[j].user._id].totalSpent+=act.to[j].final;
                else
                    userMap[act.to[j].user._id].totalReceived+=act.to[j].final;
                
                
            }
            //total amount
            if(act.is_pay)
                $scope.group.totalSpent += act.amount;
            //else
            
            
            
            //if this is transfer, add 0 to others
            if(!act.is_pay){
                for(var k=0;k<$scope.group.users.length;k++){
                    if($scope.group.users[k]._id == act.to[0].user._id)
                        $scope.group.users[k].activityHistory.push(act.to[0].final);
                    else
                        $scope.group.users[k].activityHistory.push(0);
                }
            }else{
                for(var j=0;j<act.to.length;j++){
                    userMap[act.to[j].user._id].activityHistory.push(act.to[j].final);
                }
            }
            
            
        }
        
        /**
         * in case when try to calculate the rate and divide by zero, make it 0.0001
         * it won't effect the total value since we just display $0.00 
         * */
        if($scope.group.totalSpent==0)
            $scope.group.totalSpent = 0.0001;
        
        // console.log($scope.group);
        // console.log($scope.activities);
        
        //build activity stats data
        var stats = {
            title:['What for'],
            data:[]
        };
        
        for(var i=0;i<$scope.activities.length;i++){
            stats.data.push({
                from:$scope.activities[i].from.displayName,
                amount:$filter('currency')($scope.activities[i].amount, '$', 2),
                name:$scope.activities[i].name,
                type:$scope.activities[i].is_pay?'Pay':'Transfer',
                is_pay: $scope.activities[i].is_pay,
                date: $scope.activities[i].date,
                data:[]
            });   
        }
        
        for(var i=0;i<$scope.group.users.length;i++){
            var user = $scope.group.users[i];
            
            stats.title.push(user.displayName);
            
            
            for(var j=0;j<$scope.activities.length;j++){
                stats.data[j].data.push($filter('currency')(user.activityHistory[j], '$', 2));   
            }
        }
        
        stats.title.push('Amount');
        stats.title.push('Paid By');
        
        console.log(stats);
        
        $scope.stats = stats;
        
        
    }
    
    $scope.startEditActivity = function(activity){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            keyboard: false,
            windowTopClass: 'modal-no-border',
            templateUrl : 'views/activity-edit.html',
            size: 'md',
            controller: 'ActivityEditController',
            resolve : {
                activity: function() {
                    return activity;
                },
                group: function(){
                    return $scope.group;
                }
            }
        });
        
        modalInstance.result.then(function(res){
            //refresh page
            console.log(res.activity,res.group);
            
            //instead of sending another call to backend to get lastest data, change it directly
            // if(res && activity){
            if(false){
                activity.from = res.activity.from;
                activity.name = res.activity.name;
                activity.amount = res.activity.amount;
                activity.share_by_percentage = res.activity.shareByPercentage;
                // activity
                
                var toMap = {};
                for(var i=0;i<res.group.users.length;i++)
                    toMap[res.group.users[i]._id] = res.group.users[i];
                    
                for(var i=0;i<activity.to.length;i++){
                    var to = activity.to[i];
                    var toUser = toMap[to.user._id];
                    to.amount = toUser.amount;
                    to.percentage = toUser.percentage;
                    to.final = toUser.finalAmount;
                    to.selected = toUser.selected;
                }
            }else{
                $scope.fetchActivities();
            }
            
            
            
            
            
            
        },function(){
            console.log('Modal dismessed at: ' + new Date()); 
        });
        
    }
    
    $scope.startEditTransfer = function(activity){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            keyboard: false,
            windowTopClass: 'modal-no-border',
            templateUrl : 'views/transfer-edit.html',
            size: 'md',
            controller: 'TransferEditController',
            resolve : {
                activity: function() {
                    return activity;
                },
                group: function(){
                    return $scope.group;
                }
            }
        });
        
        modalInstance.result.then(function(res){
            //refresh page
            console.log(res.activity,res.group);
            
            //instead of sending another call to backend to get lastest data, change it directly
            // if(res && activity){
            if(false){
                activity.from = res.activity.from;
                activity.name = res.activity.name;
                activity.amount = res.activity.amount;
                activity.share_by_percentage = res.activity.shareByPercentage;
                // activity
                
                var toMap = {};
                for(var i=0;i<res.group.users.length;i++)
                    toMap[res.group.users[i]._id] = res.group.users[i];
                    
                for(var i=0;i<activity.to.length;i++){
                    var to = activity.to[i];
                    var toUser = toMap[to.user._id];
                    to.amount = toUser.amount;
                    to.percentage = toUser.percentage;
                    to.final = toUser.finalAmount;
                    to.selected = toUser.selected;
                }
            }else{
                $scope.fetchActivities();
            }
            
            
            
            
            
            
        },function(){
            console.log('Modal dismessed at: ' + new Date()); 
        });
        
    }
    
    $scope.popEdit = function(activity){
        if(activity.is_pay)
            $scope.startEditActivity(activity);
        else
            $scope.startEditTransfer(activity);
    }
    
    $scope.removeActivity = function(activity){
        alertService.confirm('Are you sure to remove this record?')
        .then(function(res){
            if(res){
                activityService.deleteActivity(activity._id)
                .then(function(actRes){
                    if(actRes.result){
                        growl.addSuccessMessage('Activity removed!');   
                    }else{
                        growl.addErrorMessage('Something happened, removing failed!');
                    }
                    $scope.fetchActivities();
                })
            }
        });
    }
    
   
    $scope.showHintSolve = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            keyboard: false,
            windowTopClass: 'modal-no-border',
            templateUrl : 'views/hint-solve.html',
            size: 'md',
            controller: 'GroupHintController',
            resolve : {
                activities: function() {
                    return $scope.activities;
                },
                group: function(){
                    return $scope.group;
                }
            }
        });
        
        modalInstance.result.then(function(res){
            $scope.fetchActivities();
        },function(){
            console.log('Modal dismessed at: ' + new Date()); 
        });
        
    } 
    
    
    
    $scope.printDiv = function(divName) {
        var printContents = document.getElementById(divName).innerHTML;
        var popupWin = window.open('', '_blank', 'width=300,height=300');
        popupWin.document.open();
        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.close();
    } 


});





/************
 * 
 */

MetronicApp.controller('GroupHintController', function($scope, activities, $filter, activityService,
growl,group) {
    console.log(activities);
    
    console.log(group);
    
    $scope.users = group.users;
    for(var i=0;i<$scope.users.length;i++){
        $scope.users[i].balance = $scope.users[i].totalPaid - $scope.users[i].totalSpent - $scope.users[i].totalReceived;
    }
    
    var solutions = [];
    var pickLowestOne = function(){
        var lowestNegative = group.totalSpent;
        var lowestPositive = group.totalSpent;
        var lowestNegativeUser = null;
        var lowestPositiveUser = null;
        
        for(var i=0;i<$scope.users.length;i++){
            if($scope.users[i].balance>0 && $scope.users[i].balance<=lowestPositive){
                lowestPositive = $scope.users[i].balance;
                lowestPositiveUser = $scope.users[i];
            }
            if($scope.users[i].balance<0 && (-$scope.users[i].balance)<=lowestNegative){
                lowestNegative = 0-$scope.users[i].balance;
                lowestNegativeUser = $scope.users[i];
            }
        }
        
        if(lowestNegativeUser==null)
            return false;
            
        if(lowestNegative < lowestPositive){
            solutions.push({
                from: lowestNegativeUser,
                to: lowestPositiveUser,
                amount: lowestNegative
            });
            lowestNegativeUser.balance = 0;
            lowestPositiveUser.balance = parseFloat((lowestPositiveUser.balance-lowestNegative).toFixed(2)) ;
        }else{
            solutions.push({
                from: lowestNegativeUser,
                to: lowestPositiveUser,
                amount: lowestPositive
            });
            lowestPositiveUser.balance = 0;
            lowestNegativeUser.balance = parseFloat((lowestNegativeUser.balance+lowestPositive).toFixed(2)) ;
        }
        return true;
    }
    
    while(pickLowestOne()==true);
        console.log(solutions);
        
    $scope.solutions = solutions;
    
    $scope.current = 0;
    
    console.log($scope.solutions);
    
    $scope.nextStep = function(){
        var solution = $scope.solutions[$scope.current];
        //submit transfer-activity
        var postData = {
            name : '#solution step '+($scope.current+1),
            group : group._id,
            amount : solution.amount,
            from : solution.from._id,
            date : $filter('date')(new Date(), 'MM/dd/yyyy' ),
            is_pay : false,
            to : []
        }
        postData.to.push({
            user : solution.to._id,
            amount : solution.amount,
            final : solution.amount
        });
        
        activityService.createOrUpdateActivity(postData)
        .then(function(res){
            if(res.result){
                
                growl.addSuccessMessage('Transfer record added!');
                
                if($scope.current+1>=$scope.solutions.length){
                    $scope.$close();
                }
                $scope.current ++;
                
                
            }else{
                growl.addWarnMessage('Something happpened!');
            }
        })
        
        
    }
});