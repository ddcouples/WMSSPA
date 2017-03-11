/**
 * Created by yangl on 2017/3/10.
 */'use strict';
module.exports = angular.module("app.basicData").controller("platformMgmtCtrl", ['$scope',function($scope) {//月台管理路由器
        $scope.getOriginData={
            platformStatus:[{
                key:0,
                value:'打开'
            },{
                key:1,
                value:'关闭'
            }]
        };
    var showTitle=['新增月台','修改月台'];
    $scope.btnAction={
        showText:{
            firstTitle:showTitle[0]
        },
        showAddOrModify:false,
        showIndex:true,
        addAsn:function(){ //点击切换新增ASN页面
            this.showAddOrModify=!this.showAddOrModify;
            this.showIndex=!this.showIndex;
        },
        modifyAsn:function(id){//点击切换修改ASN页面

            // var d=modifyById(id,'/wms/action/','请先选择一个项目');
            // d.then(function(res){
            //     if(res=='err'){
            //
            //     }else{
            //         //跳转 并绑定数据
            //         this.showText.firstTitle=showTitle[1];
            //         this.addAsn();
            //     }
            // });
            this.showText.firstTitle=showTitle[1];
            this.addAsn();


        },
        searchModel:function(id){
            $('#'+id).modal('show');
        }
    };
}])
    .name
