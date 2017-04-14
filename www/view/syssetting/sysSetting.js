'use strict';
module.exports = angular.module("app.sysSetting").controller("sysSettingCtrl",['$state',function($state) {
    console.log('sysSettingCtrl');

    this.test = function() {
        alert(this.name);
    }
}]).name;
