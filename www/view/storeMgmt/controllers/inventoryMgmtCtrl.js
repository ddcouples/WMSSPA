'use strict';
module.exports = angular.module("app.storeMgmt").controller("inventoryMgmtCtrl", ['$scope',function($scope) {
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
    var showTitle=['库存导入','库存调整'];
    $scope.btnAction={
        showText:{
            firstTitle:showTitle[0]
        },
        showImport:false,
        showStore_adjustment:false,
        showIndex:true,
        showImportAction:function(){ //点击切换新增ASN页面
            this.showImport=!this.showImport;
            this.showIndex=!this.showIndex;
        },
        showStoreAdjustmentAction:function(){//点击切换修改ASN页面
            this.showStore_adjustment=!this.showStore_adjustment;
            this.showIndex=!this.showIndex;
            this.showText.firstTitle=showTitle[1];
        },

        searchModel:function(id){
            $('#'+id).modal('show');
        },
        predistribution:false,
        predistributionBtn:function(){//点击切换收货确认
            this.predistribution=!this.predistribution;
            this.showIndex=!this.showIndex;
        },
        frozenIndex:0

    }
}]).name;
/**
 * Created by yangl on 2017/3/6.
 */
