
/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', function($scope, $state, userService, $uibModal,$stateParams,
alertService, groupService) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
    
    
    
    $scope.$watch(function(){
        return groupService.groupsUpdated;
    },function(){
        if(groupService.groupsUpdated){
            $scope.groups = groupService.groups;
            //console.log($scope.groups);
        }else{
            //console.log(userService.user);
            //if(userService.user)
            //    groupService.getGroupList(userService.user._id);
        }
    })
    
    $scope.$watch(function(){
        return userService.userUpdated;
    },function(newVal,oldVal){
        //console.log(newVal,oldVal,userService.userUpdated);
        if(userService.userUpdated){
            groupService.getGroupList(userService.user._id);
            $scope.user = userService.user;
            console.log($scope.user);
        }
             
    });
    
    $scope.logout = function(){
        alertService.confirm('Are you sure to log out?')
        .then(function(result){
            if(result){
                userService.logout()
                .then(function(res){
                    $state.go('welcome');
                });
            }
        });
    }
    
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
                groupId: function() {
                    return null;
                }
            }
        });
        
        modalInstance.result.then(function(result){
            //refresh page
            // $scope.fetchGroups();
            // $state.transitionTo($state.current, $stateParams, {
            //     reload: true,
            //     inherit: false,
            //     notify: true
            // });
            $state.go('group-detail',{groupId:result.data._id});
        },function(){
            console.log('Modal dismessed at: ' + new Date()); 
        });
        
    }
});

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
       setTimeout(function(){
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('PageHeadController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {        
        Demo.init(); // init theme panel
    });
}]);



/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);


MetronicApp.controller('AlertController', function($scope, content, options, type) {
    $scope.content = content;
    $scope.color = "blue";
    $scope.icon = "info-circle";
    $scope.okString = "OK";
    $scope.cancelString = "Cancel";
    
    if(type === "alert")
        $scope.title = "Alert";
    else if(type==="confirm")
        $scope.title = "Confirm";
    
    if(options.title)
        $scope.title = options.title;
        
    if(options.color)
        $scope.color = options.color;
        
    if(options.icon)
        $scope.icon = options.icon;
        
    if(options.okString)
        $scope.okString = options.okString;
        
    if(options.cancelString)
        $scope.cancelString = options.cancelString;
        
    if(options.title)
        $scope.title = options.title;
    
});


MetronicApp.controller('WelcomeController', function($scope, $state, $stateParams, userService) {
    // console.log("hahaha",$stateParams);
    
    //check user logged already?
    if($stateParams.fromRedirect)	
        if(userService.getStoredUser()){
            $state.go('group');
        }
    
    
});