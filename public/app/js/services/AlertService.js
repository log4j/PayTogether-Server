MetronicApp.factory('alertService', function($http,$uibModal) {
    // supported languages
    var alertService = this;

    this.alert = function(content,options){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            keyboard: false,
            windowTopClass: 'modal-no-border',
            templateUrl : 'tpl/alert.html',
            size: options && options.size ? options.size:'sm',
            controller: 'AlertController',
            resolve : {
                content: function() {
                    return content;
                },
                options: function(){
                    if(options)
                        return options;
                    else 
                        return {};
                },
                type : function(){
                    return 'alert';
                }
            }
        });
        return modalInstance.result.then(function(){
            return true},function(){return false});;
    }
    
    this.confirm = function(content,options){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            keyboard: false,
            windowTopClass: 'modal-no-border',
            templateUrl : 'tpl/confirm.html',
            size: options && options.size ? options.size:'sm',
            controller: 'AlertController',
            resolve : {
                content: function() {
                    return content;
                },
                options: function(){
                    if(options)
                        return options;
                    else 
                        return {};
                },
                type : function(){
                    return 'confirm';
                }
            }
        });
        return modalInstance.result.then(function(){
            return true},function(){return false});;
    }

    return alertService;
});