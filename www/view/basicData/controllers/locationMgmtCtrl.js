/**
 * Created by yangl on 2017/3/10.
 */'use strict';
module.exports = angular.module("app.basicData").controller("locationMgmtCtrl", ['$scope','$filter','tooltip','modifyById','arrayAction', 'httpServer','objectAction','scrollObj','store','commit'
    , function($scope,$filter,tooltip,modifyById,arrayAction,httpServer,objectAction,scrollObj,store,commit) {


    $scope.listLoc_url = "/location/list";
    var url = {
        'showParam_url' : '/param/show' ,
        'saveLoc_url' : '/location/save' ,
        'viewLoc_url' : '/location/view' ,
        'updateLoc_url' : '/location/update' ,
        'activeLoc_url' : '/location/enable' ,
        'inactiveLoc_url' : '/location/disable',
        'showArea_url' : '/area/show',
        'showLocSpec_url' : '/locSpec/show',
    };

    var cacheName = {
        'LOCATIONSTATUS' : 'LOCATIONSTATUS' ,
        'LOCATIONTTYPE' : 'LOCATIONTTYPE'
    };

    var err = {
        'err_loc_notSelected' : '请选择列表中一项，再进行操作!' ,
        'err_loc_selectOne' : '只能选取其中一项，进行操作'
    };

    $scope.pageModelQuery = {};


    // 页面请求参数表数据
    httpServer.postData(url.showParam_url,[cacheName.LOCATIONSTATUS,cacheName.LOCATIONTTYPE]).then(function(res){
        $scope.getOriginData = res;
    });


    httpServer.postData(url.showArea_url,{}).then(function(res){
        $scope.getOriginData.AREALIST = res;
    });
    httpServer.postData(url.showLocSpec_url,{}).then(function(res){
        $scope.getOriginData.LOCSPEC = res;
    });

    var showTitle=['新增库位','修改库位'];
    $scope.searchLocAction={
        voModel : new LocationVO() , //   仓库查询条件
        _empty_searchModel : new LocationVO() ,
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
            $scope.searchLocAction._empty_searchModel = new LocationVO();
            // 初始化查询条件
            $scope.searchLocAction.voModel = new LocationVO();
        } , // 初始化 end
        // 查询仓库
        search : function () {
            $scope.pageModelQuery = [];
            if ( $scope.searchLocAction.voModel.locationStatusComment != "" ) {
                var listStatus = $scope.getOriginData[cacheName.LOCATIONSTATUS];
                for ( var i = 0 ; i < listStatus.length ; i++ ) {
                    var s = listStatus[i];
                    if ( s.value == $scope.searchLocAction.voModel.locationStatusComment ) {
                        $scope.searchLocAction.voModel.location.locationStatus = s.key;
                        break;
                    }
                }
            } else {
                $scope.searchLocAction.voModel.location.locationStatus = '';
            }
            $scope.pageModelQuery = Object.assign({},$scope.searchLocAction.voModel);
        } ,
        // 多选复选框
        selectAll : function () {
            if ( $scope.searchLocAction.listVO.length>0 ) {
                angular.forEach($scope.searchLocAction.listVO,function(data,index){
                    if($scope.searchLocAction.selectedAll){
                        $scope.searchLocAction.selectedItems[index]=true;
                    }else{
                        $scope.searchLocAction.selectedItems[index]=false;
                    }
                });
            }
        } , // 多选复选框 end
        reset : function () {
            $scope.searchLocAction.voModel = new LocationVO();
        } ,
        // 选中单选框
        selectModify:function(index,$event){
            this.currentSelectItems=index;
            //点击进行是否选择操作
            $scope.searchLocAction.selectedItems[index]=!$scope.searchLocAction.selectedItems[index];
            // 如果该点击项不是选中状态就将全部选中状态去掉
            $scope.searchLocAction.selectedAll=false;
            var allCheck = true;
            angular.forEach($scope.searchLocAction.listVO,function(data,i){
                if(!$scope.searchLocAction.selectedItems[i]){
                    allCheck = false;
                    // return false;
                } else if ( index != i ) {
                    $scope.searchLocAction.selectedItems[i] = false;
                }
            });
            if ( allCheck ) {
                $scope.searchLocAction.selectedAll=true;
            }
        } , // 选中单选框 end
        // 清空单选框
        clearSelect : function () {
            angular.forEach ($scope.searchLocAction.selectedItems,function( data , i ){
                $scope.searchLocAction.selectedItems[i] = false;
            }) ;
        } , // 清空单选框
        addOrModify:function(){
            this.showAddOrModify=true;
            this.showIndex=false;
        },
        add:function(){ //点击切换新增ASN页面
            this.showText.firstTitle=showTitle[0];
            this.addOrModify();
            $scope.addLocAction.voModel = new LocationVO();
        },
        modify:function(){//点击切换修改ASN页面

            if ( !$scope.searchLocAction.selectedItems || $scope.searchLocAction.selectedItems.length == 0 ) {
                tooltip(err.err_loc_notSelected);
                return ;
            }
            var locIds = [];
            for( var i = 0 ; i < $scope.searchLocAction.selectedItems.length ; i++ ) {
                if ( !$scope.searchLocAction.selectedItems[i]
                    || $scope.searchLocAction.selectedItems[i] == false
                    || $scope.searchLocAction.listVO.length <= i ) {
                    continue;
                }
                var metaLocationVO = $scope.searchLocAction.listVO[i];
                locIds.push(metaLocationVO.location.locationId);
            }
            if ( locIds.length == 0 ) {
                tooltip(err.err_loc_notSelected);
                return ;
            } else if ( locIds.length > 1 ) {
                tooltip(err.err_loc_selectOne);
                return;
            }
            httpServer.postData(url.viewLoc_url,locIds[0]).then(function(res){
                if ( res != 'error' ) {
                    // 进入修改页面
                    $scope.addLocAction.voModel = res;
                    $scope.searchLocAction.showText.firstTitle=showTitle[1];
                    $scope.searchLocAction.addOrModify();
                    if ( res.location.locationType && res.location.locationType != null ) {
                        $scope.addLocAction.voModel.location.locationType = res.location.locationType.toString();
                    }
                }
            });
        },
        turnShowDetail:function(){
            $scope.searchLocAction.showDetail=!$scope.searchLocAction.showDetail;
            $scope.searchLocAction.showIndex=!$scope.searchLocAction.showIndex;
        },
        showDetailActionGetData:function(id){

            httpServer.postData(url.viewLoc_url,id).then(function(res){
                if ( res != 'error' ) {
                    $scope.searchLocAction.showDetail=true;
                    $scope.searchLocAction.showIndex=false;
                    $scope.viewLocAction.voModel = res;
                }
            });
        },
        searchModel:function(id){
            $('#'+id).modal('show');
        } ,
        backToIndex : function () {
            $scope.searchLocAction.showAddOrModify=false;
            $scope.searchLocAction.showDetail=false;
            $scope.searchLocAction.showIndex=true;
        } ,
        active : function () {
            if ( !$scope.searchLocAction.selectedItems || $scope.searchLocAction.selectedItems.length == 0 ) {
                tooltip(err.err_loc_notSelected);
                return ;
            }
            var locationIds = [];
            for( var i = 0 ; i < $scope.searchLocAction.selectedItems.length ; i++ ) {
                if ( !$scope.searchLocAction.selectedItems[i]
                    || $scope.searchLocAction.selectedItems[i] == false
                    || $scope.searchLocAction.listVO.length <= i ) {
                    continue;
                }
                var metaLocVO = $scope.searchLocAction.listVO[i];
                locationIds.push(metaLocVO.location.locationId);
            }
            if ( locationIds.length == 0 ) {
                tooltip(err.err_loc_notSelected);
                return ;
            } else if ( locationIds.length > 1 ) {
                tooltip(err.err_loc_selectOne);
                return;
            }
            httpServer.postData(url.activeLoc_url,locationIds).then(function(res){
                if ( res != 'error' ) {
                    tooltip("生效成功");
                    $scope.searchLocAction.clearSelect();
                    $scope.searchLocAction.search();
                }
            });
        } ,
        inactive : function () {
            if ( !$scope.searchLocAction.selectedItems || $scope.searchLocAction.selectedItems.length == 0 ) {
                tooltip(err.err_loc_notSelected);
                return ;
            }
            var locationIds = [];
            for( var i = 0 ; i < $scope.searchLocAction.selectedItems.length ; i++ ) {
                if ( !$scope.searchLocAction.selectedItems[i]
                    || $scope.searchLocAction.selectedItems[i] == false
                    || $scope.searchLocAction.listVO.length <= i ) {
                    continue;
                }
                var metaLocVO = $scope.searchLocAction.listVO[i];
                locationIds.push(metaLocVO.location.locationId);
            }
            if ( locationIds.length == 0 ) {
                tooltip(err.err_loc_notSelected);
                return ;
            } else if ( locationIds.length > 1 ) {
                tooltip(err.err_loc_selectOne);
                return;
            }
            httpServer.postData(url.inactiveLoc_url,locationIds).then(function(res){
                if ( res != 'error' ) {
                    tooltip("失效成功");
                    $scope.searchLocAction.clearSelect();
                    $scope.searchLocAction.search();

                }
            });
        } ,
    };


    $scope.viewLocAction = {
        voModel : new LocationVO()
    };

    $scope.addLocAction = {
        voModel : new LocationVO() ,
        save : function () {
            if ( !$scope.addLocAction.voModel.location.locationId || $scope.addLocAction.voModel.location.locationId == '' ) {
                httpServer.postData(url.saveLoc_url,$scope.addLocAction.voModel).then(function(res){
                    if ( res != 'error' ) {
                        tooltip("保存成功");
                        $scope.addLocAction.voModel = new LocationVO();
                    }
                });
            } else {
                httpServer.postData(url.updateLoc_url,$scope.addLocAction.voModel).then(function(res){
                    if ( res != 'error' ) {
                        tooltip("更新成功");
                    }
                });
            }
        } ,
        saveAndBack : function () {
            if ( !$scope.addLocAction.voModel.location.locationId || $scope.addLocAction.voModel.location.locationId == '' ) {
                httpServer.postData(url.saveLoc_url,$scope.addLocAction.voModel).then(function(res){
                    if ( res != 'error' ) {
                        tooltip("保存成功");
                        $scope.addLocAction.voModel = new LocationVO();
                        $scope.searchLocAction.backToIndex();
                    }
                });
            } else {
                httpServer.postData(url.updateLoc_url,$scope.addLocAction.voModel).then(function(res){
                    if ( res != 'error' ) {
                        tooltip("更新成功");
                        $scope.searchLocAction.backToIndex();
                    }
                });
            }
        } ,
        selectOwner : function () {
            commit.commitToParent($scope,'selectMerchantModel',{status:'addLocationActionOwner',isOwner:true});
            var on = commit.listening($scope,'addLocationActionOwner',function(event,data){
                $scope.addLocAction.voModel.location.owner = data.entity.merchantId;
                $scope.addLocAction.voModel.ownerComment = data.entity.merchantName;
                on();
            });
        } ,
        choiceArea : function () {
            angular.forEach($scope.getOriginData.AREALIST,function(data,i){
                var area = $scope.getOriginData.AREALIST[i];
                if ( $scope.addLocAction.voModel.location.areaId ==  area.areaId ) {
                    $scope.addLocAction.voModel.location.locationType = area.areaType;
                }
            });
        } ,
        choiceSpec : function () {
            angular.forEach($scope.getOriginData.LOCSPEC,function(data,i){
                var specVO = $scope.getOriginData.LOCSPEC[i];
                if ( $scope.addLocAction.voModel.location.specId == specVO.locSpec.specId ) {
                    $scope.addLocAction.voModel.location.maxCapacity = specVO.locSpec.maxCapacity;
                    $scope.addLocAction.voModel.location.capacityUseRate = 0;
                }
            });
        }
    };


    function LocationVO () {
        this.location = new Location();
        this.putawayDetail = null;
        this.listLocationId = null;
        this.orderByCapacityDesc = false;
        this.distance = null;
        this.locationStatusComment = null;
        this.areaComment = null;
        this.blockComment = null;
        this.touchTimes = null;
        this.listOwnerId = null;
        this.likeAreaName = null;
        this.likeLocName = null;
        this.likeLocNo = null;
        this.listAreaId = null;
    }


    function Location () {
        this.createTime = null;
        this.updateTime = null;
        this.createPerson = null;
        this.updatePerson = null;
        this.locationId = null;
        this.locationNo = null;
        this.locationName = null;
        this.areaId = null;
        this.warehouseId = null;
        this.orgId = null;
        this.packId = null;
        this.isBlock = null;
        this.locationStatus = null;
        this.maxCapacity = null;
        this.usedCapacity = null;
        this.preusedCapacity = null;
        this.locationZone = null;
        this.locationRow = null;
        this.locationColumn = null;
        this.layer = null;
        this.note = null;
        this.specId = null;
        this.capacityUseRate = null;
        this.x = null;
        this.y = null;
        this.z = null;
        this.owner = null;
        this.isDefault = null;
        this.locationType = null;
    }

}]).name
