'use strict';
module.exports = angular.module("app.storeMgmt").controller("gressionCtrl", ['$scope',function($scope) {
        $scope.getOriginData={
            gressionStatus:[{
                key:'0',
                value:'打开'
            },{
                key:'0',
                value:'生效'
            },{
                key:'0',
                value:'作业中'
            },{
                key:'0',
                value:'作业完成'
            }]
        }
        console.log('gressionCtrl');
}]).name;
/**
 * Created by yangl on 2017/3/6.
 */
