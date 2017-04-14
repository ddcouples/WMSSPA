'use strict';
module.exports = angular.module("app.storeMgmt")
.controller("gressionCtrl", 
		['$scope','tooltip','modifyById','arrayAction','httpServer','commit',
	        function($scope,tooltip,modifyById,arrayAction,httpServer,commit) {
		httpServer.postData('/param/show',['STATUS','SHIFT_TYPE']).then(function(res){
		    $scope.getOriginData = res;
		});
    var showTitle=['新增移位单','修改移位单'];
    var url = {
        'add':'/shift/add',
        'update':'/shift/update',
        'view':'/shift/view',
        'saveAndEnable':'/shift/saveAndEnable',
        'enable': '/shift/enable',
        'disable':'/shift/disable',
        'print':'/shift/print',
        'confirm':'/shift/confirm'
    };
    $scope.pageModelQuery={};
    $scope.reqParam={ //个字段的顺序和前端显示顺序要一致 方便下步复用
        "inlocationName":"",//入库位名称（模糊）
        "outlocationName":"",//出库位名称（模糊）
    	"shift":{
            "shiftStatus":null,// 移位单货品状态
        }
    };
    var _reqParam={
		"inlocationName":"",//入库位名称（模糊）
	    "outlocationName":"",//出库位名称（模糊）
		"shift":{
	        "shiftStatus":null,// 移位单货品状态
	    }
	};
    $scope.shiftDetailVo = {
    	"outLocation":"",//移出库位
    	"inLocation":"",//移入库位
    	"skuName":"",//货品名称
    	"skuNo":"",//货品代码
    	"shift":{
        	"shiftId":"",//移位单主单id
        	"shiftDetailId":"",//移位单详情id
        }
    };
    $scope.shiftVo = {
    	"shiftStatusName":"",//状态
    	"shiftTypeName":"",//移位类型名称
    	"createUserName":"",//创建人姓名
    	"opPersonName":"",//作业人姓名
    	"shift":{
        	"shiftType":"10",//移位类型
    	},
    	"listInvShiftDetailVO":[]//移位单明细列表
    };
    $scope._shiftVo = {
    	"shiftStatusName":"",//状态
    	"shiftTypeName":"",//移位类型名称
    	"createUserName":"",//创建人姓名
    	"opPersonName":"",//作业人姓名
    	"shift":{
        	"shiftType":"10",//移位类型
    	},
    	"listInvShiftDetailVO":[]//移位单明细列表
    };
    $scope._shiftVoModify = {
    	"shiftStatusName":"",//状态
    	"shiftTypeName":"",//移位类型名称
    	"createUserName":"",//创建人姓名
    	"opPersonName":"",//作业人姓名
    	"shift":{
        	"shiftType":"10",//移位类型
    	},
    	"listInvShiftDetailVO":[]//移位单明细列表
    };
    $scope.btnAction={
		showText:{
            firstTitle:showTitle[0]
        },
        showAddOrModify:false,
        showConfirm:false,
        showDetail:false,
        showIndex:true,
        selectedItems : [] , // 列表中选中的ASN单
        selectedAll : false , // 全选按钮默认不选中
        currentSelectItems : 9999 ,
        
        
        gotoList:function(){  //回到列表页
        	$("#deliveryConfirm").modal('hide');
        	angular.copy($scope._shiftVo,$scope.shiftVo);
            angular.copy($scope._shiftVo,$scope._shiftVoModify);
        	$scope.searchformAction.reset();
        	$scope.searchformAction.search();
            this.showAddOrModify=false;
            this.showConfirm=false;
            this.showDetail=false,
            this.showIndex=true;
            this.selectedItems=[];//page重新更新数据了 所以要重新滞空
            $scope.btnDetailAction.selectedItems=[];//page重新更新数据了 所以要重新滞空
            return;
        },
        //返回按钮
        backToIndex:function(){
            if(!angular.equals($scope._shiftVoModify,$scope.shiftVo)){
                $("#deliveryConfirm").modal('show');
            }else{
                $scope.btnAction.gotoList();
            }
        },
        // 多选复选框
        selectAll : function () {
            if ( $scope.searchformAction.shiftList.length>0 ) {
                angular.forEach($scope.searchformAction.shiftList,function(data,index){
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
            angular.forEach($scope.searchformAction.shiftList,function(data,index){
                if(!$scope.btnAction.selectedItems[index]){
                    allCheck = false;
                    return false;
                }
            });
            if ( allCheck ) {
                $scope.btnAction.selectedAll=true;
            }
        } , // 选中单选框 end
    		
        showAdd:function(){ //点击切换新增页面
            this.showAddOrModify=!this.showAddOrModify;
            this.showIndex=!this.showIndex;
            this.showText.firstTitle=showTitle[0];
            angular.copy($scope._shiftVo,$scope.shiftVo);
            angular.copy($scope._shiftVo,$scope._shiftVoModify);
        },
        showModify:function(){//点击切换修改页面
            //查看选择项是否唯一
            var num=0;
            var id=""; 
            var status="";
            for ( var i = 0 ; i < $scope.btnAction.selectedItems.length ; i++ ) {
                if ( $scope.btnAction.selectedItems[i] == true ) {
                	num++;
                	id=$scope.searchformAction.shiftList[i].shift.shiftId;
                	status=$scope.searchformAction.shiftList[i].statusName;
                }
            }
            if (num != 1) {
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
            //查询并绑定数据到shiftVo
            httpServer.postData(url.view,id).then(function(res){
	            if (res!='error'){
	            	console.log(res);
	            	//此处可自动cp
	                angular.copy(res, $scope.shiftVo);
	                //需修改移位类型字段为string，不然前端无法显示
	                $scope.shiftVo.shift.shiftType = $scope.shiftVo.shift.shiftType.toString();
	                angular.copy($scope.shiftVo, $scope._shiftVoModify);
	            }
	        })
        },
        searchModel:function(id){
            $('#'+id).modal('show');
        },
        showDetailBtn:function(id){
            this.showDetail=!this.showDetail;
            this.showIndex=!this.showIndex;
            this.showText.firstTitle=showTitle[2];
            //查询并绑定数据到shiftVo
            httpServer.postData(url.view,id).then(function(res){
	            if (res!='error'){
	            	console.log(res);
	            	//此处可自动cp
	                angular.copy(res, $scope.shiftVo);
	            }
	        })
        },
        showConfirmBtn:function(){//点击切换移位确认
        	//查看选择项是否唯一
            var num=0;
            var id=""; 
            var status="";
            for ( var i = 0 ; i < $scope.btnAction.selectedItems.length ; i++ ) {
                if ( $scope.btnAction.selectedItems[i] == true ) {
                	num++;
                	id=$scope.searchformAction.shiftList[i].shift.shiftId;
                	status=$scope.searchformAction.shiftList[i].statusName;
                }
            }
            if (num != 1) {
            	tooltip('请选择一项！');
            	return;
            }
            //查看选择项状态
            if (!angular.equals(status, '生效') && !angular.equals(status, '作业中')) {
            	tooltip('非生效或作业中状态，不能确认！');
            	return;
            }
            this.showConfirm=!this.showConfirm;
            this.showIndex=!this.showIndex;
            this.showText.firstTitle=showTitle[3];
            //查询并绑定数据到shiftVo
            httpServer.postData(url.view,id).then(function(res){
	            if (res!='error'){
	            	console.log(res);
	            	//此处可自动cp
	                angular.copy(res, $scope.shiftVo);
	                //单独配置实存为在库数量
	                for (var i=0; i < $scope.shiftVo.listInvShiftDetailVO.length; i++) {
	                	var shiftDetail = $scope.shiftVo.listInvShiftDetailVO[i].shift;
	                	if (shiftDetail.realShiftQty == null) {
	                		shiftDetail.realShiftQty = shiftDetail.shiftQty;
	                	}
	                }
	                angular.copy($scope.shiftVo, $scope._shiftVoModify);
	            }
	        })
        },
//        // 选择货主
//        selectOwner:function(){
//            commit.commitToParent($scope,'selectMerchantModel',{status:'addShiftOwner',isOwner:true});
//            var on = commit.listening($scope,'addShiftOwner',function(event,data){
//                    $scope.shiftVo.shift.owner = data.entity.merchantId;
//                    $scope.shiftVo.ownerName = data.entity.merchantName;
//                    on();
//            });
//        },
        cleanOwner:function(){
        	$scope.shiftVo.ownerName = '';
        	$scope.shiftVo.shift.owner = '';
        },
        // 选择入库库位
        selectInLocation:function(){
        	commit.commitToParent($scope,'select_wareLocation_searchModel','addShiftInLocation');
            var on = commit.listening($scope,'addShiftInLocation',function(event,data){
                //这里可以绑定date
                console.log(data);
                $scope.shiftDetailVo.inLocation=data.location.locationName;
                $scope.shiftDetailVo.shift.inLocation=data.location.locationId;
                on();
            });
           $scope.btnAction.searchModel('select_wareLocation_searchModel')
        },
        // 选择出库库位
        selectOutLocation:function(){
        	commit.commitToParent($scope,'select_wareLocation_searchModel','addShiftOutLocation');
            var on = commit.listening($scope,'addShiftOutLocation',function(event,data){
                //这里可以绑定date
                console.log(data);
                $scope.shiftDetailVo.outLocation=data.location.locationName;
                $scope.shiftDetailVo.shift.outLocation=data.location.locationId;
                on();
            });
           $scope.btnAction.searchModel('select_wareLocation_searchModel')
        },
        // 选择货品
        selectGoods:function(){
            commit.commitToParent($scope,'searchGoodsModel','addShiftGoods');
            var on = commit.listening($scope,'addShiftGoods',function(event,data){
                $scope.shiftDetailVo.shift.skuId = data.entity.skuId;
                $scope.shiftDetailVo.skuName = data.entity.skuName;
                on();
            });
        },
        saveOrUpdate:function(showTooltip){
        	if (this.checkSaveOrUpdate()){
	        	console.log($scope.shiftVo);
	        	if (!$scope.shiftVo.shift.shiftId||$scope.shiftVo.shift.shiftId=='') {
	        		//进入新增方法
	        		httpServer.postData(url.add,$scope.shiftVo).then(function(res){
		                console.log(res);
		                if (res!='error'){
		                	if (showTooltip) {
		                		tooltip('暂存成功！');
		                	}
		                    $scope.shiftVo.shift.shiftNo=res.shift.shiftNo;
		                    $scope.shiftVo.shift.shiftId=res.shift.shiftId;
		                    angular.copy($scope.shiftVo,$scope._shiftVoModify);
		                }
		            })
	        	} else {
	        		//进入修改方法
	        		httpServer.postData(url.update,$scope.shiftVo).then(function(res){
		                console.log(res);
		                if (res!='error'){
		                	if (showTooltip) {
		                		tooltip('暂存成功！');
		                	}
		                    angular.copy($scope.shiftVo,$scope._shiftVoModify);
		                }
		            })
	        	}
        	}
        },
        saveAndEnable:function(){//保存并生效
        	console.log($scope.shiftVo);
    		httpServer.postData(url.saveAndEnable,$scope.shiftVo).then(function(res){
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
                	var shiftVo = $scope.searchformAction.shiftList[i]
                	if (shiftVo.statusName != '打开') {
                		tooltip('非打开状态，不能修改');
                		continue;
                	}
                	idList.push(shiftVo.shift.shiftId);
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
                	var shiftVo = $scope.searchformAction.shiftList[i]
                	if (shiftVo.statusName != '生效') {
                		tooltip('非生效状态，不能修改');
                		continue;
                	}
                	idList.push(shiftVo.shift.shiftId);
                }
            }
        	if (idList.length >= 1) {
            	this.disable(idList);
        	} else {
        		tooltip('未选中任何项');
        	}
        },
        checkSaveOrUpdate:function(){//判断是否必填项未填或格式错误
        	if(angular.equals($scope.shiftVo.listInvShiftDetailVO,[])){
                tooltip('未生成详情数据,请重新查询！');
                return false;
            };
            return true;
        },
        confirmAll:function(){//全部确认
        	//进入全部确认方法
    		httpServer.postData(url.confirm, $scope.shiftVo).then(function(res){
                console.log(res);
                if (res!='error'){
                    tooltip('确认成功！');
                    $scope.btnAction.gotoList();
                }
            })
        },
    }
    //开始查询页面
    $scope.searchformAction={
        search:function(){
    		$scope.shiftList=[];
            //开始查询 即与绑定的page指令的查询端口进行双向数据绑定 数据不同时会自动查询 进入页面时会自动查一次
            var _pageModelQuery={};
            angular.copy($scope.reqParam,_pageModelQuery);
            $scope.pageModelQuery=_pageModelQuery;
            console.log($scope.pageModelQuery)
        },
        reset:function(){
            angular.copy(_reqParam,$scope.reqParam);
        }
    };
  //开始新增/修改盘点时查询
    $scope.searchDetailAction={
        search:function(){
        	if ($scope.shiftVo.shift.shiftType == 3 && (!$scope.shiftVo.shift.locationId||$scope.shiftVo.shift.locationId=='')) {
            	tooltip('未选择库位！');
                return;
            };
            if ($scope.shiftVo.shift.shiftType == 2 && (!$scope.shiftVo.shift.skuId||$scope.shiftVo.shift.skuId=='')) {
            	tooltip('未选择货品！');
                return;
            }
        	$scope.shiftVo.listInvShiftDetailVO=[],
            httpServer.postData(url.listByShift,$scope.shiftVo).then(function(res){
	            if (res!='error'){
	            	console.log(res);
//	                angular.copy(res, $scope.shiftVo.listInvShiftDetailVO);
	            	//此处需手动cp
	            	for ( var i = 0 ; i < res.length ; i++ ) {
	            		var stockDetailVo = res[i];
	            		var shiftDetailVo = {
	            			"skuName":stockDetailVo.skuName,
	            			"skuNo":stockDetailVo.skuNo,
	            			"locationNo":stockDetailVo.locationNo,
	            			"locationName":stockDetailVo.locationName,
	            			"areaName":stockDetailVo.areaName,
            				"specModel":stockDetailVo.specModel,
            				"measureUnit":stockDetailVo.measureUnit,
	            			"shift":{
	            				"skuId":stockDetailVo.invStock.skuId,
	            				"locationId":stockDetailVo.invStock.locationId,
	            				"storeQty":stockDetailVo.invStock.stockQty,
	            				"batchNo":stockDetailVo.invStock.batchNo,
	            			}
	            		};
	            		$scope.shiftVo.listInvShiftDetailVO.push(shiftDetailVo);
	            	}
	            }
	        })
        },
        reset:function(){
            angular.copy($scope._shiftVo,$scope.shiftVo);
            $scope.btnDetailAction.currentSelectItems=9999 , // 当前选中的明细项
            $scope.btnDetailAction.selectedItems=[] , // 明细项列表
            $scope.shiftVo.listInvShiftDetailVO=[], //参数列表
            $scope.btnDetailAction.selectedAll=false , //全选
            $scope.btnDetailAction.tooltipIsOpen=false // 是否提示
        },
        clean:function(){
            $scope.btnDetailAction.currentSelectItems=9999 , // 当前选中的明细项
            $scope.btnDetailAction.selectedItems=[] , // 明细项列表
            $scope.shiftVo.listInvShiftDetailVO=[], //参数列表
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
            if ($scope.shiftVo.listInvShiftDetailVO.length>0 ) {
                angular.forEach($scope.shiftVo.listInvShiftDetailVO,function(data,index){
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
            angular.forEach($scope.shiftVo.listInvShiftDetailVO,function(data,index){
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
                    $scope.shiftVo.listInvShiftDetailVO.splice(i,1);
                    $scope.btnDetailAction.selectedItems.splice(i--,1);
                }
            }
        } , // 删除明细 end
    };
}]).name;
/**
 * Created by yangl on 2017/3/6.
 */
