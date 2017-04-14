/**
 * Created by yangl on 2017/3/10.
 */'use strict';
module.exports = angular.module("app.basicData").controller("bdStoreMgmtCtrl", ['$scope','$filter','tooltip','modifyById','arrayAction', 'httpServer','objectAction','scrollObj','store','commit'
    , function($scope,$filter,tooltip,modifyById,arrayAction,httpServer,objectAction,scrollObj,store,commit) {
//             module.exports = angular.module("app.basicData").controller("bdStoreMgmtCtrl", [ '$scope',function($scope) {

    $scope.listWrh_url = "/wrh/list";
    var url = {
        'showParam_url' : '/param/show' ,
        'saveWrh_url' : '/wrh/save' ,
        'viewWrh_url' : '/wrh/view' ,
        'updateWrh_url' : '/wrh/update' ,
        'activeWrh_url' : '/wrh/enable' ,
        'inactiveWrh_url' : '/wrh/disable'
    };

    var cacheName = {
        'WAREHOUSESTATUS' : 'WAREHOUSESTATUS' ,
        'WAREHOUSETYPE' : 'WAREHOUSETYPE'
    };

    var err = {
        'err_wrh_notSelected' : '请选择列表中一项，再进行操作!' ,
        'err_wrh_selectOne' : '只能选取其中一项，进行操作'
    };

    $scope.pageModelQuery = {};



    var showTitle=['新增仓库','修改仓库'];
    $scope.searchWrhAction = {
        wrhVOModel : new WarehouseVO() , //   仓库查询条件
        _empty_searchWrhModel : new WarehouseVO() ,
        listWrhVO : [] ,      // 分页列表
        currentSelectItems : 9999 ,
        selectedItems : [] ,
        showText:{
            firstTitle:showTitle[0]
    },
        showAddOrModify:false,
        showIndex:true,
        showDetail:false,
        // 初始化
        init : function () {
            $scope.searchWrhAction._empty_searchWrhModel = new WarehouseVO();
            // 初始化查询条件
            $scope.searchWrhAction.wrhVOModel = new WarehouseVO();
        } , // 初始化 end
        // 查询仓库
        search : function () {
            $scope.pageModelQuery = [];
            if ( $scope.searchWrhAction.wrhVOModel.wrhStatusComment != "" ) {
                var listStatus = $scope.getOriginData[cacheName.WAREHOUSESTATUS];
                for ( var i = 0 ; i < listStatus.length ; i++ ) {
                    var s = listStatus[i];
                    if ( s.value == $scope.searchWrhAction.wrhVOModel.wrhStatusComment ) {
                        $scope.searchWrhAction.wrhVOModel.warehouse.warehouseStatus = s.key;
                        break;
                    }
                }
            } else {
                $scope.searchWrhAction.wrhVOModel.warehouse.warehouseStatus = '';
            }
            $scope.pageModelQuery = Object.assign({},$scope.searchWrhAction.wrhVOModel);
        } ,
        // 多选复选框
        selectAll : function () {
            if ( $scope.searchWrhAction.listWrhVO.length>0 ) {
                angular.forEach($scope.searchWrhAction.listWrhVO,function(data,index){
                    if($scope.searchWrhAction.selectedAll){
                        $scope.searchWrhAction.selectedItems[index]=true;
                    }else{
                        $scope.searchWrhAction.selectedItems[index]=false;
                    }
                });
            }
        } , // 多选复选框 end
        reset : function () {
            $scope.searchWrhAction.wrhVOModel = new WarehouseVO();
        } ,
        // 选中单选框
        selectModify:function(index,$event){
            this.currentSelectItems=index;
            //点击进行是否选择操作
            $scope.searchWrhAction.selectedItems[index]=!$scope.searchWrhAction.selectedItems[index];
            // 如果该点击项不是选中状态就将全部选中状态去掉
            $scope.searchWrhAction.selectedAll=false;
            var allCheck = true;
            angular.forEach($scope.searchWrhAction.listWrhVO,function(data,i){
                if(!$scope.searchWrhAction.selectedItems[i]){
                    allCheck = false;
                    // return false;
                } else if ( index != i ) {
                    $scope.searchWrhAction.selectedItems[i] = false;
                }
            });
            if ( allCheck ) {
                $scope.searchWrhAction.selectedAll=true;
            }
        } , // 选中单选框 end
        // 清空单选框
        clearSelect : function () {
            angular.forEach ($scope.searchWrhAction.selectedItems,function( data , i ){
                $scope.searchWrhAction.selectedItems[i] = false;
            }) ;
        } , // 清空单选框
        addOrModify:function(){
            $scope.searchWrhAction.showAddOrModify=true;
            $scope.searchWrhAction.showIndex=false;
        },
        add:function(){ //点击切换新增ASN页面
            $scope.searchWrhAction.showText.firstTitle=showTitle[0];
            $scope.addWrhAction.wrhVOModel = new WarehouseVO();
            $scope.searchWrhAction.addOrModify();
        },
        modify:function(){//点击切换修改ASN页面
            if ( !$scope.searchWrhAction.selectedItems || $scope.searchWrhAction.selectedItems.length == 0 ) {
                tooltip(err.err_wrh_notSelected);
                return ;
            }
            var wrhIds = [];
            for( var i = 0 ; i < $scope.searchWrhAction.selectedItems.length ; i++ ) {
                if ( !$scope.searchWrhAction.selectedItems[i]
                    || $scope.searchWrhAction.selectedItems[i] == false
                    || $scope.searchWrhAction.listWrhVO.length <= i ) {
                    continue;
                }
                var metaWrhVO = $scope.searchWrhAction.listWrhVO[i];
                wrhIds.push(metaWrhVO.warehouse.warehouseId);
            }
            if ( wrhIds.length == 0 ) {
                tooltip(err.err_wrh_notSelected);
                return ;
            } else if ( wrhIds.length > 1 ) {
                tooltip(err.err_wrh_selectOne);
                return;
            }
            httpServer.postData(url.viewWrh_url,wrhIds[0]).then(function(res){
                if ( res != 'error' ) {
                    // 进入修改页面
                    $scope.addWrhAction.wrhVOModel = res;
                    $scope.searchWrhAction.showText.firstTitle=showTitle[1];
                    $scope.searchWrhAction.addOrModify();
                    if ( res.warehouse.warehouseStatus && res.warehouse.warehouseStatus != null ) {
                        $scope.addWrhAction.wrhVOModel.warehouse.warehouseType = res.warehouse.warehouseType.toString();
                    }
                }
            });
            
        },
        backToIndex : function () {
            $scope.searchWrhAction.showDetail=false;
            $scope.searchWrhAction.showAddOrModify=false;
            $scope.searchWrhAction.showIndex=true;
        } ,
        turnShowDetail:function(){
            $scope.searchWrhAction.showDetail=true;
            $scope.searchWrhAction.showIndex=false;
        },
        showDetailActionGetData:function(id){
            this.showDetail=true;
            this.showIndex=false;
        } ,
        searchModel:function(id){
            $('#'+id).modal('show');
        } ,
        active : function () {
            if ( !$scope.searchWrhAction.selectedItems || $scope.searchWrhAction.selectedItems.length == 0 ) {
                tooltip(err.err_wrh_notSelected);
                return ;
            }
            var wrhIds = [];
            for( var i = 0 ; i < $scope.searchWrhAction.selectedItems.length ; i++ ) {
                if ( !$scope.searchWrhAction.selectedItems[i]
                    || $scope.searchWrhAction.selectedItems[i] == false
                    || $scope.searchWrhAction.listWrhVO.length <= i ) {
                    continue;
                }
                var metaWrhVO = $scope.searchWrhAction.listWrhVO[i];
                wrhIds.push(metaWrhVO.warehouse.warehouseId);
            }
            if ( wrhIds.length == 0 ) {
                tooltip(err.err_wrh_notSelected);
                return ;
            } else if ( wrhIds.length > 1 ) {
                tooltip(err.err_wrh_selectOne);
                return;
            }
            httpServer.postData(url.activeWrh_url,wrhIds).then(function(res){
                if ( res != 'error' ) {
                    tooltip("生效成功");
                    $scope.searchWrhAction.clearSelect();
                    $scope.searchWrhAction.search();
                }
            });
        } ,
        inactive : function () {
            if ( !$scope.searchWrhAction.selectedItems || $scope.searchWrhAction.selectedItems.length == 0 ) {
                tooltip(err.err_wrh_notSelected);
                return ;
            }
            var wrhIds = [];
            for( var i = 0 ; i < $scope.searchWrhAction.selectedItems.length ; i++ ) {
                if ( !$scope.searchWrhAction.selectedItems[i]
                    || $scope.searchWrhAction.selectedItems[i] == false
                    || $scope.searchWrhAction.listWrhVO.length <= i ) {
                    continue;
                }
                var metaWrhVO = $scope.searchWrhAction.listWrhVO[i];
                wrhIds.push(metaWrhVO.warehouse.warehouseId);
            }
            if ( wrhIds.length == 0 ) {
                tooltip(err.err_wrh_notSelected);
                return ;
            } else if ( wrhIds.length > 1 ) {
                tooltip(err.err_wrh_selectOne);
                return;
            }
            httpServer.postData(url.inactiveWrh_url,wrhIds).then(function(res){
                if ( res != 'error' ) {
                    tooltip("失效成功");
                    $scope.searchWrhAction.clearSelect();
                    $scope.searchWrhAction.search();

                }
            });
        }
    };

    // 保存仓库
    $scope.addWrhAction = {
        wrhVOModel : new WarehouseVO() , //   提交数据
        save : function () {
            if ( !$scope.addWrhAction.wrhVOModel.warehouse.warehouseId || $scope.addWrhAction.wrhVOModel.warehouse.warehouseId == null || $scope.addWrhAction.wrhVOModel.warehouse.warehouseId == '' ) {
                httpServer.postData(url.saveWrh_url,$scope.addWrhAction.wrhVOModel).then(function(res){
                    if ( res != 'error' ) {
                        tooltip("保存成功");
                    }
                });
            } else {
                // 修改ASN单
                //发送暂存新增id
                httpServer.postData(url.updateWrh_url,$scope.addWrhAction.wrhVOModel).then(function(res){
                    if ( res != 'error' ) {
                        tooltip('更新成功！');
                    }
                });
            }
        } ,
        saveAndBack : function () {
            httpServer.postData(url.saveWrh_url,$scope.addWrhAction.wrhVOModel).then(function(res){
                if ( res != 'error' ) {
                    tooltip("保存成功");
                    $scope.btnAction.backToIndex();
                }
            });
        }
    };


    // 页面请求参数表数据
    httpServer.postData(url.showParam_url,[cacheName.WAREHOUSESTATUS,cacheName.WAREHOUSETYPE]).then(function(res){
        $scope.getOriginData = res;
    });

    // 仓库类
    function Warehouse () {
        this.createTime = null;
        this.updateTime = null;
        this.createPerson = null;
        this.updatePerson = null;
        this.warehouseId = null;
        this.warehouseNo = null;
        this.warehouseName = null;
        this.warehouseType = null;
        this.warehouseStatus = null;
        this.orgId = null;
        this.contactAddress = null;
        this.contactPerson = null;
        this.contactPhone = null;
        this.fax = null;
        this.email = null;
        this.longitude = null;
        this.latitude = null;
        this.note = null;
        this.warehouseId2 = null;
    }

    // 仓库VO
    function WarehouseVO () {
        this.warehouse = new Warehouse();
        this.wrhStatusComment = null;
        this.wrhTypeComment = null;


        // ANDY 后台添加属性***************************************
        this.likeContactPerson = null;
        this.likeContactAddress = null;
        this.likeWrhName = null;
    }


    $scope.btnAction={

    };
}]).name
