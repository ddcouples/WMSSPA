
'use strict';
module.exports = angular.module("app.sysSetting").controller("interfaceMgmtCtrl", ['$scope',function($scope) { //接口管理控制器
        $scope.getOriginData={
            peopleStatus:[
                {
                    key:'1',
                    value:'打开'
                },{
                    key:'02',
                    value:'生效'
                }]
        }
    }]).name;
/**
 * Created by yangl on 2017/3/6.
 */


