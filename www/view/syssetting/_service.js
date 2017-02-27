'use strict';
module.exports = angular.module('app.sysSetting', []).config(['$urlRouterProvider','$stateProvider',function($urlRouterProvider,$stateProvider) {
    $urlRouterProvider.when('/warehouse/sysSetting','/warehouse/sysSetting/epManagement');
    $stateProvider.state('warehouse.sysSetting', {
        url: '/sysSetting',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./sysSetting.html'], function(require) {
                var template = require('./sysSetting.html');
                deferred.resolve(template);
            }, 'sysSetting-tpl');
            return deferred.promise;
        },
        controller: 'sysSettingCtrl',
        controllerAs: 'sysSettingController',
        resolve: {
            'app.sysSetting': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./sysSetting.js'], function() {
                    var mod = require('./sysSetting.js');
                    $ocLazyLoad.load({
                        name: 'app.sysSetting'
                    });
                    deferred.resolve(mod.controller);
                }, 'sysSetting-ctl');
                return deferred.promise;
            }
        }
    }).state('warehouse.sysSetting.epManagement', {
        url: '/epManagement',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/epManagement.html'], function(require) {
                var template = require('./views/epManagement.html');
                deferred.resolve(template);
            }, 'views-tpl');
            return deferred.promise;
        },
        controller: 'epManagementCtrl',
        controllerAs: 'epManagementController'
    }).state('warehouse.sysSetting.rightsMgmt', {
        url: '/rightsMgmt',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/rightsMgmt.html'], function(require) {
                var template = require('./views/rightsMgmt.html');
                deferred.resolve(template);
            }, 'views-tpl');
            return deferred.promise;
        },
        controller: 'rightsMgmtCtrl',
        controllerAs: 'rightsMgmtController'
    })
}]).name;
