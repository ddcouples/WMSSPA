'use strict';

require('./login.scss');

module.exports = angular.module("app.login").controller("loginCtrl", ['$scope','httpServer',function($scope,httpServer) {
    this.info={};
    $scope.store={
        "lists" : [
            {
                warehouseId : '1', //仓库id
                warehouseName :'仓库1'   //仓库名称
            },
            {
                warehouseId : '2', //仓库id
                warehouseName :'仓库2'   //仓库名称
            }
        ],

        warehouse:{
            warehouseId:'1',
            warehouseName :'仓库1'
        }
    }
    this.submitLogin = function() {
        $('#storModel').modal('show');

        $scope.submit=true;
        if($scope.loginForm.enterprise.$invalid){
            $scope.error.text=errorText[1];
        }else if($scope.loginForm.login_user.$invalid){
            $scope.error.text=errorText[2];
        } else if($scope.loginForm.login_key.$invalid){
            $scope.error.text=errorText[3];
        }
        $scope.error.show=false;
        if($scope.loginForm.$valid) {
            httpServer.postDataCROS('http://192.168.1.103:8080/wms/console/login/doLogin', this.info).then(function(res){

                if(res=='error'){
                    $scope.error.show=true;
                    $scope.error.text='网络错误，请重新登陆!';
                }else{
                    $scope.error.show=false;//关闭提示信息
                    if(res.data.status==='1'){
                        $('#storModel').modal('show');
                        $scope.store.list=res.data.list;
                    }else if(res.data.status=='0'){

                        $scope.error.show=true;//显示提示信息
                        $scope.error.text=res.data.message;
                    }
                }
            })
        }
    };
    var errorText=['请按要求输入！','请输入企业编码！','请输入用户名！','请输入密码！'];
    $scope.error={
        text:errorText[0],
        show:false
    }
    $scope.changeStore=function(){
        var data={};
        data.warehouseId= $scope.store.warehouse.warehouseId;
        httpServer.postData('http://192.168.1.103:8080/wms/console/login/doLogin',data).then(function(res){
            //进行跳转
            $('#storModel').modal('hide');
            console.log(res);
            if(res=='error'){
                $scope.error.show=true;
                $scope.error.text='网络错误，请重新登陆!';
            }else{
                $scope.error.show=false;//关闭提示信息
                if(!res.data) return;
                if(res.data.status==='1'){
                    console.log(1);
                }else if(res.data.status=='0'){
                    console.log(0);
                }
            }
        })
    }
}]).name;