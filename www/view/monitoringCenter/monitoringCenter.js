'use strict';
module.exports = angular.module("app.monitoringCenter").controller("monitoringCenterCtrl",['$state',function($state) {

    this.test = function() {
        alert(this.name);
    }
}]).controller("exceptionMgmtCtrl", [function() {
    console.log('exceptionMgmtCtrl');
    this.test = function() {
        alert(this.name);
    }
}]).controller("inventoryWarningCtrl", [function() {
    console.log('inventoryWarningCtrl');
    this.test = function() {
        alert(this.name);
    }
}]).name;
