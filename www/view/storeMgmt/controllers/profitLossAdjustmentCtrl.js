'use strict';
module.exports = angular.module("app.storeMgmt")
.controller("profitLossAdjustmentCtrl", 
		['$scope','tooltip','modifyById','arrayAction','httpServer','commit',
    function($scope,tooltip,modifyById,arrayAction,httpServer,commit) {
	httpServer.postData('/param/show',['ADJUST_STATUS','ADJUST_TYPE']).then(function(res){
	    $scope.getOriginData = res;
	});
	//详情临时对象
	$scope.tempDetail={ //个字段的顺序和前端显示顺序要一致 方便下步复用
        "locationName":"",//库位名称
        "areaName":"",//库区名称
        "skuNo":"",//货品编号
        "skuName":"",//货品名称
    	"adj":{
            "batchNo":"",// 批次
            "skuId":"",// 货品状态
            "locationId":"",// 库位状态
            "mesureUnit":"",//计量单位
            "specModel":"",//规格型号
            "stockQty":"",//账存
            "realQty":"",//实存
            "adjustType":null//调账类型
        }
    };
	// 盈亏调整单明细对象
    function AdjustDetail () {
    	this.batchNo=null;// 批次
    	this.skuId=null;// 货品状态
    	this.locationId=null;// 库位状态
    	this.mesureUnit=null;//计量单位
    	this.specModel=null;//规格型号
    	this.stockQty=null;//账存
    	this.realQty=null;//实存
    	this.adjustType=null;//调账类型
    }

    // 盈亏调整单明细VO
    function AdjustDetailVO () {
        this.adj= new AdjustDetail();	// 明细
    	this.locationName=null;//库位名称
    	this.areaName=null;//库区名称
    	this.skuNo=null;//货品编号
    	this.skuName=null;//货品名称
    }
    $scope.btnAction={

        showAddOrModify:false,
        showSplitAsn:false,
        showIndex:true,
        addAsn:function(){ //点击切换新增ASN页面
            this.showAddOrModify=!this.showAddOrModify;
            this.showIndex=!this.showIndex;
        },
        adjustmentPage:false,
        adjustmentTurnpage:function(){
            this.adjustmentPage=!this.adjustmentPage;
            this.showIndex=!this.showIndex;
        },
        adjustment:function(){//点击切换修改ASN页面
            this.adjustmentTurnpage();
        },
        searchModel:function(id){
            $('#'+id).modal('show');
        },
        // 选择库存
        selectStock:function(){
            commit.commitToParent($scope,'inventoryGoodsModal',{
            	"status":"searchStock",
            	"isShow":true,
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
                }	
            });
            var on = commit.listening($scope,'searchStock',function(event,data){
            	console.log(data);
                $scope.tempDetail.adj.skuId = data.invStock.skuId;
                $scope.tempDetail.skuNo = data.skuNo;
                $scope.tempDetail.skuName = data.skuName;
                $scope.tempDetail.adj.batchNo = data.invStock.batchNo;
                $scope.tempDetail.adj.locationId = data.invStock.locationId;
                $scope.tempDetail.locationNo = data.locationNo;
                $scope.tempDetail.locationName = data.locationName;
                $scope.tempDetail.areaName = data.areaName;
                $scope.tempDetail.adj.measureUnit = data.measureUnit;
                $scope.tempDetail.adj.specModel = data.specModel;
                $scope.tempDetail.adj.stockQty = data.invStock.stockQty;
                $scope.tempDetail.adj.realQty = data.invStock.stockQty;
                on();
            });
        },
    }
}]).name;
/**
 * Created by yangl on 2017/3/6.
 */
