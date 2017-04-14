'use strict';
module.exports = angular.module("app.storeMgmt")
    .controller("storeMgmtCtrl",['$scope',function($scope) {

    $scope.getOriginData={
        asnStatusLists:[
            {
                key:'10',
                value:'打开'
            },{
                key:'02',
                value:'生效'
            },{
                key:'03',
                value:'部分拣货'
            },{
                key:'04',
                value:'已拣货'
            },{
                key:'05',
                value:'部分发运'
            },{
                key:'06',
                value:'已发运'
            }
        ],
        asnStatusLis:[

            {
                key:'1',
                value:'打开'
            },{
                key:'02',
                value:'生效'
            },{
                key:'03',
                value:'取消'
            },{
                key:'04',
                value:'部分收货'
            },{
                key:'05',
                value:'已收货'
            },{
                key:'06',
                value:'部分上架'
            },{
                key:'07',
                value:'已上架'
            }
        ]
    };



}])


