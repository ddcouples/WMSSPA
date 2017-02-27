'use strict';
module.exports = angular.module("app.storeMgmt").controller("storeMgmtCtrl",['$state',function($state) {

    this.test = function() {
        alert(this.name);
    }
}]).controller("receiveMgmtCtrl", [function() {
    console.log('receiveMgmtCtrl');
    this.test = function() {
        alert(this.name);
    }
}]).controller("shelvesMgmtCtrl", [function() {
    console.log('shelvesMgmtCtrl');
    this.test = function() {
        alert(this.name);
    }
}]).name;
