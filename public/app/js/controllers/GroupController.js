angular.module('MetronicApp').controller('GroupController', 
function($rootScope, $scope, $state, $http, $timeout, $uibModal,
userService,growl) {
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
    
    $scope.showToast = function(){
        console.log('showed');
        growl.addWarnMessage("User already exists in group!");
        
    }
    
    
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
        
        modalInstance.result.then(function(selectedItem){
            console.log('selected item',selectedItem);
        },function(){
            console.log('Modal dismessed at: ' + new Date()); 
        });
        
    }
});

angular.module('MetronicApp').controller('GroupCreateController', 
function($rootScope, $scope, $http, $state, $timeout, $uibModal, items, 
userService, optionService, growl) {
    
 
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
                console.log(res);
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
            creator: userService.user._id
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