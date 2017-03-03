'use strict';
module.exports = angular.module('app.receiveMgmt', []).config(function($stateProvider) {
    $stateProvider.state('warehouse.storeMgmt.receive_add_modify', {//新增和修改 路由
        url: '/receive_add_modify',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./receive_add_modify.html'], function(require) {
                var template = require('./receive_add_modify.html');
                deferred.resolve(template);
            }, 'receive_add_modify-tpl');
            return deferred.promise;
        },
        controller: 'receive_add_modifyCtrl',
        controllerAs: 'receive_add_modifyController'
    })
}).name;
/**
 * Created by yangl on 2017/3/3.
 */
