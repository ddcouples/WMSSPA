'use strict';
module.exports = angular.module("app.sysSetting").controller("sysSettingCtrl",['$state',function($state) {
    console.log('sysSettingCtrl');

    this.test = function() {
        alert(this.name);
    }
}]).controller("epManagementCtrl", [function() {
    console.log('epManagementCtrl');
    this.test = function() {
        alert(this.name);
    }
}]).controller("rightsMgmtCtrl", [function() {
    console.log('rightsMgmtCtrl');
    this.test = function() {
        alert(this.name);
    }
}]).name;
