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
            }, 'views-tpl');
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
            }, 'views-tpl');
            return deferred.promise;
        },
        controller: 'bdReservoirMgmtCtrl',
        controllerAs: 'bdReservoirMgmtController'
    })
}]).name;
