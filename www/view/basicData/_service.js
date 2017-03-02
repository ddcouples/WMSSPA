'use strict';
module.exports = angular.module('app.basicData', []).config(['$urlRouterProvider','$stateProvider',function($urlRouterProvider,$stateProvider) {
    $urlRouterProvider.when('/warehouse/basicData','/warehouse/basicData/bdStoreMgmt');
    $stateProvider.state('warehouse.basicData', {
        url: '/basicData',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./basicData.html'], function(require) {
                var template = require('./basicData.html');
                deferred.resolve(template);
            }, 'basicData-tpl');
            return deferred.promise;
        },
        controller: 'basicDataCtrl',
        controllerAs: 'basicDataController',
        resolve: {
            'app.basicData': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./basicData.js'], function() {
                    var mod = require('./basicData.js');
                    $ocLazyLoad.load({
                        name: 'app.basicData'
                    });
                    deferred.resolve(mod.controller);
                }, 'basicData-ctl');
                return deferred.promise;
            }
        }
    }).state('warehouse.basicData.bdStoreMgmt', {
        url: '/bdStoreMgmt',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/bdStoreMgmt.html'], function(require) {
                var template = require('./views/bdStoreMgmt.html');
                deferred.resolve(template);
            }, 'bdStoreMgmt-tpl');
            return deferred.promise;
        },
        controller: 'bdStoreMgmtCtrl',
        controllerAs: 'bdStoreMgmtController'
    }).state('warehouse.basicData.bdReservoirMgmt', {
        url: '/bdReservoirMgmt',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/bdReservoirMgmt.html'], function(require) {
                var template = require('./views/bdReservoirMgmt.html');
                deferred.resolve(template);
            }, 'bdReservoirMgmt-tpl');
            return deferred.promise;
        },
        controller: 'bdReservoirMgmtCtrl',
        controllerAs: 'bdReservoirMgmtController'
    }).state('warehouse.basicData.locationMgmt', {
        url: '/locationMgmt',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/locationMgmt.html'], function(require) {
                var template = require('./views/locationMgmt.html');
                deferred.resolve(template);
            }, 'locationMgmt-tpl');
            return deferred.promise;
        },
        controller: 'locationMgmtCtrl',
        controllerAs: 'locationMgmtController'
    }).state('warehouse.basicData.platformMgmt', {
        url: '/platformMgmt',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/platformMgmt.html'], function(require) {
                var template = require('./views/platformMgmt.html');
                deferred.resolve(template);
            }, 'platformMgmt-tpl');
            return deferred.promise;
        },
        controller: 'platformMgmtCtrl',
        controllerAs: 'platformMgmtController'
    })
        //客商管理路由
        .state('warehouse.basicData.merchantsMgmt', {
            url: '/merchantsMgmt',
            templateProvider: function($q) {
                var deferred = $q.defer();
                require.ensure(['./views/merchantsMgmt.html'], function(require) {
                    var template = require('./views/merchantsMgmt.html');
                    deferred.resolve(template);
                }, 'merchantsMgmt-tpl');
                return deferred.promise;
            },
            controller: 'merchantsMgmtCtrl',
            controllerAs: 'merchantsMgmtController'
        })
        .state('warehouse.basicData.itemType', {
            url: '/itemType',
            templateProvider: function($q) {
                var deferred = $q.defer();
                require.ensure(['./views/itemType.html'], function(require) {
                    var template = require('./views/itemType.html');
                    deferred.resolve(template);
                }, 'itemType-tpl');
                return deferred.promise;
            },
            controller: 'itemTypeCtrl',
            controllerAs: 'itemTypeController'
        })
        .state('warehouse.basicData.bdGoodsMgmt', {
            url: '/bdGoodsMgmt',
            templateProvider: function($q) {
                var deferred = $q.defer();
                require.ensure(['./views/bdGoodsMgmt.html'], function(require) {
                    var template = require('./views/bdGoodsMgmt.html');
                    deferred.resolve(template);
                }, 'bdGoodsMgmt-tpl');
                return deferred.promise;
            },
            controller: 'bdGoodsMgmtCtrl',
            controllerAs: 'bdGoodsMgmtController'
        })
        .state('warehouse.basicData.bdPackagingMgmt', {
            url: '/bdPackagingMgmt',
            templateProvider: function($q) {
                var deferred = $q.defer();
                require.ensure(['./views/bdPackagingMgmt.html'], function(require) {
                    var template = require('./views/bdPackagingMgmt.html');
                    deferred.resolve(template);
                }, 'bdPackagingMgmt-tpl');
                return deferred.promise;
            },
            controller: 'bdPackagingMgmtCtrl',
            controllerAs: 'bdPackagingMgmtController'
        })
        .state('warehouse.basicData.locationSpecifications', {
            url: '/locationSpecifications',
            templateProvider: function($q) {
                var deferred = $q.defer();
                require.ensure(['./views/locationSpecifications.html'], function(require) {
                    var template = require('./views/locationSpecifications.html');
                    deferred.resolve(template);
                }, 'locationSpecifications-tpl');
                return deferred.promise;
            },
            controller: 'locationSpecificationsCtrl',
            controllerAs: 'locationSpecificationsController'
        })
        .state('warehouse.basicData.databaseSetup', {
            url: '/databaseSetup',
            templateProvider: function($q) {
                var deferred = $q.defer();
                require.ensure(['./views/databaseSetup.html'], function(require) {
                    var template = require('./views/databaseSetup.html');
                    deferred.resolve(template);
                }, 'databaseSetup-tpl');
                return deferred.promise;
            },
            controller: 'databaseSetupCtrl',
            controllerAs: 'databaseSetupController'
        })
        .state('warehouse.basicData.equipmentMgmt', {
            url: '/equipmentMgmt',
            templateProvider: function($q) {
                var deferred = $q.defer();
                require.ensure(['./views/equipmentMgmt.html'], function(require) {
                    var template = require('./views/equipmentMgmt.html');
                    deferred.resolve(template);
                }, 'equipmentMgmt-tpl');
                return deferred.promise;
            },
            controller: 'equipmentMgmtCtrl',
            controllerAs: 'equipmentMgmtController'
        })
        .state('warehouse.basicData.workspaceMgmt', {
            url: '/workspaceMgmt',
            templateProvider: function($q) {
                var deferred = $q.defer();
                require.ensure(['./views/workspaceMgmt.html'], function(require) {
                    var template = require('./views/workspaceMgmt.html');
                    deferred.resolve(template);
                }, 'workspaceMgmt-tpl');
                return deferred.promise;
            },
            controller: 'workspaceMgmtCtrl',
            controllerAs: 'workspaceMgmtController'
        })
}]).name;
