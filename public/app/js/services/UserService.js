

MetronicApp.factory('userService', function($http,$timeout,localStorageService,settings) {
    // supported languages
    var userService = this;


    this.user = null;
    
    
    console.log(settings);
    
    this.register = function (postData){
        return $http.post(settings.host+'/user',postData)
            .then(commonResponseHandler,errResponseHandler);
    };
    
    this.getStoredUser = function(){
        var user = localStorageService.get('user');
        if(user){
            userService.user = user;
            console.log(user);
            return user;
        }
        return null;  
    };

    this.login = function (postData) {
        return $http.post(settings.host + '/login', postData)
            .then(function(res){
                if(res.data){
                    console.log(res.data);
                    userService.user = res.data.data;
                    localStorageService.set('user',userService.user);
                    return commonResponseHandler(res);              
                }else{
                    return errResponseHandler(res);
                }
            }, errResponseHandler);  
    };

    this.logout = function(){
        return $timeout(function(){
            localStorageService.remove('user');
            return {result:true};
        },200);
    };
    
    this.getUserByUsernameOrEmail = function(username){
        return $http.get(settings.host+'/user?usernameOrEmail='+username)
        .then(function(res){
            if(res && res.data){
                if(res.data.data && res.data.data.length){
                    return {result:true,data:res.data.data[0]};
                }else{
                    return {result:false};
                }
            }else{
                return {result:false};
            }
        },errResponseHandler);  
    };

    return userService;
});