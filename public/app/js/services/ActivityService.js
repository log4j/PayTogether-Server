

MetronicApp.factory('activityService', function($http,settings,utils) {
    // supported languages
    var activityService = this;
    
    this.groups = [];
    this.groupsUpdated = null;

    this.getActivityList = function(groupId){
        return $http.get(settings.host+'/activity?group='+groupId)
        .then(function(res){
            // if(res.data && res.data.data){
            //     for(var i=0;i<res.data.data.)
            //     utils.prepareUsersInfo(res.data.data.to)
            // }   
            return commonResponseHandler(res);
        },errResponseHandler);
    }
    
    this.createOrUpdateActivity = function(postData){
        if(postData._id){
            return $http.put(settings.host+'/activity/'+postData._id,postData)
            .then(commonResponseHandler,errResponseHandler);
        }else{
            return $http.post(settings.host+'/activity',postData)
            .then(commonResponseHandler,errResponseHandler);
        }
    }
    
    this.deleteActivity = function(activityId) {
        return $http.delete(settings.host+'/activity/'+activityId)
        .then(commonResponseHandler,errResponseHandler);
    }
    
    this.getGroup = function(groupId){
        return $http.get(settings.host+'/group/'+groupId)
        .then(function(res){
            if(res.data && res.data.result){
                for(var i=0;i<res.data.data.users.length;i++){
                    var user = res.data.data.users[i];
                    if(user.invisible){
                        if(user.firstname)
                            user.displayName = user.firstname;
                        else
                            user.displayName = user.username;
                        user.tag = '';
                    }else{
                        if(user.firstname || user.lastname){
                            user.displayName = user.firstname+' '+user.lastname;
                        }else{
                            user.displayName = user.username;
                        }
                        user.tag = user.email;
                    }
                }
                return {result:true,data:res.data.data};
            }else{
                return {result:false};
            }
        },errResponseHandler);
    }

    return activityService;
});