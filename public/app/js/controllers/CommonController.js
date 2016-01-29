
/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', function($scope, $state, userService, 
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
        if(userService.userUpdated)
             groupService.getGroupList(userService.user._id);
    });
    
    $scope.logout = function(){
        alertService.confirm('Are you sure to log out?')
        .then(function(result){
            if(result){
                userService.logout()
                .then(function(res){
                    $state.go('login');
                });
            }
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


MetronicApp.controller('WelcomeController', function($scope) {
    
});