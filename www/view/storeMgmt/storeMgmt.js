'use strict';
module.exports = angular.module("app.storeMgmt").controller("storeMgmtCtrl",['$scope',function($scope) {

    $scope.getOriginData={
        asnStatusLists:[
            {
                key:'1',
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
    }
}]).controller("receiveMgmtCtrl", ['$scope','store',function($scope,store) {
    //显示的数据 select框 进入页面的get请求
    $scope.getOriginData={
        asnStatusLists:[
            {
                key:'0',
                value:'请选择'
            },
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
        ],
        dataFromLists:[
            {
                key:'0',
                value:'请选择'
            },
            {
                key:'1',
                value:'手动录入'
            },{
                key:'02',
                value:'批量导入'
            }
        ]
    }

    $scope.searchReceiveMsg={ //个字段的顺序和前端显示顺序要一致 方便下步复用
        "ownerComment": "", // 货主
        "asn" : {
            poNo:'',
            asnNo:'',
            asnStatus:'请选择',
            orderDate:'',
            dataFrom:'请选择'
        },
        "createPersonComment":''
        // "currentPage": "0" // 当前页码
    };
    var _empty_searchReceiveMsg={
        "ownerComment":"", // 货主
        "asn" : {
            poNo:'',
            asnNo:'',
            asnStatus:'请选择',
            orderDate:'',
            dataFrom:'请选择'
        },
        "createPersonComment":''
        // "currentPage": "0" // 当前页码
    }
    $scope.historyMessages=[];//用于存储历史查询信息  可以存入store
    if(store.get('receiveMgmt_historyMessages')){
        $scope.historyMessages=store.get('receiveMgmt_historyMessages');
    }
    $scope.$watchCollection('historyMessages',function(newV){
        if(newV){
            store.set('receiveMgmt_historyMessages', $scope.historyMessages);
        }
    });

    //开始查询页面
    $scope.searchformAction={
        search:function(){
            if(!angular.equals($scope.searchReceiveMsg,_empty_searchReceiveMsg)){
                var _obj={};
                angular.copy($scope.searchReceiveMsg,_obj);
                if($scope.historyMessages.length>=10){
                    $scope.historyMessages.shift(1);
                }
                $scope.historyMessages.push(_obj);
                 //开始查询
                $scope.pageModel=Object.assign( $scope.pageModel,$scope.searchReceiveMsg);
                 $scope.getPageByJson('/wms/asn/list');
            }

        },
        reset:function(){
            angular.copy(_empty_searchReceiveMsg,$scope.searchReceiveMsg);
        }
    }

    //将查询条件嵌入到$scope.pageModel
    angular.element(document).ready(function () {
        // $scope.getPageByJson('http://192.168.1.100:8080/wms/asn/list');
    })
    //分页查询 page指令



    //按钮操作页面

    $scope.btnAction={
        showAddOrModify:false,
        showIndex:true,
        addAsn:function(){
            this.showAddOrModify=!this.showAddOrModify;
            this.showIndex=!this.showIndex;
        },
        modifyAsn:function(){
            this.showAddOrModify=!this.showAddOrModify;
            this.showIndex=!this.showIndex;
        },
        searchModel:function(id){
            $('#'+id).modal('show');
            console.log($scope);
        },
        showMakeSureGetGoods:false,
        MakeSureGetGoodsBtn:function(){
            this.showMakeSureGetGoods=!this.showMakeSureGetGoods;
            this.showIndex=!this.showIndex;
        }
    }

}]).controller("shelvesMgmtCtrl", ['$scope',function($scope) {



}]).controller("deliveryGoodMgmtCtrl", ['$scope',function($scope) {



}]).controller("pickingMgmtCtrl", ['$scope',function($scope) {



}]).controller("waveCountMgmtCtrl", ['$scope',function($scope) {//波次管理Controllrer



}]).controller("inventoryMgmtCtrl", ['$scope',function($scope) {//库存管理Controllrer

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

}]).controller("takeStockCtrl", ['$scope',function($scope) {//盘点Controllrer

  $scope.getOriginData={
      inventoryStatus:[{
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

}])
    .controller("profitLossAdjustmentCtrl", ['$scope',function($scope) {//盘点Controllrer

        $scope.getOriginData={
            AdjustStatus:[{
                key:'0',
                value:'打开'
            },{
                key:'0',
                value:'已调帐'
            },{
                key:'0',
                value:'取消'
            }]
        }

    }])
    .controller("gressionCtrl", ['$scope',function($scope) {//盘点Controllrer

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

    }])
    .name;
