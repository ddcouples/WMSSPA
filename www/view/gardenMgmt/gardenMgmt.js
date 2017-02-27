'use strict';
module.exports = angular.module("app.gardenMgmt").controller("gardenMgmtCtrl",['$state',function($state) {

    this.test = function() {
        alert(this.name);
    }
}]).controller("goodsMgmtCtrl", [function() {
    console.log('goodsMgmtCtrl');
    this.test = function() {
        alert(this.name);
    }
}]).controller("gardenShelvesMgmtCtrl", [function() {
    console.log('gardenShelvesMgmtCtrl');
    this.test = function() {
        alert(this.name);
    }
}]).controller("gardenDeliveryMgmtCtrl", [function() {
    console.log('gardenDeliveryMgmtCtrl');
    this.test = function() {
        alert(this.name);
    }
}]).name;
