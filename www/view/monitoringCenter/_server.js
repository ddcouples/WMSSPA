'use strict';
module.exports = angular.module('app.monitoringCenter', []).config(['$urlRouterProvider','$stateProvider',function($urlRouterProvider,$stateProvider) {
    $urlRouterProvider.when('/warehouse/monitoringCenter','/warehouse/monitoringCenter/exceptionMgmt');
    $stateProvider.state('warehouse.monitoringCenter', {
        url: '/monitoringCenter',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./monitoringCenter.html'], function(require) {
                var template = require('./monitoringCenter.html');
                deferred.resolve(template);
            }, 'sysSetting-tpl');
            return deferred.promise;
        },
        controller: 'monitoringCenterCtrl',
        controllerAs: 'monitoringCenterController',
        onEnter:function(){
          console.log('monitoringCenter');
        },
        resolve: {
            'app.monitoringCenter': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./monitoringCenter.js'], function() {
                    var mod = require('./monitoringCenter.js');
                    $ocLazyLoad.load({
                        name: 'app.monitoringCenter'
                    });
                    deferred.resolve(mod.controller);
                }, 'monitoringCenter-ctl');
                return deferred.promise;
            }
        }
    }).state('warehouse.monitoringCenter.exceptionMgmt', {
        url: '/exceptionMgmt',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/exceptionMgmt.html'], function(require) {
                var template = require('./views/exceptionMgmt.html');
                deferred.resolve(template);
            }, 'exceptionMgmt-tpl');
            return deferred.promise;
        },
        controller: 'exceptionMgmtCtrl',
        controllerAs: 'exceptionMgmtController'
    }).state('warehouse.monitoringCenter.inventoryWarning', {
        url: '/inventoryWarning',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/inventoryWarning.html'], function(require) {
                var template = require('./views/inventoryWarning.html');
                deferred.resolve(template);
            }, 'inventoryWarning-tpl');
            return deferred.promise;
        },
        controller: 'inventoryWarningCtrl',
        controllerAs: 'inventoryWarningController'
    })
}]).name;
