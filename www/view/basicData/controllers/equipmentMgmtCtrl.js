
'use strict';
module.exports = angular.module("app.basicData")
    .controller("equipmentMgmtCtrl", ['$scope',function($scope) {//设备管理控制器
        $scope.getOriginData={
            equipmentStatus:[{
                key:0,
                value:'打开'
            },{
                key:1,
                value:'生效'
            }]
        };
        var showTitle=['新增设备','修改设备'];
        $scope.btnAction={
            showText:{
                firstTitle:showTitle[0]
            },
            showAddOrModify:false,
            showIndex:true,
            AddOrModify:function(){  //单独操作 是否显示新增或修改
                this.showAddOrModify=!this.showAddOrModify;
                this.showIndex=!this.showIndex;
            },
            addAsn:function(){ //点击切换新增ASN页面
                this.showText.firstTitle=showTitle[0]; //将显示页面显示为新增
                this.AddOrModify();
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
                this.AddOrModify();

            },
            searchModel:function(id){
                $('#'+id).modal('show');
            }
        };
    }])
    .name;
/**
 * Created by yangl on 2017/3/6.
 */
