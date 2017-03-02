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
            }, 'epManagement-tpl');
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
            }, 'rightsMgmt-tpl');
            return deferred.promise;
        },
        controller: 'rightsMgmtCtrl',
        controllerAs: 'rightsMgmtController'
    }).state('warehouse.sysSetting.roleMgmt', {
        url: '/roleMgmt',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/roleMgmt.html'], function(require) {
                var template = require('./views/roleMgmt.html');
                deferred.resolve(template);
            }, 'roleMgmt-tpl');
            return deferred.promise;
        },
        controller: 'roleMgmtCtrl',
        controllerAs: 'roleMgmtController'
    }).state('warehouse.sysSetting.usersMgmt', {
        url: '/usersMgmt',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/usersMgmt.html'], function(require) {
                var template = require('./views/usersMgmt.html');
                deferred.resolve(template);
            }, 'usersMgmt-tpl');
            return deferred.promise;
        },
        controller: 'usersMgmtCtrl',
        controllerAs: 'usersMgmtController'
    }).state('warehouse.sysSetting.peopleMgmt', {
        url: '/peopleMgmt',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/peopleMgmt.html'], function(require) {
                var template = require('./views/peopleMgmt.html');
                deferred.resolve(template);
            }, 'peopleMgmt-tpl');
            return deferred.promise;
        },
        controller: 'peopleMgmtCtrl',
        controllerAs: 'peopleMgmtController'
    }).state('warehouse.sysSetting.reportConfig', {
        url: '/reportConfig',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/reportConfig.html'], function(require) {
                var template = require('./views/reportConfig.html');
                deferred.resolve(template);
            }, 'reportConfig-tpl');
            return deferred.promise;
        },
        controller: 'reportConfigCtrl',
        controllerAs: 'reportConfigController'
    }).state('warehouse.sysSetting.globalParameter', {
        url: '/globalParameter',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/globalParameter.html'], function(require) {
                var template = require('./views/globalParameter.html');
                deferred.resolve(template);
            }, 'globalParameter-tpl');
            return deferred.promise;
        },
        controller: 'globalParameterCtrl',
        controllerAs: 'globalParameterController'
    }).state('warehouse.sysSetting.interfaceMgmt', {
        url: '/interfaceMgmt',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/interfaceMgmt.html'], function(require) {
                var template = require('./views/interfaceMgmt.html');
                deferred.resolve(template);
            }, 'interfaceMgmt-tpl');
            return deferred.promise;
        },
        controller: 'interfaceMgmtCtrl',
        controllerAs: 'interfaceMgmtController'
    }).state('warehouse.sysSetting.operationLog', {
        url: '/operationLog',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/operationLog.html'], function(require) {
                var template = require('./views/operationLog.html');
                deferred.resolve(template);
            }, 'operationLog-tpl');
            return deferred.promise;
        },
        controller: 'operationLogCtrl',
        controllerAs: 'operationLogController'
    }).state('warehouse.sysSetting.inventoryLog', {
        url: '/inventoryLog',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/inventoryLog.html'], function(require) {
                var template = require('./views/inventoryLog.html');
                deferred.resolve(template);
            }, 'inventoryLog-tpl');
            return deferred.promise;
        },
        controller: 'inventoryLogCtrl',
        controllerAs: 'inventoryLogController'
    })
}]).name;
