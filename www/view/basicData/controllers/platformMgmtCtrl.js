/**
 * Created by yangl on 2017/3/10.
 */'use strict';
module.exports = angular.module("app.basicData").controller("platformMgmtCtrl", ['$scope','$filter','tooltip','modifyById','arrayAction', 'httpServer','objectAction','scrollObj','store','commit'
    , function($scope,$filter,tooltip,modifyById,arrayAction,httpServer,objectAction,scrollObj,store,commit) {

    $scope.listDock_url = "/dock/list";
    var url = {
        'showParam_url' : '/param/show' ,
        'saveDock_url' : '/dock/save' ,
        'viewDock_url' : '/dock/view' ,
        'updateDock_url' : '/dock/update' ,
        'activeDock_url' : '/dock/enable' ,
        'inactiveDock_url' : '/dock/disable',
        'showArea_url' : '/area/show'
    };

    var cacheName = {
        'DOCKSTATUS' : 'DOCKSTATUS'
    };

    var err = {
        'err_dock_notSelected' : '请选择列表中一项，再进行操作!' ,
        'err_dock_selectOne' : '只能选取其中一项，进行操作'
    };

    $scope.pageModelQuery = {};


    // 页面请求参数表数据
    httpServer.postData(url.showParam_url,[cacheName.DOCKSTATUS]).then(function(res){
        $scope.getOriginData = res;
    });
    httpServer.postData(url.showArea_url,{}).then(function(res){
        $scope.getOriginData.AREALIST = res;
    });

    var showTitle=['新增月台','修改月台'];
    $scope.searchDockAction={
        voModel : new DockVO() , //   仓库查询条件
        _empty_searchModel : new DockVO() ,
        listVO : [] ,      // 分页列表
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
            $scope.searchDockAction._empty_searchModel = new DockVO();
            // 初始化查询条件
            $scope.searchDockAction.voModel = new DockVO();
        } , // 初始化 end
        // 查询仓库
        search : function () {
            $scope.pageModelQuery = [];
            if ( $scope.searchDockAction.voModel.dockStatusComment != "" ) {
                var listStatus = $scope.getOriginData[cacheName.DOCKSTATUS];
                for ( var i = 0 ; i < listStatus.length ; i++ ) {
                    var s = listStatus[i];
                    if ( s.value == $scope.searchDockAction.voModel.dockStatusComment ) {
                        $scope.searchDockAction.voModel.dock.dockStatus = s.key;
                        break;
                    }
                }
            } else {
                $scope.searchDockAction.voModel.dock.dockStatus = '';
            }
            $scope.pageModelQuery = Object.assign({},$scope.searchDockAction.voModel);
        } ,
        // 多选复选框
        selectAll : function () {
            if ( $scope.searchDockAction.listVO.length>0 ) {
                angular.forEach($scope.searchDockAction.listVO,function(data,index){
                    if($scope.searchDockAction.selectedAll){
                        $scope.searchDockAction.selectedItems[index]=true;
                    }else{
                        $scope.searchDockAction.selectedItems[index]=false;
                    }
                });
            }
        } , // 多选复选框 end
        reset : function () {
            $scope.searchDockAction.voModel = new DockVO();
        } ,
        // 选中单选框
        selectModify:function(index,$event){
            this.currentSelectItems=index;
            //点击进行是否选择操作
            $scope.searchDockAction.selectedItems[index]=!$scope.searchDockAction.selectedItems[index];
            // 如果该点击项不是选中状态就将全部选中状态去掉
            $scope.searchDockAction.selectedAll=false;
            var allCheck = true;
            angular.forEach($scope.searchDockAction.listVO,function(data,i){
                if(!$scope.searchDockAction.selectedItems[i]){
                    allCheck = false;
                    // return false;
                } else if ( index != i ) {
                    $scope.searchDockAction.selectedItems[i] = false;
                }
            });
            if ( allCheck ) {
                $scope.searchDockAction.selectedAll=true;
            }
        } , // 选中单选框 end
        // 清空单选框
        clearSelect : function () {
            angular.forEach ($scope.searchDockAction.selectedItems,function( data , i ){
                $scope.searchDockAction.selectedItems[i] = false;
            }) ;
        } , // 清空单选框
        add:function(){ //点击切换新增ASN页面
            this.showAddOrModify=true;
            this.showIndex=false;
        },
        modify:function(){//点击切换修改ASN页面
            if ( !$scope.searchDockAction.selectedItems || $scope.searchDockAction.selectedItems.length == 0 ) {
                tooltip(err.err_dock_notSelected);
                return ;
            }
            var dockIds = [];
            for( var i = 0 ; i < $scope.searchDockAction.selectedItems.length ; i++ ) {
                if ( !$scope.searchDockAction.selectedItems[i]
                    || $scope.searchDockAction.selectedItems[i] == false
                    || $scope.searchDockAction.listVO.length <= i ) {
                    continue;
                }
                var metaDockVO = $scope.searchDockAction.listVO[i];
                dockIds.push(metaDockVO.dock.dockId);
            }
            if ( dockIds.length == 0 ) {
                tooltip(err.err_dock_notSelected);
                return ;
            } else if ( dockIds.length > 1 ) {
                tooltip(err.err_dock_selectOne);
                return;
            }
            httpServer.postData(url.viewDock_url,dockIds[0]).then(function(res){
                if ( res != 'error' ) {
                    // 进入修改页面
                    $scope.addDockAction.voModel = res;
                    $scope.searchDockAction.showText.firstTitle=showTitle[1];
                    $scope.searchDockAction.add();
                    $scope.addDockAction.voModel.isOutComment = $scope.addDockAction.voModel.dock.isOut==1;
                    $scope.addDockAction.voModel.isInComment = $scope.addDockAction.voModel.dock.isIn==1;
                }
            });
        },
        searchModel:function(id){
            $('#'+id).modal('show');
        } ,
        backToIndex : function () {
            this.showAddOrModify=false;
            this.showIndex=true;
        } ,
        active : function () {
            if ( !$scope.searchDockAction.selectedItems || $scope.searchDockAction.selectedItems.length == 0 ) {
                tooltip(err.err_dock_notSelected);
                return ;
            }
            var dockIds = [];
            for( var i = 0 ; i < $scope.searchDockAction.selectedItems.length ; i++ ) {
                if ( !$scope.searchDockAction.selectedItems[i]
                    || $scope.searchDockAction.selectedItems[i] == false
                    || $scope.searchDockAction.listVO.length <= i ) {
                    continue;
                }
                var metaDockVO = $scope.searchDockAction.listVO[i];
                dockIds.push(metaDockVO.dock.dockId);
            }
            if ( dockIds.length == 0 ) {
                tooltip(err.err_dock_notSelected);
                return ;
            } else if ( dockIds.length > 1 ) {
                tooltip(err.err_dock_selectOne);
                return;
            }
            httpServer.postData(url.activeDock_url,dockIds).then(function(res){
                if ( res != 'error' ) {
                    tooltip("生效成功");
                    $scope.searchDockAction.clearSelect();
                    $scope.searchDockAction.search();
                }
            });
        } ,
        inactive : function () {
            if ( !$scope.searchDockAction.selectedItems || $scope.searchDockAction.selectedItems.length == 0 ) {
                tooltip(err.err_dock_notSelected);
                return ;
            }
            var dockIds = [];
            for( var i = 0 ; i < $scope.searchDockAction.selectedItems.length ; i++ ) {
                if ( !$scope.searchDockAction.selectedItems[i]
                    || $scope.searchDockAction.selectedItems[i] == false
                    || $scope.searchDockAction.listVO.length <= i ) {
                    continue;
                }
                var metaDockVO = $scope.searchDockAction.listVO[i];
                dockIds.push(metaDockVO.dock.dockId);
            }
            if ( dockIds.length == 0 ) {
                tooltip(err.err_dock_notSelected);
                return ;
            } else if ( dockIds.length > 1 ) {
                tooltip(err.err_dock_selectOne);
                return;
            }
            httpServer.postData(url.inactiveDock_url,dockIds).then(function(res){
                if ( res != 'error' ) {
                    tooltip("失效成功");
                    $scope.searchDockAction.clearSelect();
                    $scope.searchDockAction.search();

                }
            });
        } ,
    };

    $scope.addDockAction = {
        voModel : new DockVO() ,
        save : function () {
            $scope.addDockAction.voModel.dock.isOut = $scope.addDockAction.voModel.isOutComment==true?1:0;
            $scope.addDockAction.voModel.dock.isIn = $scope.addDockAction.voModel.isInComment==true?1:0;
            if ( !$scope.addDockAction.voModel.dock.dockId || $scope.addDockAction.voModel.dock.dockId == '' ) {
                httpServer.postData(url.saveDock_url,$scope.addDockAction.voModel).then(function(res){
                    if ( res != 'error' ) {
                        tooltip("保存成功");
                        $scope.addDockAction.voModel = new DockVO();
                        $scope.searchDockAction.backToIndex();
                    }
                });
            } else {
                httpServer.postData(url.updateDock_url,$scope.addDockAction.voModel).then(function(res){
                    if ( res != 'error' ) {
                        tooltip("更新成功");
                        $scope.searchDockAction.backToIndex();
                    }
                });
            }
        } ,
        saveAndBack : function () {
            $scope.addDockAction.voModel.dock.isOut = $scope.addDockAction.voModel.isOutComment==true?1:0;
            $scope.addDockAction.voModel.dock.isIn = $scope.addDockAction.voModel.isInComment==true?1:0;
            if ( !$scope.addDockAction.voModel.dock.dockId || $scope.addDockAction.voModel.dock.dockId == '' ) {
                httpServer.postData(url.saveDock_url,$scope.addDockAction.voModel).then(function(res){
                    if ( res != 'error' ) {
                        tooltip("保存成功");
                        $scope.addDockAction.voModel = new DockVO();
                        $scope.searchDockAction.backToIndex();
                    }
                });
            } else {
                httpServer.postData(url.updateDock_url,$scope.addDockAction.voModel).then(function(res){
                    if ( res != 'error' ) {
                        tooltip("更新成功");
                        $scope.searchDockAction.backToIndex();
                    }
                });
            }
        } ,
    };

    function DockVO () {
        this.dock = new Dock();
        this.dockStatusComment = null;
        this.areaComment = null;
        this.isReceiveComment = null;
        this.isSendComment = null;
    }

    function Dock () {
        this.createTime = null;
        this.updateTime = null;
        this.createPerson = null;
        this.updatePerson = null;
        this.dockId = null;
        this.dockNo = null;
        this.dockName = null;
        this.areaId = null;
        this.orgId = null;
        this.warehouseId = null;
        this.isIn = null;
        this.isOut = null;
        this.dockStatus = null;
    }

}]).name
