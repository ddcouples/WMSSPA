'use strict';
module.exports = angular.module("app.basicData").controller("basicDataCtrl",['$state',function($state) {
    console.log('basicDataCtrl');

    this.test = function() {
        alert(this.name);
    }
}]).controller("bdStoreMgmtCtrl", [function() {
    console.log('bdStoreMgmtCtrl');
    this.test = function() {
        alert(this.name);
    }
}]).controller("bdReservoirMgmtCtrl", [function() {
    console.log('bdReservoirMgmtCtrl');
    this.test = function() {
        alert(this.name);
    }
}]).name;
