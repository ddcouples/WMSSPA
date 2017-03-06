'use strict';
module.exports = angular.module('app.storeMgmt', []).config(['$urlRouterProvider','$stateProvider',function($urlRouterProvider,$stateProvider) {
    $urlRouterProvider.when('/warehouse/storeMgmt','/warehouse/storeMgmt/receiveMgmt');
    $urlRouterProvider.when('/warehouse','/warehouse/storeMgmt/receiveMgmt');
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
    }).state('warehouse.storeMgmt.deliveryGoodMgmt', {
        url: '/deliveryGoodMgmt',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/deliveryGoodMgmt.html'], function(require) {
                var template = require('./views/deliveryGoodMgmt.html');
                deferred.resolve(template);
            }, 'deliveryGoodMgmt-tpl');
            return deferred.promise;
        },
        controller: 'deliveryGoodMgmtCtrl',
        controllerAs: 'deliveryGoodMgmtController',
        resolve: {
            'app.storeMgmt': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./controllers/deliveryGoodMgmtCtrl.js'], function() {
                    var mod = require('./controllers/deliveryGoodMgmtCtrl.js');
                    $ocLazyLoad.load({
                        name: 'app.storeMgmt'
                    });
                    deferred.resolve(mod.controller);
                }, 'storeMgmt-ctl');
                return deferred.promise;
            }
        }
    }).state('warehouse.storeMgmt.pickingMgmt', {//拣货管理 路由
        url: '/pickingMgmt',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/pickingMgmt.html'], function(require) {
                var template = require('./views/pickingMgmt.html');
                deferred.resolve(template);
            }, 'pickingMgmt-tpl');
            return deferred.promise;
        },
        controller: 'pickingMgmtCtrl',
        controllerAs: 'pickingMgmtController',
        resolve: {
            'app.storeMgmt': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./controllers/pickingMgmtCtrl.js'], function() {
                    var mod = require('./controllers/pickingMgmtCtrl.js');
                    $ocLazyLoad.load({
                        name: 'app.storeMgmt'
                    });
                    deferred.resolve(mod.controller);
                }, 'storeMgmt-ctl');
                return deferred.promise;
            }
        }
    }).state('warehouse.storeMgmt.waveCountMgmt', {//波次管理 路由
        url: '/waveCountMgmt',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/waveCountMgmt.html'], function(require) {
                var template = require('./views/waveCountMgmt.html');
                deferred.resolve(template);
            }, 'waveCountMgmt-tpl');
            return deferred.promise;
        },
        controller: 'waveCountMgmtCtrl',
        controllerAs: 'waveCountMgmtController',
        resolve: {
            'app.storeMgmt': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./controllers/waveCountMgmtCtrl.js'], function() {
                    var mod = require('./controllers/waveCountMgmtCtrl.js');
                    $ocLazyLoad.load({
                        name: 'app.storeMgmt'
                    });
                    deferred.resolve(mod.controller);
                }, 'storeMgmt-ctl');
                return deferred.promise;
            }
        }
    }).state('warehouse.storeMgmt.inventoryMgmt', {//库存管理 路由
        url: '/inventoryMgmt',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/inventoryMgmt.html'], function(require) {
                var template = require('./views/inventoryMgmt.html');
                deferred.resolve(template);
            }, 'inventoryMgmt-tpl');
            return deferred.promise;
        },
        controller: 'inventoryMgmtCtrl',
        controllerAs: 'inventoryMgmtController',
        resolve: {
            'app.storeMgmt': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./controllers/inventoryMgmtCtrl.js'], function() {
                    var mod = require('./controllers/inventoryMgmtCtrl.js');
                    $ocLazyLoad.load({
                        name: 'app.storeMgmt'
                    });
                    deferred.resolve(mod.controller);
                }, 'storeMgmt-ctl');
                return deferred.promise;
            }
        }
    }).state('warehouse.storeMgmt.takeStock', {//库房管理 路由
        url: '/takeStock',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/takeStock.html'], function(require) {
                var template = require('./views/takeStock.html');
                deferred.resolve(template);
            }, 'takeStock-tpl');
            return deferred.promise;
        },
        controller: 'takeStockCtrl',
        controllerAs: 'takeStockController',
        resolve: {
            'app.storeMgmt': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./controllers/takeStockCtrl.js'], function() {
                    var mod = require('./controllers/takeStockCtrl.js');
                    $ocLazyLoad.load({
                        name: 'app.storeMgmt'
                    });
                    deferred.resolve(mod.controller);
                }, 'storeMgmt-ctl');
                return deferred.promise;
            }
        }
    }).state('warehouse.storeMgmt.profitLossAdjustment', {//盈亏调整 路由
        url: '/profitLossAdjustment',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/profitLossAdjustment.html'], function(require) {
                var template = require('./views/profitLossAdjustment.html');
                deferred.resolve(template);
            }, 'profitLossAdjustment-tpl');
            return deferred.promise;
        },
        controller: 'profitLossAdjustmentCtrl',
        controllerAs: 'profitLossAdjustmentController',
        resolve: {
            'app.storeMgmt': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./controllers/profitLossAdjustmentCtrl.js'], function() {
                    var mod = require('./controllers/profitLossAdjustmentCtrl.js');
                    $ocLazyLoad.load({
                        name: 'app.storeMgmt'
                    });
                    deferred.resolve(mod.controller);
                }, 'storeMgmt-ctl');
                return deferred.promise;
            }
        }
    })
        .state('warehouse.storeMgmt.gression', {// 移位调整 路由
        url: '/gression',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/gression.html'], function(require) {
                var template = require('./views/gression.html');
                deferred.resolve(template);
            }, 'gression-tpl');
            return deferred.promise;
        },
        controller: 'gressionCtrl',
        controllerAs: 'gressionController',
            resolve: {
                'app.storeMgmt': function($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure(['./controllers/gressionCtrl.js'], function() {
                        var mod = require('./controllers/gressionCtrl.js');
                        $ocLazyLoad.load({
                            name: 'app.storeMgmt'
                        });
                        deferred.resolve(mod.controller);
                    }, 'storeMgmt-ctl');
                    return deferred.promise;
                }
            }
    })
}]).name;
