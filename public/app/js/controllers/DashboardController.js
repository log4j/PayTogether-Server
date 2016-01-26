angular.module('MetronicApp').controller('DashboardController', function($rootScope, $scope, $http, $timeout, alertService) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        //App.initAjax();
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    
    
    $scope.testAlert = function(){
        alertService.alert('this is a test alert message!','test title')
        .then(function(result){
            console.log(result);
        });
    }
    
    $scope.testConfirm = function(){
        alertService.confirm('this is a test confirm message!',{
            cancelString:'取消'
        }).then(function(result){
            console.log(result); 
        });
    }
});