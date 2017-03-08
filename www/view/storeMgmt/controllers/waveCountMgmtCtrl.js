'use strict';
module.exports = angular.module("app.storeMgmt").controller("waveCountMgmtCtrl", ['$scope',function($scope) {
    var showTitle=['新增波次单','修改波次单'];
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
        }
    }
}]).name;
/**
 * Created by yangl on 2017/3/6.
 */
