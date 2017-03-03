'use strict';
module.exports = angular.module('app.controllers', [
    require('../view/home/_service.js'),
    require('../view/login/_service.js'),
    require('../view/warehouse/_service.js'),
    require('../view/syssetting/_service.js'),
    require('../view/storeMgmt/_server.js'),
    // require('../view/storeMgmt/receiveMgmt/_server.js'),
    require('../view/monitoringCenter/_server.js'),
    require('../view/basicData/_service.js'),
    require('../view/gardenMgmt/_server.js')
]).name;