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
            }, 'bdStoreMgmt-tpl');
            return deferred.promise;
        },
        controller: 'bdStoreMgmtCtrl',
        controllerAs: 'bdStoreMgmtController',
        resolve: {
            'app.basicData': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./controllers/bdStoreMgmtCtrl.js'], function() {
                    var mod = require('./controllers/bdStoreMgmtCtrl.js');
                    $ocLazyLoad.load({
                        name: 'app.basicData'
                    });
                    deferred.resolve(mod.controller);
                }, 'basicData-ctl');
                return deferred.promise;
            }
        }
    }).state('warehouse.basicData.bdReservoirMgmt', {
        url: '/bdReservoirMgmt',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/bdReservoirMgmt.html'], function(require) {
                var template = require('./views/bdReservoirMgmt.html');
                deferred.resolve(template);
            }, 'bdReservoirMgmt-tpl');
            return deferred.promise;
        },
        controller: 'bdReservoirMgmtCtrl',
        controllerAs: 'bdReservoirMgmtController',
        resolve: {
            'app.basicData': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./controllers/bdReservoirMgmtCtrl.js'], function() {
                    var mod = require('./controllers/bdReservoirMgmtCtrl.js');
                    $ocLazyLoad.load({
                        name: 'app.basicData'
                    });
                    deferred.resolve(mod.controller);
                }, 'basicData-ctl');
                return deferred.promise;
            }
        }
    }).state('warehouse.basicData.locationMgmt', {
        url: '/locationMgmt',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/locationMgmt.html'], function(require) {
                var template = require('./views/locationMgmt.html');
                deferred.resolve(template);
            }, 'locationMgmt-tpl');
            return deferred.promise;
        },
        controller: 'locationMgmtCtrl',
        controllerAs: 'locationMgmtController',
        resolve: {
            'app.basicData': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./controllers/locationMgmtCtrl.js'], function() {
                    var mod = require('./controllers/locationMgmtCtrl.js');
                    $ocLazyLoad.load({
                        name: 'app.basicData'
                    });
                    deferred.resolve(mod.controller);
                }, 'basicData-ctl');
                return deferred.promise;
            }
        }
    }).state('warehouse.basicData.platformMgmt', {
        url: '/platformMgmt',
        templateProvider: function($q) {
            var deferred = $q.defer();
            require.ensure(['./views/platformMgmt.html'], function(require) {
                var template = require('./views/platformMgmt.html');
                deferred.resolve(template);
            }, 'platformMgmt-tpl');
            return deferred.promise;
        },
        controller: 'platformMgmtCtrl',
        controllerAs: 'platformMgmtController',
        resolve: {
            'app.basicData': function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./controllers/platformMgmtCtrl.js'], function() {
                    var mod = require('./controllers/platformMgmtCtrl.js');
                    $ocLazyLoad.load({
                        name: 'app.basicData'
                    });
                    deferred.resolve(mod.controller);
                }, 'basicData-ctl');
                return deferred.promise;
            }
        }
    })
        //客商管理路由
        .state('warehouse.basicData.merchantsMgmt', {
            url: '/merchantsMgmt',
            templateProvider: function($q) {
                var deferred = $q.defer();
                require.ensure(['./views/merchantsMgmt.html'], function(require) {
                    var template = require('./views/merchantsMgmt.html');
                    deferred.resolve(template);
                }, 'merchantsMgmt-tpl');
                return deferred.promise;
            },
            controller: 'merchantsMgmtCtrl',
            controllerAs: 'merchantsMgmtController',
            resolve: {
                'app.basicData': function($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure(['./controllers/merchantsMgmtCtrl.js'], function() {
                        var mod = require('./controllers/merchantsMgmtCtrl.js');
                        $ocLazyLoad.load({
                            name: 'app.basicData'
                        });
                        deferred.resolve(mod.controller);
                    }, 'basicData-ctl');
                    return deferred.promise;
                }
            }
        })
        .state('warehouse.basicData.itemType', {
            url: '/itemType',
            templateProvider: function($q) {
                var deferred = $q.defer();
                require.ensure(['./views/itemType.html'], function(require) {
                    var template = require('./views/itemType.html');
                    deferred.resolve(template);
                }, 'itemType-tpl');
                return deferred.promise;
            },
            controller: 'itemTypeCtrl',
            controllerAs: 'itemTypeController',
            resolve: {
                'app.basicData': function($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure(['./controllers/itemTypeCtrl.js'], function() {
                        var mod = require('./controllers/itemTypeCtrl.js');
                        $ocLazyLoad.load({
                            name: 'app.basicData'
                        });
                        deferred.resolve(mod.controller);
                    }, 'basicData-ctl');
                    return deferred.promise;
                }
            }
        })
        .state('warehouse.basicData.bdGoodsMgmt', {
            url: '/bdGoodsMgmt',
            templateProvider: function($q) {
                var deferred = $q.defer();
                require.ensure(['./views/bdGoodsMgmt.html'], function(require) {
                    var template = require('./views/bdGoodsMgmt.html');
                    deferred.resolve(template);
                }, 'bdGoodsMgmt-tpl');
                return deferred.promise;
            },
            controller: 'bdGoodsMgmtCtrl',
            controllerAs: 'bdGoodsMgmtController',
            resolve: {
                'app.basicData': function($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure(['./controllers/bdGoodsMgmtCtrl.js'], function() {
                        var mod = require('./controllers/bdGoodsMgmtCtrl.js');
                        $ocLazyLoad.load({
                            name: 'app.basicData'
                        });
                        deferred.resolve(mod.controller);
                    }, 'basicData-ctl');
                    return deferred.promise;
                }
            }
        })
        .state('warehouse.basicData.bdPackagingMgmt', {
            url: '/bdPackagingMgmt',
            templateProvider: function($q) {
                var deferred = $q.defer();
                require.ensure(['./views/bdPackagingMgmt.html'], function(require) {
                    var template = require('./views/bdPackagingMgmt.html');
                    deferred.resolve(template);
                }, 'bdPackagingMgmt-tpl');
                return deferred.promise;
            },
            controller: 'bdPackagingMgmtCtrl',
            controllerAs: 'bdPackagingMgmtController',
            resolve: {
                'app.basicData': function($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure(['./controllers/bdPackagingMgmtCtrl.js'], function() {
                        var mod = require('./controllers/bdPackagingMgmtCtrl.js');
                        $ocLazyLoad.load({
                            name: 'app.basicData'
                        });
                        deferred.resolve(mod.controller);
                    }, 'basicData-ctl');
                    return deferred.promise;
                }
            }
        })
        .state('warehouse.basicData.locationSpecifications', {
            url: '/locationSpecifications',
            templateProvider: function($q) {
                var deferred = $q.defer();
                require.ensure(['./views/locationSpecifications.html'], function(require) {
                    var template = require('./views/locationSpecifications.html');
                    deferred.resolve(template);
                }, 'locationSpecifications-tpl');
                return deferred.promise;
            },
            controller: 'locationSpecificationsCtrl',
            controllerAs: 'locationSpecificationsController',
            resolve: {
                'app.basicData': function($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure(['./controllers/locationSpecificationsCtrl.js'], function() {
                        var mod = require('./controllers/locationSpecificationsCtrl.js');
                        $ocLazyLoad.load({
                            name: 'app.basicData'
                        });
                        deferred.resolve(mod.controller);
                    }, 'basicData-ctl');
                    return deferred.promise;
                }
            }
        })
            // 库容量设置模块 已经被卡掉
        .state('warehouse.basicData.databaseSetup', {
            url: '/databaseSetup',
            templateProvider: function($q) {
                var deferred = $q.defer();
                require.ensure(['./views/databaseSetup.html'], function(require) {
                    var template = require('./views/databaseSetup.html');
                    deferred.resolve(template);
                }, 'databaseSetup-tpl');
                return deferred.promise;
            },
            controller: 'databaseSetupCtrl',
            controllerAs: 'databaseSetupController',
            resolve: {
                'app.basicData': function($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure(['./controllers/databaseSetupCtrl.js'], function() {
                        var mod = require('./controllers/databaseSetupCtrl.js');
                        $ocLazyLoad.load({
                            name: 'app.basicData'
                        });
                        deferred.resolve(mod.controller);
                    }, 'basicData-ctl');
                    return deferred.promise;
                }
            }
        })
        .state('warehouse.basicData.equipmentMgmt', {
            url: '/equipmentMgmt',
            templateProvider: function($q) {
                var deferred = $q.defer();
                require.ensure(['./views/equipmentMgmt.html'], function(require) {
                    var template = require('./views/equipmentMgmt.html');
                    deferred.resolve(template);
                }, 'equipmentMgmt-tpl');
                return deferred.promise;
            },
            controller: 'equipmentMgmtCtrl',
            controllerAs: 'equipmentMgmtController',
            resolve: {
                'app.basicData': function($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure(['./controllers/equipmentMgmtCtrl.js'], function() {
                        var mod = require('./controllers/equipmentMgmtCtrl.js');
                        $ocLazyLoad.load({
                            name: 'app.basicData'
                        });
                        deferred.resolve(mod.controller);
                    }, 'basicData-ctl');
                    return deferred.promise;
                }
            }
        })
        .state('warehouse.basicData.workspaceMgmt', {
            url: '/workspaceMgmt',
            templateProvider: function($q) {
                var deferred = $q.defer();
                require.ensure(['./views/workspaceMgmt.html'], function(require) {
                    var template = require('./views/workspaceMgmt.html');
                    deferred.resolve(template);
                }, 'workspaceMgmt-tpl');
                return deferred.promise;
            },
            controller: 'workspaceMgmtCtrl',
            controllerAs: 'workspaceMgmtController',
            resolve: {
                'app.basicData': function($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure(['./controllers/workspaceMgmtCtrl.js'], function() {
                        var mod = require('./controllers/workspaceMgmtCtrl.js');
                        $ocLazyLoad.load({
                            name: 'app.basicData'
                        });
                        deferred.resolve(mod.controller);
                    }, 'basicData-ctl');
                    return deferred.promise;
                }
            }
        })
}]).name;
