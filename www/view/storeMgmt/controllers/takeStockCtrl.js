'use strict';
module.exports = angular.module("app.storeMgmt").controller("takeStockCtrl", ['$scope',function($scope) {
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
    var showTitle=['新增盘点单','修改盘点单'];
    $scope.btnAction={
        showText:{
            firstTitle:showTitle[0]
        },
        showAddOrModify:false,
        showSplitAsn:false,
        showIndex:true,
        addAsn:function(){ //点击切换新增ASN页面
            this.showAddOrModify=!this.showAddOrModify;
            this.showIndex=!this.showIndex;
        },
        modifyAsn:function(){//点击切换修改ASN页面
            this.showAddOrModify=!this.showAddOrModify;
            this.showIndex=!this.showIndex;
            this.showText.firstTitle=showTitle[1];
        },
        searchModel:function(id){
            $('#'+id).modal('show');
        },
        showAsnDetail:false,
        showAsnDetailAction:function(){
            this.showAsnDetail=!this.showAsnDetail;
            this.showIndex=!this.showIndex;
        },
        showAsnDetailActionGetData:function(id){
            this.showAsnDetailAction();
            //而后进行查询数据绑定
            console.log(id);
        },
        showMakeSureGetGoods:false,
        MakeSureGetGoodsBtn:function(){//点击切换收货确认
            this.showMakeSureGetGoods=!this.showMakeSureGetGoods;
            this.showIndex=!this.showIndex;
        }
    }
}]).name;
/**
 * Created by yangl on 2017/3/6.
 */
