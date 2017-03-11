'use strict';
module.exports = angular.module("app.gardenMgmt").controller("gardenMgmtCtrl",['$state',function($state) {

    this.test = function() {
        alert(this.name);
    }
}]).controller("rentalMgmtCtrl", ['$scope','modifyById',function($scope,modifyById) {
    $scope.getOriginData={
        rentalStatus:[{
            key:'0',
            value:'打开'
        },{
            key:'0',
            value:'生效'
        }]
    };
    var showTitle=['新增仓库出租信息','修改仓库出租信息'];
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

            var d=modifyById(id,'/wms/action/','请先选择一个项目');
            d.then(function(res){
                if(res=='err'){

                }else{
                    //跳转 并绑定数据
                    this.showText.firstTitle=showTitle[1];
                    this.addAsn();
                }
            });


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


}]).controller("leaseWarningCtrl", ['$scope','modifyById',function($scope,modifyById) {
    $scope.btnAction={
        showIndex:true,

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

    };

    //测试使用  以后需要删除

}]).controller("businessStatisticsCtrl", ['$scope',function($scope) {
    $scope.getOriginData={
        businessStates:[{
            key:'0',
            value:'采购订单'
        },{
            key:'0',
            value:'生产订单'
        },{
            key:'0',
            value:'调拨订单'
        },{
            key:'0',
            value:'销售订单'
        },{
            key:'0',
            value:'其他'
        }]
    }
}]).name;
