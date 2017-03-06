'use strict'; //个人中心路由器
module.exports = angular.module('app.personCenter', []).config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider) {

    $stateProvider.state('warehouse.personCenter', {
        url: '/personCenter',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./personCenter.html'], function(require) {
                var template = require('./personCenter.html');
                deferred.resolve(template);
            }, 'personCenter-tpl');
            return deferred.promise;
        },
        controller: 'personCenterCtrl',
        controllerAs: 'personCenterController',
        resolve: { //用于加载apppersonCenter模块下的controller 懒加载的方式
            'app.personCenter': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./personCenter.js'], function() {
                    var mod = require('./personCenter.js');
                    $ocLazyLoad.load({
                        name: 'app.personCenter'
                    });
                    deferred.resolve(mod.controller);
                }, 'personCenter-ctl');
                return deferred.promise;
            }
        }
    });
}]).name;
