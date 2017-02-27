'use strict';
module.exports = angular.module('app.login', []).config(function($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./login.html'], function(require) {
                var template = require('./login.html');
                deferred.resolve(template);
            }, 'login-tpl');
            return deferred.promise;
        },
        controller: 'loginCtrl',
        controllerAs: 'loginCtrller',
        resolve: {
            'app.login': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./login.js'], function() {
                    var mod = require('./login.js');
                    $ocLazyLoad.load({
                        name: 'app.login'
                    });
                    deferred.resolve(mod.controller);
                }, 'login-ctl');
                return deferred.promise;
            }
        }
    });
}).name;