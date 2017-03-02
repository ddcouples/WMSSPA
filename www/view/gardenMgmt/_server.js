'use strict';
module.exports = angular.module('app.gardenMgmt', []).config(['$urlRouterProvider','$stateProvider',function($urlRouterProvider,$stateProvider) {
    $urlRouterProvider.when('/warehouse/gardenMgmt','/warehouse/gardenMgmt/rentalMgmt');
    $stateProvider.state('warehouse.gardenMgmt', {
        url: '/gardenMgmt',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./gardenMgmt.html'], function(require) {
                var template = require('./gardenMgmt.html');
                deferred.resolve(template);
            }, 'sysSetting-tpl');
            return deferred.promise;
        },
        controller: 'gardenMgmtCtrl',
        controllerAs: 'gardenMgmtController',
        onEnter:function(){
          console.log('gardenMgmt');
        },
        resolve: {
            'app.gardenMgmt': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./gardenMgmt.js'], function() {
                    var mod = require('./gardenMgmt.js');
                    $ocLazyLoad.load({
                        name: 'app.gardenMgmt'
                    });
                    deferred.resolve(mod.controller);
                }, 'gardenMgmt-ctl');
                return deferred.promise;
            }
        }
    }).state('warehouse.gardenMgmt.rentalMgmt', {
        url: '/rentalMgmt',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/rentalMgmt.html'], function(require) {
                var template = require('./views/rentalMgmt.html');
                deferred.resolve(template);
            }, 'rentalMgmt-tpl');
            return deferred.promise;
        },
        controller: 'rentalMgmtCtrl',
        controllerAs: 'rentalMgmtController'
    }).state('warehouse.gardenMgmt.leaseWarning', {
        url: '/leaseWarning',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/leaseWarning.html'], function(require) {
                var template = require('./views/leaseWarning.html');
                deferred.resolve(template);
            }, 'leaseWarning-tpl');
            return deferred.promise;
        },
        controller: 'leaseWarningCtrl',
        controllerAs: 'leaseWarningController'
    }).state('warehouse.gardenMgmt.businessStatistics', {
        url: '/businessStatistics',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/businessStatistics.html'], function(require) {
                var template = require('./views/businessStatistics.html');
                deferred.resolve(template);
            }, 'businessStatistics-tpl');
            return deferred.promise;
        },
        controller: 'businessStatisticsCtrl',
        controllerAs: 'businessStatisticsController'
    })
}]).name;
