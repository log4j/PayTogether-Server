

MetronicApp.factory('groupService', function($http,settings) {
    // supported languages
    var groupService = this;
    
    this.groups = [];
    this.groupsUpdated = null;

    this.getGroupList = function(userId){
        return $http.get(settings.host+'/group?user='+userId)
        .then(function(res){
            if(res.data && res.data.data){
                groupService.groups = res.data.data;
                groupService.groupsUpdated = new Date();
            }   
            return commonResponseHandler(res);
        },errResponseHandler);
    }
    
    this.createOrEditGroupList = function(postData){
        if(postData._id){
            return $http.put(settings.host+'/group/'+postData._id, postData)
            .then(commonResponseHandler,errResponseHandler);
        }else{
            return $http.post(settings.host+'/group',postData)
            .then(commonResponseHandler,errResponseHandler);
        }
        
    }
    
    this.getGroup = function(groupId){
        return $http.get(settings.host+'/group/'+groupId)
        .then(function(res){
            if(res.data && res.data.result){
                // for(var i=0;i<res.data.data.users.length;i++){
                //     var user = res.data.data.users[i];
                //     if(user.invisible){
                //         if(user.firstname)
                //             user.displayName = user.firstname;
                //         else
                //             user.displayName = user.username;
                //         user.tag = '';
                //     }else{
                //         if(user.firstname || user.lastname){
                //             user.displayName = user.firstname+' '+user.lastname;
                //         }else{
                //             user.displayName = user.username;
                //         }
                //         user.tag = user.email;
                //     }
                // }
                return {result:true,data:res.data.data};
            }else{
                return {result:false};
            }
        },errResponseHandler);
    }
    
    this.removeGroup = function(groupId){
        return $http.delete(settings.host+'/group/'+groupId)
        .then(commonResponseHandler,errResponseHandler);
    }

    return groupService;
});