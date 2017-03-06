'use strict';
module.exports = angular.module('app.home', []).config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.when('/warehouse','/warehouse/home');
    $stateProvider.state('warehouse.home', {
        url: '/home',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./home.html'], function(require) {
                var template = require('./home.html');
                deferred.resolve(template);
            }, 'home-tpl');
            return deferred.promise;
        },
        controller: 'homeCtrl',
        controllerAs: 'homeController',
        resolve: { //用于加载apphome模块下的controller 懒加载的方式
            'app.home': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./home.js'], function() {
                    var mod = require('./home.js');
                    $ocLazyLoad.load({
                        name: 'app.home'
                    });
                    deferred.resolve(mod.controller);
                }, 'home-ctl');
                return deferred.promise;
            }
        }
    });
}]).name;
