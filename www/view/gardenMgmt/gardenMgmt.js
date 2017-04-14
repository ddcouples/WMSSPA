'use strict';
module.exports = angular.module("app.gardenMgmt").controller("gardenMgmtCtrl",['$state',function($state) {

    this.test = function() {
        alert(this.name);
    }
}]).controller("rentalMgmtCtrl", ['$scope','commit','tooltip','modifyById','arrayAction','httpServer','objectAction','$filter','scrollObj',
    function($scope,commit,tooltip,modifyById,arrayAction,httpServer,objectAction,$filter,scrollObj) {

        var showTitle=['新增仓库出租信息','修改仓库出租信息'];

        //获取初始参数数据  这里可以继续get请求
        httpServer.postData('/param/show',['STATUS','PARKRENTSTYLE','PARKFEESTYLE','PARKSETTLECYCLE','WARNFREQUENCY','WARNSTYLE']).then(function(res){
            $scope.getOriginData = res;
        });

        //状态
        var status = {
            'OPEN':10,
            'ENABLE':20,
            'CANCAL':99
        };

        //Url
        $scope.searchUrl = "/parkRent/qryList";

        var url = {
            'view':'/parkRent/view',
            'addAndUpdate': '/parkRent/addAndUpdate',
            'disable':'/parkRent/disable',
            'enable':'/parkRent/enable'
        };

    function ParkRentVo(){
        this.parkRent={
            "rentId":"",
            "orgId":"",
            "warehouseId":"",
            "rentStatus":"",
            "startTime":"",
            "endTime":"",
            "rentMoney":"",
            "deposit":"",
            "rentStyle":"",
            "feeStyle":"",
            "settleCycle":"",
            "warnDays":"",
            "warnFrequency":"",
            "warnStyle":"",
            "merchantId":"",
            "remark":""
        };
        this.orgName = "";
        this.warehouseName = "";
        this.merchantName = "";
        this.rentStatusComment = "";
        this.rentStyleComment = "";
        this.feeStyleComment = "";
        this.settleCycleComment = "";
        this.warnFrequencyComment = "";
        this.warnStyleComment = "";
    }

     $scope.ParkRentModelQuery = {};
    //查询条件
    $scope.parkRentReqparam = {
        "parkRent":{
            "rentStatus":""
        },
        "orgName":"",
        "merchantName":"",
        "warehouseName":""
    };

    var _parkRentReqparam ={
        "parkRent":{
            "rentStatus":""
        },
        "orgName":"",
        "merchantName":"",
        "warehouseName":""
    };

        //开始查询页面
        $scope.searchAction = {
            selectedItems : [] , // 列表中选中的记录
            selectedAll : false , // 全选按钮默认不选中
            currentSelectItem : 9999 ,
            dataList:[],
            search:function(){
                //开始查询 即与绑定的page指令的查询端口进行双向数据绑定
                $scope.searchAction.dataList =[];
                var _pageModelQuery={};
                angular.copy($scope.ParkRentModelQuery,_pageModelQuery);
                $scope.ParkRentModelQuery=_pageModelQuery;
            },
            reset:function(){
                $scope.parkRentReqparam = objectAction.newCopy(_parkRentReqparam) ;
            },
            // 多选复选框
            chkSelectAll:function (flag) {
                if ( $scope.searchAction.dataList.length>0 ) {
                    angular.forEach($scope.searchAction.dataList,function(data,index){
                        if(flag){
                            $scope.searchAction.selectedItems[index]=true;
                        }else{
                            $scope.searchAction.selectedItems[index]=false;
                        }
                    });
                }
            } , // 多选复选框 end
            // 选中单选框
            selectOne:function(index,$event){
                this.currentSelectItem=index;
                //点击进行是否选择操作
                $scope.searchAction.selectedItems[index]= !$scope.searchAction.selectedItems[index];
                // 如果该点击项不是选中状态就将全部选中状态去掉
                $scope.searchAction.selectedAll=false;
                var allCheck = true;
                angular.forEach($scope.searchAction.dataList,function(data,index){
                    if(!$scope.searchAction.selectedItems[index]){
                        allCheck = false;
                        return false;
                    }
                });
                if ( allCheck ) {
                    $scope.searchAction.selectedAll=true;
                }
            } , // 选中单选框 end
            isSelect:function(element){
                return element;
            },
            //检查是否选中一个
            isSelectOne:function(){
                if ($scope.searchAction.selectedItems.filter($scope.searchAction.isSelect).length == 0) {
                    tooltip("请选择一个记录");
                    return false;
                }

                if($scope.searchAction.selectedItems.filter($scope.searchAction.isSelect).length > 1){
                    tooltip("您只能选择一项进行修改！");
                    return false;
                }
                return true;
            },
            //选中的项
            selectedItem:function(){
                for(var i=0;i<$scope.searchAction.selectedItems.length;i++){
                    if($scope.searchAction.selectedItems[i]){
                        return $scope.searchAction.dataList[i];
                    }
                }
            }

        };


    $scope.parkRentVoInfo = {};
    $scope.btnAction={
        showText:{
            firstTitle:showTitle[0]
        },
        showAddOrModify:false,
        showIndex:true,
        addOrModify:function(){
            this.showAddOrModify=!this.showAddOrModify;
            this.showIndex=!this.showIndex;
        },
        toAdd:function(){ //点击切换新增ASN页面
            this.addOrModify();
            $scope.addOrModifyAction.parkRentVo = new ParkRentVo();
        },
        toModify:function(){//点击切换修改ASN页面
            if(!$scope.searchAction.isSelectOne()){
                return;
            }
            var item  = $scope.searchAction.selectedItem();
            if(item.parkRent.rentStatus != status.OPEN){
                tooltip('需选择状态为打开的记录进行修改！');
                return;
            };
            httpServer.postData(url.view,item).then(function(res){
                if(res!='error'&&res!='errorId') {
                    //跳转 并绑定数据
                    $scope.addOrModifyAction.parkRentVo = res;
                    $scope.addOrModifyAction.old_RentVo = objectAction.newCopy(res);
                    $scope.btnAction.showText.firstTitle = showTitle[1];
                    $scope.btnAction.addOrModify();
                }
            })
        },
        showDetail:false,
        turnShowDetail:function(){
            this.showDetail=!this.showDetail;
            this.showIndex=!this.showIndex;
        },
        view:function(id){
            var _item = new ParkRentVo();
            _item.parkRent.rentId = id;
            httpServer.postData(url.view,_item).then(function(res){
                if(res!='error'&&res!='errorId') {
                    //跳转 并绑定数据
                    $scope.addOrModifyAction.parkRentVo = res;
                }
            })
            //测试使用
            this.showDetail=!this.showDetail;
            this.showIndex=!this.showIndex;
        },
        searchModel:function(id){
            $('#'+id).modal('show');
        },
        enable:function(){
            if(!$scope.searchAction.isSelectOne()){
                return;
            }
            var item  = $scope.searchAction.selectedItem();
            //打开状态才能生效
            if(item.parkRent.rentStatus != status.OPEN){
                tooltip('需选择状态为打开的记录进行生效！');
                return;
            }else{
                httpServer.postData(url.enable,item).then(function(res){
                    if(res!='error'&& res!='errorId') {
                        $scope.searchAction.search();
                        tooltip("生效成功！");
                    }
                });

            }
        },
        disable:function(){
            if(!$scope.searchAction.isSelectOne()){
                return;
            }
            var item  = $scope.searchAction.selectedItem();
            //打开状态才能生效
            if(item.parkRent.rentStatus != status.ENABLE){
                tooltip('需选择状态为生效的记录进行失效！');
                return;
            }else{
                httpServer.postData(url.disable,item).then(function (res) {
                    if(res!='error'&& res!='errorId') {
                        $scope.searchAction.search();
                        tooltip("失效成功！");
                    }
                });

            }
        }
    };

    $scope.addOrModifyAction={
        parkRentVo:{},
        old_RentVo:{},
        toAdd:function(){

        },
        save:function(){
            httpServer.postData(url.addAndUpdate, $scope.addOrModifyAction.parkRentVo).then(function(res){
                if(res!='error'&& res!='errorId') {
                    $scope.addOrModifyAction.parkRentVo = new ParkRentVo();
                }

            });
        },
        saveAndBack:function(){
            httpServer.postData(url.addAndUpdate, $scope.addOrModifyAction.parkRentVo).then(function(res){
                if(res!='error'&& res!='errorId') {
                    $scope.addOrModifyAction.parkRentVo = new ParkRentVo();
                }

            });
            this.back();
        },
        back:function(){
            $scope.btnAction.toAdd();
        }
    };




}]).controller("leaseWarningCtrl", ['$scope','commit','tooltip','modifyById','arrayAction','httpServer','objectAction','$filter','scrollObj',
    function($scope,commit,tooltip,modifyById,arrayAction,httpServer,objectAction,$filter,scrollObj) {

        //状态
        var status = {
            'OPEN':10,
            'CLOSE':98
        };

        //Url
        $scope.searchUrl = "/parkWarn/qryList";

        var url = {
            'view':'/parkWarn/view',
            'close': '/parkRent/close'
        };

        function ParkWarnVo(){
            this.parkRentVo = {
                "parkRent":{
                        "rentId":"",
                        "orgId":"",
                        "warehouseId":"",
                        "rentStatus":"",
                        "startTime":"",
                        "endTime":"",
                        "rentMoney":"",
                        "deposit":"",
                        "rentStyle":"",
                        "feeStyle":"",
                        "settleCycle":"",
                        "warnDays":"",
                        "warnFrequency":"",
                        "warnStyle":"",
                        "merchantId":"",
                        "remark":""
                    },
                    "orgName":"",
                    "warehouseName":"",
                    "merchantName":"",
                    "rentStatusComment":"",
                    "rentStyleComment":"",
                    "feeStyleComment":"",
                    "settleCycleComment":"",
                    "warnFrequencyComment":"",
                    "warnStyleComment":""
            };
            this.parkWarn = {
                "warnId":"",
                "rentId":"",
                "warnStatus":"",
                "warnMsg":"",
                "orgId":"",
                "merchantId":""
            };
            this.orgName = "";
            this.warehouseName = "";
            this.merchantName = "";
            this.warnStatusComment = "";
            this.countDown = 0;
        };

        //查询条件
        $scope.parkWarnReqparam = {
            "orgName":"",
            "merchantName":"",
            "warehouseName":""
        };

        var _parkWarnReqparam ={
            "orgName":"",
            "merchantName":"",
            "warehouseName":""
        };

        $scope.ParkWarnModelQuery = {};

        //开始查询页面
        $scope.searchAction = {
            selectedItems : [] , // 列表中选中的记录
            selectedAll : false , // 全选按钮默认不选中
            currentSelectItem : 9999 ,
            dataList:[],
            search:function(){
                //开始查询 即与绑定的page指令的查询端口进行双向数据绑定
                $scope.searchAction.dataList =[];
                var _pageModelQuery={};
                angular.copy($scope.ParkWarnModelQuery,_pageModelQuery);
                $scope.ParkWarnModelQuery=_pageModelQuery;
            },
            reset:function(){
                $scope.parkWarnReqparam = objectAction.newCopy(_parkWarnReqparam) ;
            },
            // 多选复选框
            chkSelectAll:function (flag) {
                if ( $scope.searchAction.dataList.length>0 ) {
                    angular.forEach($scope.searchAction.dataList,function(data,index){
                        if(flag){
                            $scope.searchAction.selectedItems[index]=true;
                        }else{
                            $scope.searchAction.selectedItems[index]=false;
                        }
                    });
                }
            } , // 多选复选框 end
            // 选中单选框
            selectOne:function(index,$event){
                this.currentSelectItem=index;
                //点击进行是否选择操作
                $scope.searchAction.selectedItems[index]= !$scope.searchAction.selectedItems[index];
                // 如果该点击项不是选中状态就将全部选中状态去掉
                $scope.searchAction.selectedAll=false;
                var allCheck = true;
                angular.forEach($scope.searchAction.dataList,function(data,index){
                    if(!$scope.searchAction.selectedItems[index]){
                        allCheck = false;
                        return false;
                    }
                });
                if ( allCheck ) {
                    $scope.searchAction.selectedAll=true;
                }
            } , // 选中单选框 end
            isSelect:function(element){
                return element;
            },
            //检查是否选中一个
            isSelectOne:function(){
                if ($scope.searchAction.selectedItems.filter($scope.searchAction.isSelect).length == 0) {
                    tooltip("请选择一个记录");
                    return false;
                }

                if($scope.searchAction.selectedItems.filter($scope.searchAction.isSelect).length > 1){
                    tooltip("您只能选择一项进行修改！");
                    return false;
                }
                return true;
            },
            //选中的项
            selectedItem:function(){
                for(var i=0;i<$scope.searchAction.selectedItems.length;i++){
                    if($scope.searchAction.selectedItems[i]){
                        return $scope.searchAction.dataList[i];
                    }
                }
            }

        };

        $scope.parkWarnVoInfo = {};

    $scope.btnAction={
        showIndex:true,

        showDetail:false,
        turnShowDetail:function(){
            this.showDetail=!this.showDetail;
            this.showIndex=!this.showIndex;
        },
        view:function(id){
            var _item = new ParkWarnVo();
            _item.parkWarn.warnId = id;
            httpServer.postData(url.view,_item).then(function(res){
                if(res!='error'&&res!='errorId') {
                    //跳转 并绑定数据
                    $scope.parkWarnVoInfo = res;
                }
            });
            //测试使用
            this.showDetail=!this.showDetail;
            this.showIndex=!this.showIndex;
        },
        close:function(){
            if(!$scope.searchAction.isSelectOne()){
                return;
            }
            var item  = $scope.searchAction.selectedItem();
            //打开状态才能生效
            if(item.parkWarn.warnStatus != status.OPEN){
                tooltip('需选择状态为生效的记录进行关闭！');
                return;
            }else{
                httpServer.postData(url.close,item).then(function(res){
                    if(res!='error'&& res!='errorId') {
                        $scope.searchAction.search();
                        tooltip("关闭成功！");
                    }
                });

            }
        }
    };

    //测试使用  以后需要删除

}]).controller("businessStatisticsCtrl", ['$scope','commit','tooltip','modifyById','arrayAction','httpServer','objectAction','$filter','scrollObj',
    function($scope,commit,tooltip,modifyById,arrayAction,httpServer,objectAction,$filter,scrollObj){

        //获取初始参数数据  这里可以继续get请求
        httpServer.postData('/param/show',['STATUS']).then(function(res){
            $scope.getOriginData = res;
        });

        //状态
        var status = {
            'OPEN':10,
            'CLOSE':98
        };

        function ParkOrgBusiStasVo(){
            this.parkOrgBusiStas = {
                 "busiStasId":"",
                 "orgId":"",
                 "merchantId":"",
                 "docNo":"",
                 "busiType":"",
                 "stasQty":"",
                 "stasWeight":"",
                 "stasVolume":"",
                 "stasDate":""
            };
            this.orgName = "";
            this.merchantName = "";
            this.beginDate = "";
            this.endDate = "";
            this.busiTypeComment = "";
        }

        $scope.parkOrgBusiStasReqParam = {
            "parkOrgBusiStas":{
                "busiType":""
             },
            "orgName":"",
            "merchantName":"",
           "beginDate":"",
            "endDate":""
        };

        var _parkOrgBusiStasReqParam = {
            "parkOrgBusiStas":{
                "busiType":""
            },
            "orgName":"",
            "merchantName":"",
            "beginDate":"",
            "endDate":""
        };

        $scope.ParkOrgBusiStasModelQuery = {};

        //开始查询页面
        $scope.searchAction = {
            selectedItems : [] , // 列表中选中的记录
            selectedAll : false , // 全选按钮默认不选中
            currentSelectItem : 9999 ,
            dataList:[],
            search:function(){
                //开始查询 即与绑定的page指令的查询端口进行双向数据绑定
                $scope.searchAction.dataList =[];
                var _pageModelQuery={};
                angular.copy($scope.ParkOrgBusiStasModelQuery,_pageModelQuery);
                $scope.ParkOrgBusiStasModelQuery=_pageModelQuery;
            },
            reset:function(){
                $scope.parkOrgBusiStasReqParam = objectAction.newCopy(_parkOrgBusiStasReqParam) ;
            },
            // 多选复选框
            chkSelectAll:function (flag) {
                if ( $scope.searchAction.dataList.length>0 ) {
                    angular.forEach($scope.searchAction.dataList,function(data,index){
                        if(flag){
                            $scope.searchAction.selectedItems[index]=true;
                        }else{
                            $scope.searchAction.selectedItems[index]=false;
                        }
                    });
                }
            } , // 多选复选框 end
            // 选中单选框
            selectOne:function(index,$event){
                this.currentSelectItem=index;
                //点击进行是否选择操作
                $scope.searchAction.selectedItems[index]= !$scope.searchAction.selectedItems[index];
                // 如果该点击项不是选中状态就将全部选中状态去掉
                $scope.searchAction.selectedAll=false;
                var allCheck = true;
                angular.forEach($scope.searchAction.dataList,function(data,index){
                    if(!$scope.searchAction.selectedItems[index]){
                        allCheck = false;
                        return false;
                    }
                });
                if ( allCheck ) {
                    $scope.searchAction.selectedAll=true;
                }
            } , // 选中单选框 end
            isSelect:function(element){
                return element;
            },
            //检查是否选中一个
            isSelectOne:function(){
                if ($scope.searchAction.selectedItems.filter($scope.searchAction.isSelect).length == 0) {
                    tooltip("请选择一个记录");
                    return false;
                }

                if($scope.searchAction.selectedItems.filter($scope.searchAction.isSelect).length > 1){
                    tooltip("您只能选择一项进行修改！");
                    return false;
                }
                return true;
            },
            //选中的项
            selectedItem:function(){
                for(var i=0;i<$scope.searchAction.selectedItems.length;i++){
                    if($scope.searchAction.selectedItems[i]){
                        return $scope.searchAction.dataList[i];
                    }
                }
            }

        };

}]).name;
