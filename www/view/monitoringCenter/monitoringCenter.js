'use strict';
module.exports = angular.module("app.monitoringCenter").controller("monitoringCenterCtrl",['$state',function($state) {

    this.test = function() {
        alert(this.name);
    }
}]).controller("exceptionMgmtCtrl", ['$scope',function($scope) {
    $scope.btnAction={
        showAddOrModify:false,
        showHandling:false,
        showIndex:true,
        addAsn:function(){ //点击切换新增ASN页面
            this.showAddOrModify=!this.showAddOrModify;
            this.showIndex=!this.showIndex;
        },
        modifyAsn:function(){//点击切换修改ASN页面
            this.showHandling=!this.showHandling;
            this.showIndex=!this.showIndex;
        },
        searchModel:function(id){
            $('#'+id).modal('show');
        }
    }
}]).controller("inventoryWarningCtrl", ['$scope',function($scope) {
    $scope.getOriginData={
        storStatusLists:[{
            key:0,
            value:'合格'
        },{
            key:1,
            value:'不合格'
        },{
            key:2,
            value:'代建合格'
        }],
        freezeStatusLists:[{
            key:0,
            value:'是'
        },{
            key:1,
            value:'否'
        }]
    }
}]).name;
