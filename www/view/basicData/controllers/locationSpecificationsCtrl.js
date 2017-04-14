
'use strict';
module.exports = angular.module("app.basicData").controller("locationSpecificationsCtrl", ['$scope','$filter','tooltip','modifyById','arrayAction', 'httpServer','objectAction','scrollObj','store','commit'
    , function($scope,$filter,tooltip,modifyById,arrayAction,httpServer,objectAction,scrollObj,store,commit) {



        $scope.listLocSpec_url = "/locSpec/list";
        var url = {
            'showParam_url' : '/param/show' ,
            'saveLocSpec_url' : '/locSpec/save' ,
            'viewLocSpec_url' : '/locSpec/view' ,
            'updateLocSpec_url' : '/locSpec/update' ,
            'activeLocSpec_url' : '/locSpec/enable' ,
            'inactiveLocSpec_url' : '/locSpec/disable'
        };

        var err = {
            'err_locSpec_notSelected' : '请选择列表中一项，再进行操作!' ,
            'err_locSpec_selectOne' : '只能选取其中一项，进行操作'
        };

        $scope.pageModelQuery = {};

    
    
    
    var showTitle=['新增库位规格','修改库位规格'];
    $scope.searchLocSpecAction={
        voModel : new LocationSpecVO() , //   仓库查询条件
        _empty_searchModel : new LocationSpecVO() ,
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
            $scope.searchLocSpecAction._empty_searchModel = new LocationSpecVO();
            // 初始化查询条件
            $scope.searchLocSpecAction.voModel = new LocationSpecVO();
        } , // 初始化 end
        // 查询仓库
        search : function () {
            $scope.pageModelQuery = [];
            $scope.pageModelQuery = Object.assign({},$scope.searchLocSpecAction.voModel);
        } ,
        // 多选复选框
        selectAll : function () {
            if ( $scope.searchLocSpecAction.listVO.length>0 ) {
                angular.forEach($scope.searchLocSpecAction.listVO,function(data,index){
                    if($scope.searchLocSpecAction.selectedAll){
                        $scope.searchLocSpecAction.selectedItems[index]=true;
                    }else{
                        $scope.searchLocSpecAction.selectedItems[index]=false;
                    }
                });
            }
        } , // 多选复选框 end
        reset : function () {
            $scope.searchLocSpecAction.voModel = new LocationSpecVO();
        } ,
        // 选中单选框
        selectModify:function(index,$event){
            this.currentSelectItems=index;
            //点击进行是否选择操作
            $scope.searchLocSpecAction.selectedItems[index]=!$scope.searchLocSpecAction.selectedItems[index];
            // 如果该点击项不是选中状态就将全部选中状态去掉
            $scope.searchLocSpecAction.selectedAll=false;
            var allCheck = true;
            angular.forEach($scope.searchLocSpecAction.listVO,function(data,i){
                if(!$scope.searchLocSpecAction.selectedItems[i]){
                    allCheck = false;
                    // return false;
                } else if ( index != i ) {
                    $scope.searchLocSpecAction.selectedItems[i] = false;
                }
            });
            if ( allCheck ) {
                $scope.searchLocSpecAction.selectedAll=true;
            }
        } , // 选中单选框 end
        // 清空单选框
        clearSelect : function () {
            angular.forEach ($scope.searchLocSpecAction.selectedItems,function( data , i ){
                $scope.searchLocSpecAction.selectedItems[i] = false;
            }) ;
        } , // 清空单选框
        add:function(){ //点击切换新增ASN页面
            this.showAddOrModify=true;
            this.showIndex=false;
        },
        modify:function(){//点击切换修改ASN页面
            if ( !$scope.searchLocSpecAction.selectedItems || $scope.searchLocSpecAction.selectedItems.length == 0 ) {
                tooltip(err.err_locSpec_notSelected);
                return ;
            }
            var locSpecIds = [];
            for( var i = 0 ; i < $scope.searchLocSpecAction.selectedItems.length ; i++ ) {
                if ( !$scope.searchLocSpecAction.selectedItems[i]
                    || $scope.searchLocSpecAction.selectedItems[i] == false
                    || $scope.searchLocSpecAction.listVO.length <= i ) {
                    continue;
                }
                var metaLocSpecVO = $scope.searchLocSpecAction.listVO[i];
                locSpecIds.push(metaLocSpecVO.locSpec.specId);
            }
            if ( locSpecIds.length == 0 ) {
                tooltip(err.err_locSpec_notSelected);
                return ;
            } else if ( locSpecIds.length > 1 ) {
                tooltip(err.err_locSpec_selectOne);
                return;
            }
            httpServer.postData(url.viewLocSpec_url,locSpecIds[0]).then(function(res){
                if ( res != 'error' ) {
                    // 进入修改页面
                    $scope.addLocSpecAction.voModel = res;
                    if ( res.locSpec.specLength != null && res.locSpec.specWeight != null && res.locSpec.specHeight != null ) {
                        $scope.addLocSpecAction.voModel.specVolume = res.locSpec.specLength * res.locSpec.specWeight * res.locSpec.specHeight;
                    } else {
                        $scope.addLocSpecAction.voModel.specVolume = 0;
                    }
                    $scope.searchLocSpecAction.showText.firstTitle=showTitle[1];
                    $scope.searchLocSpecAction.add();
                }
            });
        },
        turnShowDetail:function(){
            this.showDetail=true;
            this.showIndex=false;
        },
        showDetailActionGetData:function(id){
            this.showDetail=true;
            this.showIndex=false;
        },
        searchModel:function(id){
            $('#'+id).modal('show');
        } ,
        backToIndex : function () {
            this.showDetail=false;
            this.showAddOrModify=false;
            this.showIndex=true;
        } ,
        active : function () {
            if ( !$scope.searchLocSpecAction.selectedItems || $scope.searchLocSpecAction.selectedItems.length == 0 ) {
                tooltip(err.err_locSpec_notSelected);
                return ;
            }
            var specIds = [];
            for( var i = 0 ; i < $scope.searchLocSpecAction.selectedItems.length ; i++ ) {
                if ( !$scope.searchLocSpecAction.selectedItems[i]
                    || $scope.searchLocSpecAction.selectedItems[i] == false
                    || $scope.searchLocSpecAction.listVO.length <= i ) {
                    continue;
                }
                var metaLocSpecVO = $scope.searchLocSpecAction.listVO[i];
                specIds.push(metaLocSpecVO.locSpec.specId);
            }
            if ( specIds.length == 0 ) {
                tooltip(err.err_locSpec_notSelected);
                return ;
            } else if ( specIds.length > 1 ) {
                tooltip(err.err_locSpec_selectOne);
                return;
            }
            httpServer.postData(url.activeLocSpec_url,specIds).then(function(res){
                if ( res != 'error' ) {
                    tooltip("生效成功");
                    $scope.searchLocSpecAction.clearSelect();
                    $scope.searchLocSpecAction.search();
                }
            });
        } ,
        inactive : function () {
            if ( !$scope.searchLocSpecAction.selectedItems || $scope.searchLocSpecAction.selectedItems.length == 0 ) {
                tooltip(err.err_locSpec_notSelected);
                return ;
            }
            var specIds = [];
            for( var i = 0 ; i < $scope.searchLocSpecAction.selectedItems.length ; i++ ) {
                if ( !$scope.searchLocSpecAction.selectedItems[i]
                    || $scope.searchLocSpecAction.selectedItems[i] == false
                    || $scope.searchLocSpecAction.listVO.length <= i ) {
                    continue;
                }
                var metaLocSpecVO = $scope.searchLocSpecAction.listVO[i];
                specIds.push(metaLocSpecVO.locSpec.specId);
            }
            if ( specIds.length == 0 ) {
                tooltip(err.err_locSpec_notSelected);
                return ;
            } else if ( specIds.length > 1 ) {
                tooltip(err.err_locSpec_selectOne);
                return;
            }
            httpServer.postData(url.inactiveLocSpec_url,specIds).then(function(res){
                if ( res != 'error' ) {
                    tooltip("失效成功");
                    $scope.searchLocSpecAction.clearSelect();
                    $scope.searchLocSpecAction.search();

                }
            });
        } ,
    };


    $scope.addLocSpecAction = {
        voModel : new LocationSpecVO() , //   仓库查询条件
        save : function () {
            // if ( !$scope.addLocSpecAction.checkout() ) {
            //     $scope.addLocSpecAction.tooltipIsOpen=true;
            //     setTimeout(function(){
            //         $scope.addLocSpecAction.tooltipIsOpen=false;// 消失提示和弹出
            //         $scope.$apply();
            //     },2000);
            //     return;
            // }
            if ( !$scope.addLocSpecAction.voModel.locSpec.specId || $scope.addLocSpecAction.voModel.locSpec.specId == '' ) {
                httpServer.postData(url.saveLocSpec_url,$scope.addLocSpecAction.voModel).then(function(res){
                    if ( res != 'error' ) {
                        tooltip("保存成功");
                        $scope.addLocSpecAction.voModel = new LocationSpecVO();
                    }
                });
            } else {
                httpServer.postData(url.updateLocSpec_url,$scope.addLocSpecAction.voModel).then(function(res){
                    if ( res != 'error' ) {
                        tooltip("更新成功");
                    }
                });
            }
        } ,
        saveAndBack : function () {
            if ( !$scope.addLocSpecAction.voModel.locSpec.specId || $scope.addLocSpecAction.voModel.locSpec.specId == '' ) {
                httpServer.postData(url.saveLocSpec_url,$scope.addLocSpecAction.voModel).then(function(res){
                    if ( res != 'error' ) {
                        tooltip("保存成功");
                        $scope.addLocSpecAction.voModel = new LocationSpecVO();
                        $scope.searchLocSpecAction.backToIndex();
                    }
                });
            } else {
                httpServer.postData(url.updateLocSpec_url,$scope.addLocSpecAction.voModel).then(function(res){
                    if ( res != 'error' ) {
                        tooltip("更新成功");
                        $scope.searchLocSpecAction.backToIndex();
                    }
                });
            }
        } ,
        sumVolume : function () {
            if ( $scope.addLocSpecAction.voModel.locSpec.specLength != null
                    && $scope.addLocSpecAction.voModel.locSpec.specWidth != null
                    && $scope.addLocSpecAction.voModel.locSpec.specHeight != null ) {

                $scope.addLocSpecAction.voModel.specVolume = $scope.addLocSpecAction.voModel.locSpec.specLength
                    * $scope.addLocSpecAction.voModel.locSpec.specWidth * $scope.addLocSpecAction.voModel.locSpec.specHeight;
            } else {
                $scope.addLocSpecAction.voModel.specVolume = 0;
            }
        } , 
        checkout : function () {
            if( $scope.addLocSpecAction.voModel.locSpec.specNo == null || $scope.addLocSpecAction.voModel.locSpec.specNo=='' ){//判断 单据类型是否为空
                scrollObj.scrollTo('select#specNo');
                return false;
            }
            if($scope.addLocSpecAction.voModel.locSpec.specName==''){//判断 单据类型是否为空
                scrollObj.scrollTo('select#specName');
                // $scope.addLocSpecAction.tooltipIsOpen=true;
                // setTimeout(function(){
                //     $scope.addLocSpecAction.tooltipIsOpen=false;// 消失提示和弹出
                //     $scope.$apply();
                // },2000);
                return false;
            }
            if($scope.addLocSpecAction.voModel.locSpec.maxCapacity==''){//判断 单据类型是否为空
                scrollObj.scrollTo('select#maxCapacity');
                // $scope.addLocSpecAction.tooltipIsOpen=true;
                // setTimeout(function(){
                //     $scope.addLocSpecAction.tooltipIsOpen=false;// 消失提示和弹出
                //     $scope.$apply();
                // },2000);
                return false;
            }
            return true;
        }
    };

    function LocationSpecVO () {
        this.locationSpecStatusComment = null;
        this.locSpec = new LocationSpec();
        this.specVolume = null;
    }

    function LocationSpec () {
        this.createTime = null;
        this.updateTime = null;
        this.createPerson = null;
        this.updatePerson = null;
        this.specId = null;
        this.specName = null;
        this.specLength = null;
        this.specWidth = null;
        this.specHeight = null;
        this.specWeight = null;
        this.note = null;
        this.orgId = null;
        this.warehouseId = null;
        this.maxCapacity = null;
        this.specStatus = null;
        this.specNo = null;
    }

}]).name;
/**
 * Created by yangl on 2017/3/6.
 */
