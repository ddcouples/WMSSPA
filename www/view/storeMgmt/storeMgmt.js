'use strict';
module.exports = angular.module("app.storeMgmt").controller("storeMgmtCtrl",['$state',function($state) {

    this.test = function() {
        alert(this.name);
    }
}]).controller("receiveMgmtCtrl", ['$scope',function($scope) {
    $scope.searchReceiveMsg={
        "asn" : {
            poNo:'',
            asnStatus:'00',
            dataFrom:'00'
        },
        "ownerComment": "", // 客商名称
        "currentPage": "0" // 当前页码
    }
    $scope.$watch('searchReceiveMsg.ownerComment',function(newV){

    })
}]).controller("shelvesMgmtCtrl", [function() {
    console.log('shelvesMgmtCtrl');
    this.test = function() {
        alert(this.name);
    }
}]).name;
