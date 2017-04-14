/**
 * Created by yangl on 2017/3/10.
 */
'use strict';
module.exports = angular.module("app.basicData").controller("bdReservoirMgmtCtrl", ['$scope','$filter','tooltip','modifyById','arrayAction', 'httpServer','objectAction','scrollObj','store','commit'
    , function($scope,$filter,tooltip,modifyById,arrayAction,httpServer,objectAction,scrollObj,store,commit) {

        $scope.listArea_url = "/area/list";
        var url = {
            'showParam_url' : '/param/show' ,
            'saveArea_url' : '/area/save' ,
            'viewArea_url' : '/area/view' ,
            'updateArea_url' : '/area/update' ,
            'activeArea_url' : '/area/enable' ,
            'inactiveArea_url' : '/area/disable',
            'showWrh_url' : '/wrh/show',
        };

        var cacheName = {
            'AREASTATUS' : 'AREASTATUS' ,
            'AREATYPE' : 'AREATYPE'
        };

        var err = {
            'err_area_notSelected' : '请选择列表中一项，再进行操作!' ,
            'err_area_selectOne' : '只能选取其中一项，进行操作'
        };

        $scope.pageModelQuery = {};

        // 页面请求参数表数据
        httpServer.postData(url.showParam_url,[cacheName.AREASTATUS,cacheName.AREATYPE]).then(function(res){
            $scope.getOriginData = res;
        });


        httpServer.postData(url.showWrh_url,{}).then(function(res){
            $scope.getOriginData.WRHLIST = res;
        });



        var showTitle=['新增库区','修改库区'];
        $scope.searchAreaAction={
            areaVOModel : new AreaVO() , //   仓库查询条件
            _empty_searchModel : new AreaVO() ,
            listAreaVO : [] ,      // 分页列表
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
                $scope.searchAreaAction._empty_searchModel = new AreaVO();
                // 初始化查询条件
                $scope.searchAreaAction.areaVOModel = new AreaVO();
            } , // 初始化 end
            // 查询仓库
            search : function () {
                $scope.pageModelQuery = [];
                if ( $scope.searchAreaAction.areaVOModel.areaStatusComment != "" ) {
                    var listStatus = $scope.getOriginData[cacheName.AREASTATUS];
                    for ( var i = 0 ; i < listStatus.length ; i++ ) {
                        var s = listStatus[i];
                        if ( s.value == $scope.searchAreaAction.areaVOModel.areaStatusComment ) {
                            $scope.searchAreaAction.areaVOModel.area.areaStatus = s.key;
                            break;
                        }
                    }
                } else {
                    $scope.searchAreaAction.areaVOModel.area.areaStatus = '';
                }
                $scope.pageModelQuery = Object.assign({},$scope.searchAreaAction.areaVOModel);
            } ,
            // 多选复选框
            selectAll : function () {
                if ( $scope.searchAreaAction.listAreaVO.length>0 ) {
                    angular.forEach($scope.searchAreaAction.listAreaVO,function(data,index){
                        if($scope.searchAreaAction.selectedAll){
                            $scope.searchAreaAction.selectedItems[index]=true;
                        }else{
                            $scope.searchAreaAction.selectedItems[index]=false;
                        }
                    });
                }
            } , // 多选复选框 end
            reset : function () {
                $scope.searchAreaAction.areaVOModel = new AreaVO();
            } ,
            // 选中单选框
            selectModify:function(index,$event){
                this.currentSelectItems=index;
                //点击进行是否选择操作
                $scope.searchAreaAction.selectedItems[index]=!$scope.searchAreaAction.selectedItems[index];
                // 如果该点击项不是选中状态就将全部选中状态去掉
                $scope.searchAreaAction.selectedAll=false;
                var allCheck = true;
                angular.forEach($scope.searchAreaAction.listAreaVO,function(data,i){
                    if(!$scope.searchAreaAction.selectedItems[i]){
                        allCheck = false;
                        // return false;
                    } else if ( index != i ) {
                        $scope.searchAreaAction.selectedItems[i] = false;
                    }
                });
                if ( allCheck ) {
                    $scope.searchAreaAction.selectedAll=true;
                }
            } , // 选中单选框 end
            // 清空单选框
            clearSelect : function () {
                angular.forEach ($scope.searchAreaAction.selectedItems,function( data , i ){
                    $scope.searchAreaAction.selectedItems[i] = false;
                }) ;
            } , // 清空单选框
            add:function(){ //点击切换新增页面
                $scope.searchAreaAction.showAddOrModify=true;
                $scope.searchAreaAction.showIndex=false;
                $scope.addAreaAction.areaVOModel = new AreaVO();
            },
            modify:function(){//点击切换修改页面
                if ( !$scope.searchAreaAction.selectedItems || $scope.searchAreaAction.selectedItems.length == 0 ) {
                    tooltip(err.err_area_notSelected);
                    return ;
                }
                var areaIds = [];
                for( var i = 0 ; i < $scope.searchAreaAction.selectedItems.length ; i++ ) {
                    if ( !$scope.searchAreaAction.selectedItems[i]
                        || $scope.searchAreaAction.selectedItems[i] == false
                        || $scope.searchAreaAction.listAreaVO.length <= i ) {
                        continue;
                    }
                    var metaAreaVO = $scope.searchAreaAction.listAreaVO[i];
                    areaIds.push(metaAreaVO.area.areaId);
                }
                if ( areaIds.length == 0 ) {
                    tooltip(err.err_area_notSelected);
                    return ;
                } else if ( areaIds.length > 1 ) {
                    tooltip(err.err_area_selectOne);
                    return;
                }
                httpServer.postData(url.viewArea_url,areaIds[0]).then(function(res){
                    if ( res != 'error' ) {
                        // 进入修改页面
                        $scope.addAreaAction.areaVOModel = res;
                        $scope.searchAreaAction.showText.firstTitle=showTitle[1];
                        $scope.searchAreaAction.add();
                        if ( res.area.areaType && res.area.areaType != null ) {
                            $scope.addAreaAction.areaVOModel.area.areaType = res.area.areaType.toString();
                        }
                    }
                });
                
            },
            active : function () {
                if ( !$scope.searchAreaAction.selectedItems || $scope.searchAreaAction.selectedItems.length == 0 ) {
                    tooltip(err.err_area_notSelected);
                    return ;
                }
                var areaIds = [];
                for( var i = 0 ; i < $scope.searchAreaAction.selectedItems.length ; i++ ) {
                    if ( !$scope.searchAreaAction.selectedItems[i]
                        || $scope.searchAreaAction.selectedItems[i] == false
                        || $scope.searchAreaAction.listAreaVO.length <= i ) {
                        continue;
                    }
                    var metaAreaVO = $scope.searchAreaAction.listAreaVO[i];
                    areaIds.push(metaAreaVO.area.areaId);
                }
                if ( areaIds.length == 0 ) {
                    tooltip(err.err_area_notSelected);
                    return ;
                } else if ( areaIds.length > 1 ) {
                    tooltip(err.err_area_selectOne);
                    return;
                }
                httpServer.postData(url.activeArea_url,areaIds).then(function(res){
                    if ( res != 'error' ) {
                        tooltip("生效成功");
                        $scope.searchAreaAction.clearSelect();
                        $scope.searchAreaAction.search();
                    }
                });
            } ,
            inactive : function () {
                if ( !$scope.searchAreaAction.selectedItems || $scope.searchAreaAction.selectedItems.length == 0 ) {
                    tooltip(err.err_area_notSelected);
                    return ;
                }
                var areaIds = [];
                for( var i = 0 ; i < $scope.searchAreaAction.selectedItems.length ; i++ ) {
                    if ( !$scope.searchAreaAction.selectedItems[i]
                        || $scope.searchAreaAction.selectedItems[i] == false
                        || $scope.searchAreaAction.listAreaVO.length <= i ) {
                        continue;
                    }
                    var metaAreaVO = $scope.searchAreaAction.listAreaVO[i];
                    areaIds.push(metaAreaVO.area.areaId);
                }
                if ( areaIds.length == 0 ) {
                    tooltip(err.err_area_notSelected);
                    return ;
                } else if ( areaIds.length > 1 ) {
                    tooltip(err.err_area_selectOne);
                    return;
                }
                httpServer.postData(url.inactiveArea_url,areaIds).then(function(res){
                    if ( res != 'error' ) {
                        tooltip("失效成功");
                        $scope.searchAreaAction.clearSelect();
                        $scope.searchAreaAction.search();

                    }
                });
            } ,
            turnShowDetail:function(){
                $scope.searchAreaAction.showDetail=true;
                $scope.searchAreaAction.showIndex=false;
            },
            showDetailActionGetData:function(id){
                $scope.searchAreaAction.showDetail=true;
                $scope.searchAreaAction.showIndex=false;
            },
            searchModel:function(id){
                $('#'+id).modal('show');
            },
            backToIndex:function(){
                $scope.searchAreaAction.search();
                $scope.searchAreaAction.showAddOrModify=false;
                $scope.searchAreaAction.showDetail=false;
                $scope.searchAreaAction.showIndex=true;
            }
        }


        $scope.addAreaAction = {
            areaVOModel : new AreaVO() , //   仓库查询条件
            save : function () {
                if ( !$scope.addAreaAction.areaVOModel.area.areaId || $scope.addAreaAction.areaVOModel.area.areaId == '' ) {
                    httpServer.postData(url.saveArea_url,$scope.addAreaAction.areaVOModel).then(function(res){
                        if ( res != 'error' ) {
                            tooltip("保存成功");
                        }
                    });
                } else {
                    httpServer.postData(url.updateArea_url,$scope.addAreaAction.areaVOModel).then(function(res){
                        if ( res != 'error' ) {
                            tooltip("更新成功");
                        }
                    });
                }
            } ,
            saveAndBack : function () {
                if ( !$scope.addAreaAction.areaVOModel.area.areaId || $scope.addAreaAction.areaVOModel.area.areaId == '' ) {
                    httpServer.postData(url.saveArea_url,$scope.addAreaAction.areaVOModel).then(function(res){
                        if ( res != 'error' ) {
                            tooltip("保存成功");
                            $scope.addAreaAction.areaVOModel = new AreaVO();
                            $scope.searchAreaAction.backToIndex();
                        }
                    });
                } else {
                    httpServer.postData(url.updateArea_url,$scope.addAreaAction.areaVOModel).then(function(res){
                        if ( res != 'error' ) {
                            tooltip("更新成功");
                            $scope.searchAreaAction.backToIndex();
                        }
                    });
                }
            }
        };


        function AreaVO () {
            this.area = new Area();
            this.listWrhId = null;
            this.areaStatusComment = null;
            this.areaTypeComment = null;
            this.warehouseComment = null;
            this.likeAreaName = null;
        }

        function Area () {
            this.createTime = null;
            this.updateTime = null;
            this.createPerson = null;
            this.updatePerson = null;
            this.areaId = null;
            this.areaNo = null;
            this.areaName = null;
            this.areaType = null;
            this.warehouseId = null;
            this.orgId = null;
            this.maxTemperature = null;
            this.minTemperature = null;
            this.note = null;
            this.areaStatus = null;
        }



    }])
    .name

