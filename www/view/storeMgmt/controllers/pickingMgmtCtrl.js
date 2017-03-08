
'use strict';
module.exports = angular.module("app.storeMgmt").controller("pickingMgmtCtrl", ['$scope',function($scope) {
    var showTitle=['新增拣货单','修改拣货单'];
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
        splitAsn:function(){//点击切换拆分ASN页面
            this.showIndex=!this.showIndex;
            this.showSplitAsn=!this.showSplitAsn;
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
        MakeSureWork:false,
        MakeSureWorkBtn:function(){//点击切换收货确认
            this.MakeSureWork=!this.MakeSureWork;
            this.showIndex=!this.showIndex;
        }
    }
}]).name;
/**
 * Created by yangl on 2017/3/6.
 */
