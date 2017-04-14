/**
 * Created by yangl on 2017/2/22.
 */
'use strict';
module.exports = angular.module("app.warehouse").controller("warehouseCtrl",
    ['$state','$scope','commit','objectAction',
        function($state,$scope,commit,objectAction) {

    $scope.getWarehouseId='仓库1';
    //检测路由变化
    $scope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
        // console.log($("input[type='number']"));
    });




            /**
             * 检测调用选择用户弹框
             *
             * */
            //
    //检测调用选择用户弹框
    $scope.select_users_searchStatus='';
    //监听是否调用该弹框
    commit.listening($scope,'select_users_searchModel',function(event,data){
        $scope.select_users_searchStatus=data;//先存放子模块发回来的选择数据类型
        //在公用的model里 出现初始化查询的解决方案 传入 当前$scope 'pageModelQuery'不能变
        // 第三个参数 是通知page进行查询的url地址  变化参数  进行指定那个接口查询
        //如果加入defaultSearch =false  只需要将查询数据 与实体数据进行绑定 即可 调用查询方法用下方
        commit.commitToSon($scope,'pageModelQuery','/user/list');
    });
    $scope.selectedUsersAction={
        //与page绑定的数据对象与查询对象
        selectUsersPageData:{},
        //与前端页面绑定的查询内容的实体
        usersQueryModelEntity:{
          entity:{
                userNo:'',
                userName:'',
                phone:''
            }
        },
        search:function(){
            commit.commitToSon($scope,'pageModelQuery','/user/list');
        },
        selectUser:function(item){
            //把当前子页面要求的数据发回给子页面
            commit.commitToSon($scope,$scope.select_users_searchStatus,item);
            //关闭弹窗
            $('#select_users_searchModel').modal('hide');
        }
    };



   /**
    * 检测调用选择库位
    *
    * */
     //
   $scope.select_wareLocation_searchStatus='';
            //监听是否调用该弹框
    commit.listening($scope,'select_wareLocation_searchModel',function(event,data){
        if ( data.status ) {
            $scope.select_wareLocation_searchStatus=data.status;
            Object.assign($scope.selectedWareLocationAction.WareLocationQueryModelEntity,data);
        } else {
            $scope.select_wareLocation_searchStatus=data;
        }
            //先存放子模块发回来的选择数据类型
                //在公用的model里 出现初始化查询的解决方案 传入 当前$scope 'pageModelQuery'不能变
                // 第三个参数 是通知page进行查询的url地址  变化参数  进行指定那个接口查询
                //如果加入defaultSearch =false  只需要将查询数据 与实体数据进行绑定 即可 调用查询方法用下方
        commit.commitToSon($scope,'pageModelQuery','/location/list');//查询
    });
    $scope.selectedWareLocationAction={
                //与前端页面绑定的查询内容的实体
           WareLocationQueryModelEntity:{
               likeAreaName:'',
               likeLocName:'',
               likeLocNo:'' ,
               nullOwner : null
           },
           search:function(){
                    commit.commitToSon($scope,'pageModelQuery','/location/list');//查询
                },
           selectWareLocation:function(item){
                    //把当前子页面要求的数据发回给子页面
                    commit.commitToSon($scope,$scope.select_wareLocation_searchStatus,item);
                    //关闭弹窗
                    $('#select_wareLocation_searchModel').modal('hide');
             }
    };



    /*
    *
    * 选择货品
    *
    * */
    commit.listening($scope,'searchGoodsModel',function(event,data){
                $scope.selectGoods.status=data;
                //先存放子模块发回来的选择数据类型
                //在公用的model里 出现初始化查询的解决方案 传入 当前$scope 'pageModelQuery'不能变
                // 第三个参数 是通知page进行查询的url地址  变化参数  进行指定那个接口查询
                //如果加入defaultSearch =false  只需要将查询数据 与实体数据进行绑定 即可 调用查询方法用下方
                commit.commitToSon($scope,'pageModelQuery','/sku/list');//查询
    });
    $scope.selectGoods={
        status:'',
        queryParam:{
            "entity":{
                "skuNo":"",
                "skuName":"",
                "measureUnit":""
            }
        },
        search:function(){
            commit.commitToSon($scope,'pageModelQuery','/sku/list');//查询
        },
        select:function(item){
            //把当前子页面要求的数据发回给子页面
            commit.commitToSon($scope,$scope.selectGoods.status,item);
            //关闭弹窗
            $('#searchGoodsModel').modal('hide');
        }
    };


     /*
     * 发货方弹框
     *   客商这边选择发送的数据 需要一个object 一个是status：需要接收的状态   一个是查询的参数 是发货方 还是收货方
     *
     * */

      commit.listening($scope,'selectMerchantModel',function(event,data){
                $scope.selectGoods.status=data.status;
                Object.assign($scope.selectMerchant.queryParam.entity,data);
                 delete  $scope.selectMerchant.queryParam.entity.status;
                //先存放子模块发回来的选择数据类型
                //在公用的model里 出现初始化查询的解决方案 传入 当前$scope 'pageModelQuery'不能变
                // 第三个参数 是通知page进行查询的url地址  变化参数  进行指定那个接口查询
                //如果加入defaultSearch =false  只需要将查询数据 与实体数据进行绑定 即可 调用查询方法用下方
         commit.commitToSon($scope,'pageModelQuery','/merchant/list');//查询
      });
      $scope.selectMerchant={
                status:'',
                queryParam:{
                    "entity":{
                        "merchantNo":"",
                        "merchantName":"",
                        "contactPerson":""
                    }
                },
                search:function(){
                    commit.commitToSon($scope,'pageModelQuery','/merchant/list');//查询
                },
                select:function(item){
                    //把当前子页面要求的数据发回给子页面
                    commit.commitToSon($scope,$scope.selectGoods.status,item);
                    //关闭弹窗
                    $('#selectMerchantModel').modal('hide');
                }
       };

            /*
             * 选库存
             *   客商这边选择发送的数据 需要一个object 一个是status：需要接收的状态   一个是查询的参数 是发货方 还是收货方
             *
             * */
            commit.listening($scope,'inventoryGoodsModal',function(event,data){
                $scope.selectInventory.status=data.status;
                $scope.selectInventory.isShow=data.isShow;
                angular.copy(data.queryParam,$scope.selectInventory.queryParam);
                //先存放子模块发回来的选择数据类型
                //在公用的model里 出现初始化查询的解决方案 传入 当前$scope 'pageModelQuery'不能变
                //第三个参数 是通知page进行查询的url地址  变化参数  进行指定那个接口查询
                //如果加入defaultSearch =false  只需要将查询数据 与实体数据进行绑定 即可 调用查询方法用下方
                commit.commitToSon($scope,'pageModelQuery','/stock/list');//查询
            });
            $scope.selectInventory={
                status:'',
                isShow:true,
                queryParam:{
                    "invStock":{
                        "locationId":"",
                        "skuId":"",
                        "batchNo":""
                    },
                    "locationName":'',
                    "locationNo":'',
                    "skuNo":'',
                    "skuName":''
                },
                search:function(){
                    commit.commitToSon($scope,'pageModelQuery','/stock/list');//查询
                },
                select:function(item){
                    //把当前子页面要求的数据发回给子页面
                    commit.commitToSon($scope,$scope.selectInventory.status,item);
                    //关闭弹窗
                    $('#inventoryGoodsModal').modal('hide');
                }
            };



//             // 库位VO
//             function LocationVO(){
//                 this.location = new Location();         // 库位信息
//                 this.capacity = 0;                      //
//                 this.locationStatusComment = null;      // 库位状态中文描述
//                 this.areaComment = null;                // 库区名称
//                 this.blockComment = null;               // 是否冻结中文描述
//                 this.likeAreaName = null;               // 【模糊查询条件】库区名称（所属库区）
//                 this.likeLocName = null;                // 【模糊查询条件】库位名称
//                 this.likeLocNo = null;                  // 【模糊查询条件】库位代码
//             }
// // 库位类
//             function Location (){
//                 this.locationId = null;                 //  库位id
//                 this.locationNo = null;                 //  库位代码
//                 this.locationName = null;               //  库位名称
//                 this.areaId = null;                     //  库区id
//                 this.warehouseId = null;                //  仓库id
//                 this.orgId = null;                      //  企业id
//                 this.packId = null;                     //  包装id
//                 this.isBlock = null;                    //  是否冻结
//                 this.locationStatus = null;             //  库位状态
//                 this.maxCapacity = null;                //  最大库容
//                 this.usedCapacity = null;               //  使用库容
//                 this.preusedCapacity = null;            //  预分配库容
//                 this.locationZone = null;               //  库位区
//                 this.locationRow = null;                //  库位行
//                 this.locationColumn = null;             //  库位列
//                 this.layer = null;                      //  库位层
//                 this.note = null;                       //  备注
//                 this.specId = null;                     //  库位规格id
//                 this.capacityUseRate = null;            //  库容占比
//                 this.locationType = null;               //  库位类型
//             }

}]).name;
