'use strict';
module.exports = angular.module('app.gardenMgmt', []).config(['$urlRouterProvider','$stateProvider',function($urlRouterProvider,$stateProvider) {
    $urlRouterProvider.when('/warehouse/gardenMgmt','/warehouse/gardenMgmt/goodsMgmt');
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
    }).state('warehouse.gardenMgmt.goodsMgmt', {
        url: '/goodsMgmt',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/goodsMgmt.html'], function(require) {
                var template = require('./views/goodsMgmt.html');
                deferred.resolve(template);
            }, 'goodsMgmt-tpl');
            return deferred.promise;
        },
        controller: 'goodsMgmtCtrl',
        controllerAs: 'goodsMgmtController'
    }).state('warehouse.gardenMgmt.gardenShelvesMgmt', {
        url: '/gardenShelvesMgmt',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/gardenShelvesMgmt.html'], function(require) {
                var template = require('./views/gardenShelvesMgmt.html');
                deferred.resolve(template);
            }, 'gardenShelvesMgmt-tpl');
            return deferred.promise;
        },
        controller: 'gardenShelvesMgmtCtrl',
        controllerAs: 'inventoryWarningController'
    }).state('warehouse.gardenMgmt.gardenDeliveryMgmt', {
        url: '/gardenDeliveryMgmt',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/gardenDeliveryMgmt.html'], function(require) {
                var template = require('./views/gardenDeliveryMgmt.html');
                deferred.resolve(template);
            }, 'gardenDeliveryMgmt-tpl');
            return deferred.promise;
        },
        controller: 'gardenDeliveryMgmtCtrl',
        controllerAs: 'gardenDeliveryMgmtController'
    })
}]).name;
