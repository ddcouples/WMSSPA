'use strict';
module.exports = angular.module('app.storeMgmt', []).config(['$urlRouterProvider','$stateProvider',function($urlRouterProvider,$stateProvider) {
    $urlRouterProvider.when('/warehouse/storeMgmt','/warehouse/storeMgmt/receiveMgmt');
    $stateProvider.state('warehouse.storeMgmt', {
        url: '/storeMgmt',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./storeMgmt.html'], function(require) {
                var template = require('./storeMgmt.html');
                deferred.resolve(template);
            }, 'sysSetting-tpl');
            return deferred.promise;
        },
        controller: 'storeMgmtCtrl',
        controllerAs: 'storeMgmtController',
        onEnter:function(){
          console.log('storeMgmt');
        },
        resolve: {
            'app.storeMgmt': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./storeMgmt.js'], function() {
                    var mod = require('./storeMgmt.js');
                    $ocLazyLoad.load({
                        name: 'app.storeMgmt'
                    });
                    deferred.resolve(mod.controller);
                }, 'storeMgmt-ctl');
                return deferred.promise;
            }
        }
    }).state('warehouse.storeMgmt.receiveMgmt', {
        url: '/receiveMgmt',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/receiveMgmt.html'], function(require) {
                var template = require('./views/receiveMgmt.html');
                deferred.resolve(template);
            }, 'receiveMgmt-tpl');
            return deferred.promise;
        },
        controller: 'receiveMgmtCtrl',
        controllerAs: 'receiveMgmtController'
    }).state('warehouse.storeMgmt.shelvesMgmt', {
        url: '/shelvesMgmt',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/shelvesMgmt.html'], function(require) {
                var template = require('./views/shelvesMgmt.html');
                deferred.resolve(template);
            }, 'shelvesMgmt-tpl');
            return deferred.promise;
        },
        controller: 'shelvesMgmtCtrl',
        controllerAs: 'shelvesMgmtController'
    })
}]).name;
