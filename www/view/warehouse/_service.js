'use strict';
require('../../sass/warehouse.scss');
require('../../sass/ngAnimate.scss');

require('../../css/tooltip.css');
module.exports = angular.module('app.warehouse', []).config(function($stateProvider) {
    $stateProvider.state('warehouse', {
        url: '/warehouse',
        templateProvider:['$q','httpServer','$state',function($q, httpServer,$state) {

            var d = httpServer.postData('/adminlogin/isPermitted', "org");
            d.then(function(res){
                console.log("permitted:"+res);
                //$state.go('login');
            });

            var deferred = $q.defer();
            require.ensure(['./warehouse.html'], function(require) {
                var template = require('./warehouse.html');
                deferred.resolve(template);
            }, 'warehouse-tpl');
            return deferred.promise;
        }],
        controller: 'warehouseCtrl',
        controllerAs: 'warehouseController',
        resolve: {
            'app.warehouse': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./warehouse.js'], function() {
                    var mod = require('./warehouse.js');
                    $ocLazyLoad.load({
                        name: 'app.warehouse'
                    });
                    deferred.resolve(mod.controller);
                }, 'warehouse-ctl');
                return deferred.promise;
            }
        }
    })
}).name;/**
 * Created by yangl on 2017/2/22.
 */
