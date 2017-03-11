/**
 * Created by yangl on 2017/3/10.
 */'use strict';
module.exports = angular.module("app.basicData").controller("merchantsMgmtCtrl", ['$scope',function($scope) {//客商管理控制器
        $scope.getOriginData={
            merchantsStatus:[{
                key:0,
                value:'打开'
            },{
                key:1,
                value:'关闭'
            }]
        }
    var showTitle=['新增客商','修改客商'];
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
        showDetail:false,
        turnShowDetail:function(){
            this.showDetail=!this.showDetail;
            this.showIndex=!this.showIndex;
        },
        showDetailActionGetData:function(id){
            //以后加入绑数据使用
            //var d=modifyById(id,'/wms/action/','请先选择一个项目');
            // d.then(function(res){
            //     if(res=='err'){
            //
            //     }else{
            //         //跳转 并绑定数据
            //         this.showDetail=!this.showDetail;
            //         this.showIndex=!this.showIndex;
            //     }
            // });
            //测试使用
            this.showDetail=!this.showDetail;
            this.showIndex=!this.showIndex;
        },
        searchModel:function(id){
            $('#'+id).modal('show');
        }
    };
}])
    .name
