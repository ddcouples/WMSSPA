'use strict';
module.exports = angular.module("app.storeMgmt").controller("takeStockCtrl",
		['$scope','tooltip','modifyById','arrayAction','httpServer','commit',
	        function($scope,tooltip,modifyById,arrayAction,httpServer,commit) {
		httpServer.postData('/param/show',['STATUS','COUNT_TYPE']).then(function(res){
		    $scope.getOriginData = res;
		});
    var showTitle=['新增盘点单','修改盘点单','查看盘点单','盘点确认'];
    var url = {
        'add':'/count/add',
        'update':'/count/update',
        'view':'/count/view',
        'saveAndEnable':'/count/saveAndEnable',
        'enable': '/count/enable',
        'disable':'/count/disable',
        'print':'/count/print',
        'confirm':'/count/confirm',
        'listByCount':'/stock/listByCount'
    };
    $scope.pageModelQuery = {};
    //查询 重置按钮设置
    $scope.reqParam={ //个字段的顺序和前端显示顺序要一致 方便下步复用
        "ownerName":"",//货主（模糊）
    	"count":{
            "countType":"1",// 盘点类型
            "countStatus":"",// 盘点单状态
        }
    };
    var _reqParam={
        "ownerName":"",//货主（模糊）
		"count":{
            "countType":"1",// 盘点类型
            "countStatus":"",// 盘点单状态
        }
    };
    $scope.countVo = {
    	"ownerName":"",//货主名称
    	"locationName":"",//库位
    	"skuName":"",//货品
    	"count":{
        	"countType":"1",//盘点类型
        	"countNo":"",//盘点单号
        	"isBlockLocation":0,//是否冻结库位
        	"owner":"",//货主
        	"locationId":"",//库位
        	"skuId":"",//货品
        	"shiftTimes":"",//动碰次数
    	},
    	"listInvCountDetailVO":[]//盘点单明细列表
    };
    $scope._countVo = {//初始化新增时的对象
    	"ownerName":"",//货主名称
    	"locationName":"",//库位
    	"skuName":"",//货品
    	"count":{
        	"countType":"1",//盘点类型
        	"countNo":"",//盘点单号
        	"isBlockLocation":0,//是否冻结库位
        	"owner":"",//货主
        	"locationId":"",//库位
        	"skuId":"",//货品
        	"shiftTimes":"",//动碰次数
    	},
    	"listInvCountDetailVO":[]//盘点单明细列表
    };
    $scope._countVoModify = {//初始化修改时的对象
        	"ownerName":"",//货主名称
        	"locationName":"",//库位
        	"skuName":"",//货品
        	"count":{
            	"countType":"1",//盘点类型
            	"countNo":"",//盘点单号
            	"isBlockLocation":0,//是否冻结库位
            	"owner":"",//货主
            	"locationId":"",//库位
            	"skuId":"",//货品
            	"shiftTimes":"",//动碰次数
        	},
        	"listInvCountDetailVO":[]//盘点单明细列表
        };
    $scope.btnAction={
        showText:{
            firstTitle:showTitle[0]
        },
        showAddOrModify:false,
        showMakeSureGetGoods:false,
        showDetail:false,
        showIndex:true,
        selectedItems : [] , // 列表中选中的ASN单
        selectedAll : false , // 全选按钮默认不选中
        currentSelectItems : 9999 ,
        
        
        gotoList:function(){  //回到列表页
        	$("#deliveryConfirm").modal('hide');
        	angular.copy($scope._countVo,$scope.countVo);
            angular.copy($scope._countVo,$scope._countVoModify);
        	$scope.searchformAction.reset();
        	$scope.searchformAction.search();
            this.showAddOrModify=false;
            this.showMakeSureGetGoods=false;
            this.showDetail=false,
            this.showIndex=true;
            this.selectedItems=[];//page重新更新数据了 所以要重新滞空
            $scope.btnDetailAction.selectedItems=[];//page重新更新数据了 所以要重新滞空
            return;
        },
        //返回按钮
        backToIndex:function(){
            if(!angular.equals($scope._countVoModify,$scope.countVo)){
                $("#deliveryConfirm").modal('show');
            }else{
                $scope.btnAction.gotoList();
            }
        },
        // 多选复选框
        selectAll : function () {
            if ( $scope.searchformAction.countList.length>0 ) {
                angular.forEach($scope.searchformAction.countList,function(data,index){
                    if($scope.btnAction.selectedAll){
                        $scope.btnAction.selectedItems[index]=true;
                    }else{
                        $scope.btnAction.selectedItems[index]=false;
                    }
                });
            }
        } , // 多选复选框 end
        // 选中单选框
        selectModify:function(index,$event){
            this.currentSelectItems=index;
            //点击进行是否选择操作
            $scope.btnAction.selectedItems[index]=!$scope.btnAction.selectedItems[index];
            // 如果该点击项不是选中状态就将全部选中状态去掉
            $scope.btnAction.selectedAll=false;
            var allCheck = true;
            angular.forEach($scope.searchformAction.countList,function(data,index){
                if(!$scope.btnAction.selectedItems[index]){
                    allCheck = false;
                    return false;
                }
            });
            if ( allCheck ) {
                $scope.btnAction.selectedAll=true;
            }
        } , // 选中单选框 end
        
        add:function(){ //点击切换新增页面
            this.showAddOrModify=!this.showAddOrModify;
            this.showIndex=!this.showIndex;
            this.showText.firstTitle=showTitle[0];
            angular.copy($scope._countVo,$scope.countVo);
            angular.copy($scope._countVo,$scope._countVoModify);
        },
        modify:function(){//点击切换修改页面
            //查看选择项是否唯一
            var count=0;
            var id=""; 
            var status="";
            for ( var i = 0 ; i < $scope.btnAction.selectedItems.length ; i++ ) {
                if ( $scope.btnAction.selectedItems[i] == true ) {
                	count++;
                	id=$scope.searchformAction.countList[i].count.countId;
                	status=$scope.searchformAction.countList[i].statusName;
                }
            }
            if (count != 1) {
            	tooltip('请选择一项！');
            	return;
            }
            //查看选择项是否非打开
            if (!angular.equals(status, '打开')) {
            	tooltip('非打开状态，不能修改！');
            	return;
            }
            this.showAddOrModify=!this.showAddOrModify;
            this.showIndex=!this.showIndex;
            this.showText.firstTitle=showTitle[1];
            //查询并绑定数据到countVo
            httpServer.postData(url.view,id).then(function(res){
	            if (res!='error'){
	            	console.log(res);
	            	//此处可自动cp
	                angular.copy(res, $scope.countVo);
	                //需修改盘点类型字段为string，不然前端无法显示
	                $scope.countVo.count.countType = $scope.countVo.count.countType.toString();
	                angular.copy($scope.countVo, $scope._countVoModify);
	            }
	        })
        },
        searchModel:function(id){
            $('#'+id).modal('show');
        },
        showDetailAction:function(id){
            this.showDetail=!this.showDetail;
            this.showIndex=!this.showIndex;
            this.showText.firstTitle=showTitle[2];
            //查询并绑定数据到countVo
            httpServer.postData(url.view,id).then(function(res){
	            if (res!='error'){
	            	console.log(res);
	            	//此处可自动cp
	                angular.copy(res, $scope.countVo);
	            }
	        })
        },
        MakeSureGetGoodsBtn:function(){//点击切换盘点确认
        	//查看选择项是否唯一
            var count=0;
            var id=""; 
            var status="";
            for ( var i = 0 ; i < $scope.btnAction.selectedItems.length ; i++ ) {
                if ( $scope.btnAction.selectedItems[i] == true ) {
                	count++;
                	id=$scope.searchformAction.countList[i].count.countId;
                	status=$scope.searchformAction.countList[i].statusName;
                }
            }
            if (count != 1) {
            	tooltip('请选择一项！');
            	return;
            }
            //查看选择项状态
            if (!angular.equals(status, '生效') && !angular.equals(status, '作业中')) {
            	tooltip('非生效或作业中状态，不能确认！');
            	return;
            }
            this.showMakeSureGetGoods=!this.showMakeSureGetGoods;
            this.showIndex=!this.showIndex;
            this.showText.firstTitle=showTitle[3];
            //查询并绑定数据到countVo
            httpServer.postData(url.view,id).then(function(res){
	            if (res!='error'){
	            	console.log(res);
	            	//此处可自动cp
	                angular.copy(res, $scope.countVo);
	                //单独配置实存为在库数量
	                for (var i=0; i < $scope.countVo.listInvCountDetailVO.length; i++) {
	                	var count = $scope.countVo.listInvCountDetailVO[i].count;
	                	if (count.result == null) {
	                		count.realCountQty = count.storeQty;
	                	}
	                }
	                angular.copy($scope.countVo, $scope._countVoModify);
	            }
	        })
        },
        // 选择货主
        selectOwner:function(){
            commit.commitToParent($scope,'selectMerchantModel',{status:'addCountOwner',isOwner:true});
            var on = commit.listening($scope,'addCountOwner',function(event,data){
                    $scope.countVo.count.owner = data.entity.merchantId;
                    $scope.countVo.ownerName = data.entity.merchantName;
                    on();
            });
        },
        cleanOwner:function(){
        	$scope.countVo.ownerName = '';
        	$scope.countVo.count.owner = '';
        },
        // 选择库位
        selectLocation:function(){
        	commit.commitToParent($scope,'select_wareLocation_searchModel','addCountLocation');
            var on = commit.listening($scope,'addCountLocation',function(event,data){
                //这里可以绑定date
                console.log(data);
                $scope.countVo.locationName=data.location.locationName;
                $scope.countVo.count.locationId=data.location.locationId;
                on();
            });
           $scope.btnAction.searchModel('select_wareLocation_searchModel')
        },
        cleanLocation:function(){
        	$scope.countVo.locationName = '';
        	$scope.countVo.count.locationId = '';
        },
        // 选择货品
        selectGoods:function(){
            commit.commitToParent($scope,'searchGoodsModel','addCountGoods');
            var on = commit.listening($scope,'addCountGoods',function(event,data){
                $scope.countVo.count.skuId = data.entity.skuId;
                $scope.countVo.skuName = data.entity.skuName;
                on();
            });
        },
        cleanGoods:function(){
        	$scope.countVo.skuName = '';
        	$scope.countVo.count.skuId = '';
        },
        saveOrUpdate:function(showTooltip){
        	if (this.checkSaveOrUpdate()){
	        	console.log($scope.countVo);
	        	if (!$scope.countVo.count.countId||$scope.countVo.count.countId=='') {
	        		//进入新增方法
	        		httpServer.postData(url.add,$scope.countVo).then(function(res){
		                console.log(res);
		                if (res!='error'){
		                	if (showTooltip) {
		                		tooltip('暂存成功！');
		                	}
		                    $scope.countVo.count.countNo=res.count.countNo;
		                    $scope.countVo.count.countId=res.count.countId;
		                    angular.copy($scope.countVo,$scope._countVoModify);
		                }
		            })
	        	} else {
	        		//进入修改方法
	        		httpServer.postData(url.update,$scope.countVo).then(function(res){
		                console.log(res);
		                if (res!='error'){
		                	if (showTooltip) {
		                		tooltip('暂存成功！');
		                	}
		                    angular.copy($scope.countVo,$scope._countVoModify);
		                }
		            })
	        	}
        	}
        },
        saveAndEnable:function(){//保存并生效
        	console.log($scope.countVo);
    		httpServer.postData(url.saveAndEnable,$scope.countVo).then(function(res){
                console.log(res);
                if (res!='error'){
                    tooltip('生效成功！');
                    $scope.btnAction.gotoList();
                }
            })
        },
        enable:function(idList){//生效
        	//进入生效方法
    		httpServer.postData(url.enable,idList).then(function(res){
                console.log(res);
                if (res!='error'){
                    tooltip('生效成功！');
                    $scope.btnAction.gotoList();
                }
            })
        },
        enableList:function(){//列表查询中生效
        	var idList = [];
        	for ( var i = 0 ; i < $scope.btnAction.selectedItems.length ; i++ ) {
                if ( $scope.btnAction.selectedItems[i] == true ) {
                	var countVo = $scope.searchformAction.countList[i]
                	if (countVo.statusName != '打开') {
                		tooltip('非打开状态，不能修改');
                		continue;
                	}
                	idList.push(countVo.count.countId);
                }
            }
        	if (idList.length >= 1) {
            	this.enable(idList);
        	} else {
        		tooltip('未选中任何项');
        	}
        },
        disable:function(idList){//失效
        	//进入失效方法
    		httpServer.postData(url.disable,idList).then(function(res){
                console.log(res);
                if (res!='error'){
                    tooltip('失效成功！');
                    $scope.btnAction.gotoList();
                }
            })
        },
        disableList:function(){//列表查询中失效
        	var idList = [];
        	for ( var i = 0 ; i < $scope.btnAction.selectedItems.length ; i++ ) {
                if ( $scope.btnAction.selectedItems[i] == true ) {
                	var countVo = $scope.searchformAction.countList[i]
                	if (countVo.statusName != '生效') {
                		tooltip('非生效状态，不能修改');
                		continue;
                	}
                	idList.push(countVo.count.countId);
                }
            }
        	if (idList.length >= 1) {
            	this.disable(idList);
        	} else {
        		tooltip('未选中任何项');
        	}
        },
        checkSaveOrUpdate:function(){//判断是否必填项未填或格式错误
        	if(angular.equals($scope.countVo.listInvCountDetailVO,[])){
                tooltip('未生成详情数据,请重新查询！');
                return false;
            };
            if ($scope.countVo.count.countType == 3 && (!$scope.countVo.count.locationId||$scope.countVo.count.locationId=='')) {
            	tooltip('未选择库位！');
                return false;
            };
            if ($scope.countVo.count.countType == 2 && (!$scope.countVo.count.skuId||$scope.countVo.count.skuId=='')) {
            	tooltip('未选择货品！');
                return false;
            }
            return true;
        },
        confirm:function(index){//确认
        	//进入确认方法
        	var countDetailVo = $scope.countVo.listInvCountDetailVO[index];
            var confirmVo = {};
            angular.copy($scope.countVo,confirmVo);
            confirmVo.listInvCountDetailVO=[];
            confirmVo.listInvCountDetailVO.push(countDetailVo);
    		httpServer.postData(url.confirm,confirmVo).then(function(res){
                console.log(res);
                if (res!='error'){
                    if (countDetailVo.count.storeQty!=countDetailVo.count.realCountQty) {
                    	countDetailVo.count.result=1;
                    } else {
                    	countDetailVo.count.result=0;
                    }
                }
            })
        },
        confirmAll:function(){//全部确认
        	//进入全部确认方法
//            var confirmVo = {};
//            angular.copy($scope.countVo,confirmVo);
//            for (var int = 0; int < confirmVo.listInvCountDetailVO.length; int++) {
//				if (confirmVo.listInvCountDetailVO.count.result!=null) {
//					confirmVo.listInvCountDetailVO.splice(int, 1);
//					int --;
//				}
//			}
    		httpServer.postData(url.confirm, $scope.countVo).then(function(res){
                console.log(res);
                if (res!='error'){
                    tooltip('确认成功！');
                    $scope.btnAction.gotoList();
                }
            })
        },
    };
    //开始查询页面
    $scope.searchformAction={
        countList:[],
        search:function(){
            //开始查询 即与绑定的page指令的查询端口进行双向数据绑定 数据不同时会自动查询 进入页面时会自动查一次
            var _pageModelQuery={};
            angular.copy($scope.reqParam,_pageModelQuery);
            $scope.pageModelQuery=_pageModelQuery;
            console.log($scope.pageModelQuery)
        },
        reset:function(){
            angular.copy($scope._reqParam,$scope.reqParam);
        }
    };
    //开始新增/修改盘点时查询
    $scope.searchDetailAction={
        search:function(){
        	if ($scope.countVo.count.countType == 3 && (!$scope.countVo.count.locationId||$scope.countVo.count.locationId=='')) {
            	tooltip('未选择库位！');
                return;
            };
            if ($scope.countVo.count.countType == 2 && (!$scope.countVo.count.skuId||$scope.countVo.count.skuId=='')) {
            	tooltip('未选择货品！');
                return;
            }
        	$scope.countVo.listInvCountDetailVO=[],
            httpServer.postData(url.listByCount,$scope.countVo).then(function(res){
	            if (res!='error'){
	            	console.log(res);
//	                angular.copy(res, $scope.countVo.listInvCountDetailVO);
	            	//此处需手动cp
	            	for ( var i = 0 ; i < res.length ; i++ ) {
	            		var stockDetailVo = res[i];
	            		var countDetailVo = {
	            			"skuName":stockDetailVo.skuName,
	            			"skuNo":stockDetailVo.skuNo,
	            			"locationNo":stockDetailVo.locationNo,
	            			"locationName":stockDetailVo.locationName,
	            			"areaName":stockDetailVo.areaName,
            				"specModel":stockDetailVo.specModel,
            				"measureUnit":stockDetailVo.measureUnit,
	            			"count":{
	            				"skuId":stockDetailVo.invStock.skuId,
	            				"locationId":stockDetailVo.invStock.locationId,
	            				"storeQty":stockDetailVo.invStock.stockQty,
	            				"batchNo":stockDetailVo.invStock.batchNo,
	            			}
	            		};
	            		$scope.countVo.listInvCountDetailVO.push(countDetailVo);
	            	}
	            }
	        })
        },
        reset:function(){
            angular.copy($scope._countVo,$scope.countVo);
            $scope.btnDetailAction.currentSelectItems=9999 , // 当前选中的明细项
            $scope.btnDetailAction.selectedItems=[] , // 明细项列表
            $scope.countVo.listInvCountDetailVO=[], //参数列表
            $scope.btnDetailAction.selectedAll=false , //全选
            $scope.btnDetailAction.tooltipIsOpen=false // 是否提示
        },
        clean:function(){
            $scope.btnDetailAction.currentSelectItems=9999 , // 当前选中的明细项
            $scope.btnDetailAction.selectedItems=[] , // 明细项列表
            $scope.countVo.listInvCountDetailVO=[], //参数列表
            $scope.btnDetailAction.selectedAll=false , //全选
            $scope.btnDetailAction.tooltipIsOpen=false // 是否提示
        },
    };
    //详情功能
    $scope.btnDetailAction = {
            tooltipIsOpen : false , // 是否提示
            currentSelectItems : 9999 , // 当前选中的明细项
            selectedItems : [] , // 明细项列表
            selectedAll : false , //全选
            // 全选
            selectAll : function () {
                if ($scope.countVo.listInvCountDetailVO.length>0 ) {
                    angular.forEach($scope.countVo.listInvCountDetailVO,function(data,index){
                        if($scope.btnDetailAction.selectedAll){
                            $scope.btnDetailAction.selectedItems[index]=true;
                        }else{
                            $scope.btnDetailAction.selectedItems[index]=false;
                        }
                    });
                }
            } , // 全选 end
            // 单项选择框
            selectModify : function ($index,$event) {
                this.currentSelectItems=$index;
                //点击进行是否选择操作
                $scope.btnDetailAction.selectedItems[$index]=!$scope.btnDetailAction.selectedItems[$index];
                // 如果该点击项不是选中状态就将全部选中状态去掉
                $scope.btnDetailAction.selectedAll=false;
                var allCheck = true;
                angular.forEach($scope.countVo.listInvCountDetailVO,function(data,index){
                    if(!$scope.btnDetailAction.selectedItems[index]){
                        allCheck = false;
                        return false;
                    }
                });
                if ( allCheck ) {
                    $scope.btnDetailAction.selectedAll=true;
                }
            } , // 单项选择框 end
            // 删除明细
            delDetailList : function () {
                for ( var i = 0 ; i < $scope.btnDetailAction.selectedItems.length ; i++ ) {
                    if ( $scope.btnDetailAction.selectedItems[i] == true ) {
                        $scope.countVo.listInvCountDetailVO.splice(i,1);
                        $scope.btnDetailAction.selectedItems.splice(i--,1);
                    }
                }
            } , // 删除明细 end
        };
}]).name;
/**
 * Created by wangtong on 2017/3/6.
 */
