'use strict';
module.exports = angular.module("app.storeMgmt")
.controller("inventoryMgmtCtrl", 
		['$scope','tooltip','modifyById','arrayAction','httpServer','commit',
        function($scope,tooltip,modifyById,arrayAction,httpServer,commit) {
	httpServer.postData('/param/show',['SKU_STATUS','ISBLOCK']).then(function(res){
	    $scope.getOriginData = res;
	});
    var showTitle=['库存导入','库存调整','预分配详情'];
    //查询 重置按钮设置
    $scope.file = {};
    $scope.reqParam={ //个字段的顺序和前端显示顺序要一致 方便下步复用
        "ownerName":"",//货主（模糊）
        "locationName":"",//库位名称（模糊）
        "skuNo":"",//货品编号（模糊）
        "containTemp":"true",//包括暂存区
        "onlyTemp":"false",//是否只查暂存区
    	"invStock":{
            "skuStatus":null,// 库存货品状态
            "isBlock":null,// 库存冻结状态
        }
    };
    var _reqParam={
		"ownerName":"",//货主（模糊）
        "locationName":"",//库位名称（模糊）
        "skuNo":"",//货品编号（模糊）
        "containTemp":"true",//包括暂存区
        "onlyTemp":"false",//是否只查暂存区
    	"invStock":{
            "skuStatus":null,// 库存货品状态
            "isBlock":null,// 库存冻结状态
        }
    };
    $scope.pageModelQuery={"invStock":{}};
    $scope.stockDetail={
        "locationName":"",//库位名称，显示
        "inLocationName":"",//库位名称，显示
        "skuName":"",//货品名称，显示
        "skuNo":"",//货品代码，显示
        "specModel":"",//规格型号，显示
        "measureUnit":"",//计量单位，显示
        "findNum":null,//变动后数量，必填
        "freezeType":null,//冻结类型，0-库位 1-货品 3-货品状态
		"invStock":{
	        "stockId":"",//库存id，必填
			"batchNo":"",//变动后批次号，必填
	        "skuStatus":null,//货品状态，显示
	        "stockQty":null,//库存数量
	        "skuId":"",//货品
	        "locationId":""//库位
		},
		"invLog":{
			"note":"",//调整原因，必填
			"opPerson":"",//作业人员
		},
		"outLockDetailList":[]//预分配详情列表
    };
    $scope._stockDetail={
            "locationName":"",//库位名称，显示
            "inLocationName":"",//库位名称，显示
            "skuName":"",//货品名称，显示
            "skuNo":"",//货品代码，显示
            "specModel":"",//规格型号，显示
            "measureUnit":"",//计量单位，显示
            "findNum":null,//变动后数量，必填
            "freezeType":null,//冻结类型，0-库位 1-货品 3-货品状态
    		"invStock":{
    	        "stockId":"",//库存id，必填
    			"batchNo":"",//变动后批次号，必填
    	        "skuStatus":null,//货品状态，显示
    	        "stockQty":null,//库存数量
    	        "skuId":"",//货品
    	        "locationId":""//库位
    		},
    		"invLog":{
    			"note":"",//调整原因，必填
    			"opPerson":"",//作业人员
    		},
    		"outLockDetailList":[]//预分配详情列表
        };
    $scope.stockDetailIn={
		"invStock":{
			"locationId":"",//移位入库库位，移位单必填
			"locationName":""//移位库位名称
		}
    }
    $scope.btnAction={
        showText:{
            firstTitle:showTitle[0]
        },
        showImport:false,
        showStoreAdjustment:false,
        showStoreAdjustmentAdd:false,
        predistribution:false,
        showIndex:true,
        selectedItems : [] , // 列表中选中的ASN单
        selectedAll : false , // 全选按钮默认不选中
        currentSelectItems : 9999 ,
        // 多选复选框
        selectAll : function () {
            if ( $scope.searchformAction.stockList.length>0 ) {
                angular.forEach($scope.searchformAction.stockList,function(data,index){
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
            angular.forEach($scope.searchformAction.stockList,function(data,index){
                if(!$scope.btnAction.selectedItems[index]){
                    allCheck = false;
                    return false;
                }
            });
            if ( allCheck ) {
                $scope.btnAction.selectedAll=true;
            }
        } , // 选中单选框 end
        gotoList:function(){  //回到列表页
        	$scope.searchformAction.reset();
        	$scope.searchformAction.search();
            this.showImport=false;
            this.showStoreAdjustment=false;
            this.showStoreAdjustmentAdd=false;
            this.predistribution=false;
            this.showIndex=true;
            this.selectedItems=[];
            return;
        },
        showImportAction:function(){ //点击切换库存导入页面
            this.showImport=!this.showImport;
            this.showIndex=!this.showIndex;
            this.showText.firstTitle=showTitle[0];
        },
        showStoreAdjustmentAction:function(){//点击切换快速调整页面
        	//查看选择项是否唯一
            var count=0;
            for ( var i = 0 ; i < $scope.btnAction.selectedItems.length ; i++ ) {
                if ( $scope.btnAction.selectedItems[i] == true ) {
                	count++;
                }
            }
            if (count > 1) {
            	tooltip('最多选择一项！');
            	return;
            } else if (count == 0) {
            	//库存新增
                this.showStoreAdjustmentAdd=!this.showStoreAdjustmentAdd;
                this.showIndex=!this.showIndex;
                angular.copy($scope._stockDetail,$scope.stockDetail);
            } else {
            	var item = {};
	        	angular.copy($scope.searchformAction.stockList[this.currentSelectItems],item);        	
	        	$scope.stockDetail={
	    			"locationName":item.locationName,//库位名称，显示
	    	        "skuName":item.skuName,//货品名称，显示
	    	        "specModel":item.specModel,//规格型号，显示
	    	        "measureUnit":item.measureUnit,//计量单位，显示
	    	        "findNum":item.invStock.stockQty,//变动后数量，必填
	    			"invStock":{
	        	        "stockQty":item.invStock.stockQty,//原始数量，显示
	    		        "stockId":item.invStock.stockId,//库存id，必填
	    				"batchNo":item.invStock.batchNo//变动后批次号，必填
	    			},
	    			"invLog":{
	    				"note":""//调整原因，必填
	    			}
	        	};
	        	console.log($scope.stockDetail);
	            this.showStoreAdjustment=!this.showStoreAdjustment;
	            this.showIndex=!this.showIndex;
	            this.showText.firstTitle=showTitle[1];
            }
        },
        shift:function(){//点击开始快速移位
        	if(!$scope.stockDetail.invStock.stockId){
                tooltip('调用失败，未选择库存！');
                return;
            }
        	if(!$scope.stockDetail.inLocationName){//判断入库库位是否为空
        		tooltip('入库库位不能为空！');
                return;
            }
        	if(!$scope.stockDetail.invLog.opPerson){//判断作业人员是否为空
        		tooltip('作业人员不能为空！');
                return;
            }
        	if(!$scope.stockDetail.findNum){//判断数量是否为空
        		tooltip('数量不能为空！');
                return;
            }
        	httpServer.postData('/stock/shift',$scope.stockDetail).then(function(res){
                console.log(res);
                if (res!='error'){
                    tooltip('保存成功！');
                    $scope.btnAction.gotoList();//重新进入列表页
                }
            })
        },
        freeze:function(selectfrozenIndex){//点击开始冻结库存
        	$scope.stockDetail.freezeType=parseInt(selectfrozenIndex);
        	if(selectfrozenIndex == 0){
        		if (!$scope.stockDetail.locationName) {
                    tooltip('调用失败，未输入库位！');
                    return;
        		}
            } else if(selectfrozenIndex == 1) {
            	if (!$scope.stockDetail.invStock.skuId) {
                    tooltip('调用失败，未选择货品！');
                    return;
        		}
            } else if(selectfrozenIndex == 2) {
            	if (!$scope.stockDetail.invStock.skuStatus) {
                    tooltip('调用失败，未选择货品状态！');
                    return;
        		}
            }
        	httpServer.postData('/stock/freeze',$scope.stockDetail).then(function(res){
                console.log(res);
                if (res!='error'){
                    tooltip('保存成功！');
                    $scope.btnAction.gotoList();//重新进入列表页
                }
            })
        },
        unfreeze:function(selectfrozenIndex){//点击开始冻结库存
        	$scope.stockDetail.freezeType=parseInt(selectfrozenIndex);
        	if(selectfrozenIndex == 0){
        		if (!$scope.stockDetail.locationName) {
                    tooltip('调用失败，未输入库位！');
                    return;
        		}
            } else if(selectfrozenIndex == 1) {
            	if (!$scope.stockDetail.invStock.skuId) {
                    tooltip('调用失败，未选择货品！');
                    return;
        		}
            } else if(selectfrozenIndex == 2) {
            	if (!$scope.stockDetail.invStock.skuStatus) {
                    tooltip('调用失败，未选择货品状态！');
                    return;
        		}
            }
        	console.log($scope.stockDetail);
        	httpServer.postData('/stock/unfreeze',$scope.stockDetail).then(function(res){
                console.log(res);
                if (res!='error'){
                    tooltip('保存成功！');
                    $scope.btnAction.gotoList();//重新进入列表页
                }
            })
        },
        changeStockAction:function(){//点击开始库存调整
        	if(!$scope.stockDetail.invStock.stockId){
        		if ($scope.btnAction.showStoreAdjustment) {
	                tooltip('调用失败，未选择库存！');
	                return;
        		}
            }
        	if(!$scope.stockDetail.invLog.note){//判断说明是否为空
        		tooltip('说明不能为空！');
                return;
            }
        	if(!$scope.stockDetail.invStock.batchNo){//判断说明是否为空
        		tooltip('批次不能为空！');
                return;
            }
        	if(!$scope.stockDetail.findNum){//判断说明是否为空
        		tooltip('调整数量不能为空！');
                return;
            }
        	httpServer.postData('/stock/changeStock',$scope.stockDetail).then(function(res){
                console.log(res);
                if (res!='error'){
                    tooltip('保存成功！');
                    $scope.btnAction.gotoList();//重新进入列表页
                }
            })
        },
        searchModel:function(id){
        	//查看选择项是否唯一
            var count=0;
            for ( var i = 0 ; i < $scope.btnAction.selectedItems.length ; i++ ) {
                if ( $scope.btnAction.selectedItems[i] == true ) {
                	count++;
                }
            }
            if(id == 'shiftModal'){
                if (count != 1) {
                	tooltip('请选择一项！');
                	return;
                }
            }
            $('#'+id).modal('show');
            if (count==1) {
            	var item = {};
	        	angular.copy($scope.searchformAction.stockList[this.currentSelectItems],item);        	
	        	$scope.stockDetail={
	    			"locationName":item.locationName,//库位名称，显示
	    	        "skuName":item.skuName,//货品名称，显示
	    	        "specModel":item.specModel,//规格型号，显示
	    	        "measureUnit":item.measureUnit,//计量单位，显示
	    	        "findNum":item.invStock.stockQty,//变动后数量，必填
	    			"invStock":{
	        	        "stockQty":item.invStock.stockQty,//原始数量，显示
	    		        "stockId":item.invStock.stockId,//库存id，必填
	    				"batchNo":item.invStock.batchNo,//变动后批次号，库存调整必填
		    	        "skuId":item.invStock.skuId,//货品id
		    	        "skuStatus":item.invStock.skuStatus//货品状态
	    			},
	    			"invLog":{
	    				"note":"",//调整原因，必填
    					"opPerson":""//移位作业人员，移位单必填
	    			}
	        	};
            }
        },
        predistributionBtn:function(){//点击切换预分配详情
        	//查看选择项是否唯一
        	var count=0;
            var id=""; 
            for ( var i = 0 ; i < $scope.btnAction.selectedItems.length ; i++ ) {
                if ( $scope.btnAction.selectedItems[i] == true ) {
                	count++;
                	id=$scope.searchformAction.stockList[i].invStock.stockId;
                }
            }
            if (count != 1) {
            	tooltip('请选择一项！');
            	return;
            }
        	var item = {};
        	angular.copy($scope.searchformAction.stockList[$scope.btnAction.currentSelectItems],item);        	
        	$scope.stockDetail={
    			"locationName":item.locationName,//库位名称，显示
    			"ownerName":item.ownerName,//货主名称，显示
    	        "skuName":item.skuName,//货品名称，显示
    	        "skuNo":item.skuNo,//货品代码，显示
    	        "specModel":item.specModel,//规格型号，显示
    	        "measureUnit":item.measureUnit,//计量单位，显示
    	        "findNum":item.invStock.stockQty,//变动后数量，必填
    			"invStock":{
        	        "stockQty":item.invStock.stockQty,//原始数量，显示
        	        "pickQty":item.invStock.pickQty,//拣选数量，显示
    		        "stockId":item.invStock.stockId,//库存id，必填
    				"batchNo":item.invStock.batchNo//变动后批次号，必填
    			}
        	};
        	httpServer.postData('/stock/outLockDetail',id).then(function(res){
                console.log(res);
                if (res!='error'){
                    $scope.stockDetail.outLockDetailList=res.outLockDetailList;//数据绑定
                }
            })
            this.predistribution=!this.predistribution;
            this.showIndex=!this.showIndex;
            this.showText.firstTitle=showTitle[2];
            $scope.searchformAction.stockList=[];
        },
        recalculationBtn:function(id){//点击进行预分配重算
        	console.log("id="+id);
        	if (!id || id == null || id == '') {//从列表中点击重算时，不用传id，但需要校验是否只选了一项
        		//查看选择项是否唯一
                var count=0;
                for ( var i = 0 ; i < $scope.btnAction.selectedItems.length ; i++ ) {
                    if ( $scope.btnAction.selectedItems[i] == true ) {
                    	count++;
                    	id=$scope.searchformAction.stockList[i].invStock.stockId;
                    }
                }
                if (count != 1) {
                	tooltip('请选择一项！');
                	return;
                }
                httpServer.postData('/stock/refreshOutLock',id).then(function(res){
                    console.log(res);
                    if (res!='error'){
                        tooltip('重算成功！');
                        $scope.btnAction.gotoList();//重新进入列表页
                    }
                })
        	} else {
	        	httpServer.postData('/stock/refreshOutLock',id).then(function(res){
	                console.log(res);
	                if (res!='error'){
	                    tooltip('重算成功！');
	                    if (res == 'ok') {
	                    	$scope.stockDetail.invStock.pickQty=0;
	                    } else {
	                    	$scope.stockDetail.invStock.pickQty=res;
	                    }
	                }
	            })
        	}
        },
        frozenIndex:0,
        // 选择货品
        selectGoods:function(){
            commit.commitToParent($scope,'searchGoodsModel','addStockGoods');
            var on = commit.listening($scope,'addStockGoods',function(event,data){
                $scope.stockDetail.invStock.skuId = data.entity.skuId;
                $scope.stockDetail.skuName = data.entity.skuName;
                $scope.stockDetail.skuNo = data.entity.skuNo;
                on();
            });
        },
        //选择库位
        selectLocation:function(){
            commit.commitToParent($scope,'select_wareLocation_searchModel','addStockLocation');
            var on = commit.listening($scope,'addStockLocation',function(event,data){
                 //这里可以绑定date
            	$scope.stockDetail.invStock.locationId = data.location.locationId;
                $scope.stockDetail.locationName = data.location.locationName;
                on();
             });
         }
    };
    
    //开始查询页面
    $scope.searchformAction={
    	stockList:[],
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
}]).name;
/**
 * Created by wangtong on 2017/3/27.
 */
