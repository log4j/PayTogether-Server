


angular.module('MetronicApp').controller('ActivityEditController', 
function($scope, $state, $stateParams, $timeout, $uibModal, activity, group,
userService, optionService, growl, groupService, activityService, $filter) {
    //if id exists: edit, else : create
    //$scope.activityId = activityId;
    $scope.group = group;
    
    console.log(activity,group);
    
    /**
     * prepare default value
     */
    $scope.activity = {
        date : $filter('date')(new Date(), 'MM/dd/yyyy' ),
        shareByPercentage : true,
        amount : null,
        totalMember : group.users.length,
        totalSelected : group.users.length
        // from : group.users[0]
    };
    
    //set default "from" to current user
    for(var i=0;i<group.users.length;i++)
        if(group.users[i]._id==userService.user._id)
            $scope.activity.from = group.users[i];
    
    /**
     * load activity value if exists
     */
    if(activity){
        
        //console.log(activity.date);
        //console.log($filter('date')(new Date(activity.date), 'MM/dd/yyyy' ));
        
        $scope.activity.shareByPercentage = activity.share_by_percentage;
        $scope.activity.name = activity.name;
        $scope.activity.amount = activity.amount;
        $scope.activity.date = activity.date;
        $scope.activity._id = activity._id;
        
        /**
         * build users map[_id->user] from activity.to
         */
        var toMap = {};
        for(var i=0;i<activity.to.length;i++){
            toMap[activity.to[i].user._id] = activity.to[i];
        }
        
        for(var i=0;i<group.users.length;i++){
            if(group.users[i]._id == activity.from._id)
                $scope.activity.from = group.users[i];
                
            var user = toMap[group.users[i]._id];
            group.users[i].amount = user.amount;
            group.users[i].percentage = user.percentage;
            group.users[i].finalAmount = user.final;
            group.users[i].selected = user.selected;
            // group.users[i].shareByPercentage = user.amount;
        }
        
    }
    
    
    
    $scope.errors={
        name:false,
        from:false,
        amount:false,
        remaining:false,
    }
    
    $scope.calculateFinal = function(){
        var total = 0;
        var size = 0;
        if($scope.activity.shareByPercentage){
            for(var i=0;i<$scope.group.users.length;i++){
                var user = $scope.group.users[i];
                if(user.selected){
                    size ++;
                    if(size != $scope.activity.totalSelected || $scope.activity.remainingPercentage!=0){
                        user.finalAmount = parseFloat(($scope.activity.amount * user.percentage / 100).toFixed(2));    
                        total += user.finalAmount;
                    }else{
                        user.finalAmount = $scope.activity.amount - total;
                    }
                }else{
                    user.finalAmount = 0;
                }
            }
        }else{
            for(var i=0;i<$scope.group.users.length;i++){
                var user = $scope.group.users[i];
                if(user.selected){
                    user.finalAmount = user.amount;
                    
                }else{
                    user.finalAmount = 0;
                }
            }
        }
        $scope.errors.remaining = false;
    }
    
    $scope.summary = function(){
        var totalSelected = 0;
        var totalPercentage = 0;
        var totalAmount = 0;
        for(var i=0;i<$scope.group.users.length;i++){
            
            var user = $scope.group.users[i];
            if(!user.percentage)
                user.percentage = 0;
            if(!user.amount)
                user.amount = 0;
                
            user.tempPercentage = user.percentage;
            user.tempAmount = user.amount;
            user.percentage = parseFloat(user.percentage);
            user.amount = parseFloat(user.amount);
                
            if(user.selected){
                totalSelected ++;
                
                totalPercentage += user.percentage;
                totalAmount += user.amount;
                
            }
        }
        //console.log(totalSelected,totalPercentage);
        
        $scope.activity.totalSelected = totalSelected;
        $scope.activity.remainingPercentage = 100 - totalPercentage;
        $scope.activity.remainingAmount = $scope.activity.amount - totalAmount;
        
        
       $scope.calculateFinal();
       
       for(var i=0;i<$scope.group.users.length;i++){
            var user = $scope.group.users[i];
            user.percentage = user.tempPercentage;
            user.amount = user.tempAmount;
       }
        //console.log($scope.activity.remainingAmount);
    };
    
    
    
    $scope.average = function(){
        var percentageAverage = parseFloat((100 / $scope.activity.totalSelected).toFixed(2));
        // console.log()
        var amountAverage = parseFloat(($scope.activity.amount / $scope.activity.totalSelected).toFixed(2));
        //console.log(percentageAverage,amountAverage);
        var total = 0;
        for(var i=0;i<$scope.group.users.length;i++){
            var user = $scope.group.users[i];
            total ++;
            if(user.selected){
                user.percentage = percentageAverage;
                user.amount = amountAverage;
                //if this is the last member, put all remaining to him
                if(total==$scope.activity.totalSelected){
                    user.percentage = 100 - percentageAverage * (total-1);
                    user.amount = $scope.activity.amount - amountAverage * (total-1);
                }
            }
        }
        
        $scope.activity.remainingPercentage = 0;
        $scope.activity.remainingAmount = 0;
        
        $scope.calculateFinal();
        //$scope.summary();
    };
    
    $scope.chooseAll = function(){
        for(var i=0;i<$scope.group.users.length;i++){
            $scope.group.users[i].selected = true;
        }
        $scope.summary();
        $scope.average();
    };
    if(activity){
        $scope.summary();
    }else{
        $scope.chooseAll();
    }
    
    $scope.submitActivity = function(){
        
        $scope.errors.name = false;
        $scope.errors.from = false;
        $scope.errors.amount = false;
        $scope.errors.remaining = false;
        
        //validate form
        var error = false;
        
        if(!$scope.activity.name){
            error = true;
            $scope.errors.name = true;
            growl.addWarnMessage('Please fill your description for this activity.');
        }
        
        if(!$scope.activity.amount || $scope.activity.amount <=0){
            error = true;
            $scope.errors.amount = true;
            growl.addWarnMessage('Please set a valid amount for this activity.');
        }
        
        if(!$scope.activity.from){
            error = true;
            $scope.errors.from = true;
            growl.addWarnMessage('Please select a member.');
        }
        
        if(($scope.activity.shareByPercentage&&$scope.activity.remainingPercentage!=0)
        ||(!$scope.activity.shareByPercentage&&$scope.activity.remainingAmount!=0)){
            error = true;
            $scope.errors.remaining = true;
            growl.addWarnMessage('Please make sure there is no remaining.');
        }
        
        if(error)
            return;
            
        //if everything is fine, prepare data and submit
        var postData = {
            _id : $scope.activity._id,
            name : $scope.activity.name,
            group : $scope.group._id,
            amount : $scope.activity.amount,
            from : $scope.activity.from._id,
            date : $scope.activity.date,
            share_by_percentage : $scope.activity.shareByPercentage,
            to : []
        }
        for(var i=0;i<$scope.group.users.length;i++){
            var user = $scope.group.users[i];
            postData.to.push({
                user : user._id,
                selected : user.selected,
                percentage : user.percentage,
                amount : user.amount,
                final : user.finalAmount
            })
        }
        
        console.log(postData);
        
        activityService.createOrUpdateActivity(postData)
        .then(function(res){
            console.log(res);
            if(res.result){
                $scope.$close({
                    activity:$scope.activity, 
                    group:$scope.group
                });
            }else{
                growl.showWarnMessage('Something happpened!');
            }
        })
        
        
    }
    
});





angular.module('MetronicApp').controller('TransferEditController', 
function($scope, $state, $stateParams, $timeout, $uibModal, activity, group,
userService, optionService, growl, groupService, activityService, $filter) {
    //if id exists: edit, else : create
    //$scope.activityId = activityId;
    $scope.group = group;
    
    // console.log(activity,group);
    
    /**
     * prepare default value
     */
    $scope.activity = {
        date : $filter('date')(new Date(), 'MM/dd/yyyy' ),
        amount : null,
        totalMember : group.users.length,
        totalSelected : group.users.length
        // from : group.users[0]
    };
    
    //set default "from" to current user
    for(var i=0;i<group.users.length;i++)
        if(group.users[i]._id==userService.user._id)
            $scope.activity.from = group.users[i];
    
    /**
     * load activity value if exists
     */
    if(activity){
        $scope.activity.date = activity.date;
        $scope.activity.name = activity.name;
        $scope.activity.amount = activity.amount;
        $scope.activity._id = activity._id;
        
        /**
         * build users map[_id->user] from activity.to
         */
        var toMap = {};
        for(var i=0;i<activity.to.length;i++){
            toMap[activity.to[i].user._id] = activity.to[i];
        }
        
        for(var i=0;i<group.users.length;i++){
            if(group.users[i]._id == activity.from._id)
                $scope.activity.from = group.users[i];
                
            if(group.users[i]._id == activity.to[0].user._id)
                $scope.activity.to = group.users[i];
                
            // group.users[i].shareByPercentage = user.amount;
        }
        
    }
    
    
    
    $scope.errors={
        amount:false
    }
    
    $scope.submitActivity = function(){
        
        $scope.errors.amount = false;
        
        //validate form
        var error = false;
        
   
        
        if(!$scope.activity.amount || $scope.activity.amount <=0){
            error = true;
            $scope.errors.amount = true;
            growl.addWarnMessage('Please set a valid amount for this activity.');
        }
       
        
        if(error)
            return;
            
        //if everything is fine, prepare data and submit
        var postData = {
            _id : $scope.activity._id,
            name : $scope.activity.name,
            group : $scope.group._id,
            amount : $scope.activity.amount,
            from : $scope.activity.from._id,
            date : $scope.activity.date,
            is_pay : false,
            to : []
        }
        postData.to.push({
            user : $scope.activity.to._id,
            amount : $scope.activity.amount,
            final : $scope.activity.amount
        })
        
        
        console.log(postData);
        
        activityService.createOrUpdateActivity(postData)
        .then(function(res){
            console.log(res);
            if(res.result){
                $scope.$close({
                    activity:$scope.activity, 
                    group:$scope.group
                });
            }else{
                growl.addWarnMessage('Something happpened!');
            }
        })
        
        
    }
    
});