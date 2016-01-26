angular.module('MetronicApp')
.controller('LoginController', function($rootScope, $scope, $state, $http, $timeout, userService) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        //App.initAjax();
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    
    //check user logged already?
    if(userService.getStoredUser()){
        $state.go('dashboard');
    }
    
    
    $scope.formType = 'login-form';
    
    $scope.switchFormType = function(type){
        if(type)
            $scope.formType = type;
    }
    
    $scope.loginData = {
        username:'',
        password:'',
    }
    $scope.submitLogin = function(){
        $scope.loginError = '';
        if($scope.loginData.username.length < 3){
            $scope.loginError = 'Please input a valid username or email.';
            return;
        }
        if($scope.loginData.password.length < 3){
            $scope.loginError = 'Please input a valid password.';
            return;
        }
        
        userService.login($scope.loginData)
        .then(function(res){
            console.log(res);
            if(res.result){
                $state.go('dashboard');
            }else{
                if(res.err === 'ERR_INVALID_USER')
                    $scope.loginError = 'Can not find account with your username or email.';
                else if(res.err === 'ERR_INVALID_PASSWORD')
                    $scope.loginError = 'Can not validate your password';
            return;
            }
        });
        
    }
    
    
    $scope.registerData = {
        username:'',
        password:'',
        password2:''
    }
    
    
    
    $scope.submitRegister = function(){
        
        //console.log('try to submit');
        
        //console.log($scope.registerForm);
        
        $scope.registerError = '';
        if($scope.registerData.username.length < 3){
            $scope.registerError = 'Username not valid: at least 4 characters.';
            return;
        }
        
        if($scope.registerForm.email.$error.required ||$scope.registerForm.email.$error.email){
                
            $scope.registerError = 'Email not valid.';
            return;
        }
        
        if($scope.registerData.password.length < 3){
            $scope.registerError = 'Password should be more than 3 characters.';
            return;
        }
        
        if($scope.registerData.password != $scope.registerData.password2){
            $scope.registerError = 'Please retype the same password.';
            return;
        }
        
        console.log($scope.registerData);
        userService.register($scope.registerData)
            .then(function(res){
                console.log(res); 
                if(res.result){
                    $scope.registerSuccess = 'Welcome, '+$scope.registerData.username+'!';
                    $scope.loginData.username = $scope.registerData.username;
                    $scope.loginData.password = $scope.registerData.password;
                    $scope.switchFormType('login-form');
                }else{
                    if(res.err==='ERR_EXISTED_EMAIL'){
                        $scope.registerError = 'The email has already been used.';
                    }
                    else if(res.err==='ERR_EXISTED_NAME'){
                        $scope.registerError = 'The username has already been used.';
                    }else{
                        $scope.registerError = 'Can not create your account, try it later.';
                    }
                }
            });
    }
});