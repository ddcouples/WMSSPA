'use strict';
module.exports = angular.module("app.storeMgmt")
    .controller("receiveMgmtCtrl", ['$scope','$filter','tooltip','modifyById','arrayAction','httpServer','objectAction','scrollObj','store','commit' ,
        function($scope,$filter,tooltip,modifyById,arrayAction,httpServer,objectAction,scrollObj,store,commit) {

        $scope.listASN_url = "/asn/list";
        var url = {
            'saveASN_url' : '/asn/add' ,
            'updateASN_url' : '/asn/update' ,
            'viewASN_url' : '/asn/view' ,
            'activeASN_url' : '/asn/enabled' ,
            'inactiveASN_url' : '/asn/disable' ,
            'splitASN_url' : '/asn/split' ,
            'unsplitASN_url' : '/asn/unsplit' ,
            'cancelASN_url' : '/asn/cancel' ,
            'completeASN_url' : '/asn/complete' ,
            'batchASN_url' : '/asn/batch' ,
            'imptASN_url' : '/asn/impt' ,
            'showParam_url' : '/param/show'
        };

        var cacheName = {
            'ASNSTATUS' : 'ASNSTATUS' ,
            'ASNDATAFROM' : 'ASNDATAFROM' ,
            'ASNDOCTYPE' : 'ASNDOCTYPE'
        }

        var asnStatus = {
            'OPEN' : '10' ,
            'ACTIVE' : '20'
        };

        var locationTypeTemp = 10;

        var locationTypeStorage = 20;

        var err = {
            err_asn_selectOne :  '只能选取其中一项，进行操作' ,
            err_asn_notSelected :  '请选择列表中一项,再进行操作!' ,
            err_asn_active_notOpen :  'ASN单状态为打开时，才能进行ASN单生效操作!',
            err_asn_inactive_notActive :  'ASN单状态为生效时，才能进行ASN单失效操作!' ,
            err_asn_cancel_notCancel :  'ASN单状态为打开时，才能进行ASN单取消操作!' ,
            err_asn_unsplit_notCancel :  'ASN单状态为打开时，才能进行ASN单取消拆分操作!' ,
            err_rec_asn_split_statusNotOpen :  'ASN单状态为打开时，才能进行ASN单拆分操作!' ,
            err_rec_asn_update_statusNotOpen :  'ASN单状态为打开时，才能进行ASN单修改操作!' ,
            err_rec_asn_confirm_statusNotActive :  'ASN单状态为生效时，才能进行ASN单收货确认操作!' ,
            err_asn_confirm_notActive : 'ASN单状态为生效时，才能进行ASN单收货确认操作!' ,
        };

        var msg = {
            'msg_asn_active_success' : '生效成功',
            'msg_asn_inactive_success' : '失效成功',
            'msg_asn_cancel_success' : '取消成功' ,
            'msg_asn_unsplit_success' : '取消拆分成功'
        };

        $scope.pageModelQuery = {};

        // ASN单对象
        function Asn () {
            this.createPerson = null;      // 创建人id
            this.updatePerson = null;      // 修改人id
            this.asnId = null;             // ASN单id
            this.asnNo = null;             // ASN单号
            this.asnStatus = null;         // ASN单状态
            this.poNo = null;              // PO单号
            this.owner = null;             // 货主id
            this.orgId = null;             // 企业id
            this.parentAsnId = null;       // 父ASN单id
            this.warehouseId = null;       // 仓库id
            this.asnNo1 = null;            // 相关单号1
            this.asnNo2 = null;            // 相关单号2
            this.docType = null;           // 单据类型
            this.orderDate = null;         // 订单日期
            this.sender = null;            // 发货方id
            this.receiveQty = null;        // 收货数量
            this.receiveWeight = null;     // 收货重量
            this.receiveVolume = null;     // 收货体积
            this.contactPerson = null;     // 联系人
            this.contactPhone = null;      // 联系电话
            this.contactAddress = null;    // 联系地址
            this.note = null;              // 备注
            this.dataFrom = null;          // 单据来源
            this.orderQty = null;          // 订单数量
            this.orderWeight = null;       // 订单重量
            this.orderVolume = null;       // 订单体积
            this.appointmentTime = null;   // 预约时间
            this.opPerson = null;          // 工作人员
            this.opTime = null;            // 工作时间
        }

        // ASN单VO
        function AsnVO () {
            this.asn = new Asn();           // ASN单对象
            this.dataFromComment= null;        // 单据来源中文描述
            this.ownerComment= null;           // 货主中文名称
            this.senderComment= null;          // 发送方中文名称
            this.warehouseComment= null;       // 仓库中文名称
            this.createPersonComment= null;    // 创建人中文名称
            this.updatePersonComment= null;    // 修改人中文名称
            this.listSaveAsnDetail= [];     // 【新增和更新操作业务】的ASN单明细对象集合
            this.listAsnId= [];             // ASN单id集合
            this.locationId= null;             // 【批量确认收货业务】默认的库位id
            this.orgComment= null;             // 企业中文名称
            this.docTypeComment= null;         // 单据类型中文描述
            this.asnStatusComment= null;       // ASN单状态中文描述
            this.parentAsnComment= null;       // 父ASN单单号
            this.listUpdateDetailId= [];    // 【更新操作业务】中记录更新过的ASN单明细id
            this.listDelDetailId= [];       // 【更新操作业务】中记录删除的ASN单明细id
            this.listAsnDetailVO=[];
            this.listSavetAsnDetail=[];
        }

        // ASN单明细对象
        function AsnDetail () {
            this.createTime= null;             // 创建时间
            this.updateTime= null;             // 修改时间
            this.createPerson= null;           // 创建人
            this.updatePerson= null;           // 修改人
            this.asnDetailId= null;            // ASN单明细id
            this.asnId= null;                  // ASN单id
            this.skuId= null;                  // 货品id
            this.locationId= null;             // 库位id
            this.warehouseId= null;            // 仓库id
            this.orgId= null;                  // 企业id
            this.batchNo= null;                // 批次号
            this.measureUnit= null;            // 计量单位
            this.receiveQty= null;             // 收货数量
            this.receiveWeight= null;          // 收货重量
            this.receiveVolume= null;          // 收货体积
            this.orderQty= 0;              // 订单数量
            this.orderWeight= 0;           // 订单重量
            this.orderVolume= 0;           // 订单体积
            this.packId= null;                 // 包装id
            this.produceDate= null;            // 生产日期
            this.expiredDate= null;            // 到期日期
            this.parentAsnDetailId= null;      // 父ASN单明细id
        }

        // ASN单明细VO
        function AsnDetailVO () {
            this.asnDetail= new AsnDetail();	// ASN单明细
            this.skuComment= null; 							// 货品中文名称
            this.packComment= null; 							// 包装中文名称
            this.specModelComment= null; 				// 规格型号
            this.locationComment= null; 					// 库位中文名称
            this.listPtwLocVO= null; 						// 上架操作明细集合
            this.listAsnDetailId= null; 					// ASN单明细id集合
            this.splitQty = 0;                          //  拆分数量
            this.splitWeight = 0;                       //  拆分重量
            this.splitVolume = 0;                       //  拆分体积
        }


        // 查询ASN列表Action
        $scope.searchAsnAction = {
            selectedItems : [] , // 列表中选中的ASN单
            selectedAll : false , // 全选按钮默认不选中
            currentSelectItems : 9999 ,
            listAsn : [] ,
            _empty_searchAsnModel : new AsnVO() ,
            searchAsnModel : new AsnVO() ,
            historyMessages : [] , //用于存储历史查询信息  可以存入store
            // 初始化
            init : function () {
                $scope.searchAsnAction._empty_searchAsnModel = new AsnVO();
                // 初始化查询条件
                $scope.searchAsnAction.searchAsnModel = new AsnVO();
                //检测用户输入 并存入本地存储
                $scope.searchAsnAction.historyMessages=[];
                if(store.get('receiveMgmt_historyMessages')){
                    $scope.searchAsnAction.historyMessages=store.get('receiveMgmt_historyMessages');
                }
                $scope.$watchCollection('searchAsnAction.historyMessages',function(newV){
                    if(newV){
                        store.set('receiveMgmt_historyMessages', $scope.searchAsnAction.historyMessages);
                    }
                });
            } , // 初始化 end
            // 多选复选框
            selectAll : function () {
                if ( $scope.searchAsnAction.listAsn.length>0 ) {
                    angular.forEach($scope.searchAsnAction.listAsn,function(data,index){
                        if($scope.searchAsnAction.selectedAll){
                            $scope.searchAsnAction.selectedItems[index]=true;
                        }else{
                            $scope.searchAsnAction.selectedItems[index]=false;
                        }
                    });
                }
            } , // 多选复选框 end
            // 选中单选框
            selectModify:function(index,$event){
                this.currentSelectItems=index;
                //点击进行是否选择操作
                $scope.searchAsnAction.selectedItems[index]=!$scope.searchAsnAction.selectedItems[index];
                // 如果该点击项不是选中状态就将全部选中状态去掉
                $scope.searchAsnAction.selectedAll=false;
                var allCheck = true;
                angular.forEach($scope.searchAsnAction.listAsn,function(data,index){
                    if(!$scope.searchAsnAction.selectedItems[index]){
                        allCheck = false;
                        return false;
                    }
                });
                if ( allCheck ) {
                    $scope.searchAsnAction.selectedAll=true;
                }
            } , // 选中单选框 end
            // 清空单选框
            clearSelect : function () {
                angular.forEach ($scope.searchAsnAction.selectedItems,function( data , i ){
                    $scope.searchAsnAction.selectedItems[i] = false;
                }) ;
                $scope.searchAsnAction.selectedAll = false;
            } , // 清空单选框 end
            choiceOne : function (voCheck) {
                var asnIds = $scope.searchAsnAction.choiceAll(voCheck);
                if ( asnIds == null ) {
                    return null;
                } else if ( asnIds.length > 1 ) {
                    tooltip(err.err_asn_selectOne);
                    return null;
                }
                return asnIds[0];
            } ,
            choiceAll : function (voCheck) {
                if ( !$scope.searchAsnAction.selectedItems || $scope.searchAsnAction.selectedItems.length == 0 ) {
                    tooltip(err.err_asn_notSelected);
                    return null;
                }
                var asnIds = [];
                for( var i = 0 ; i < $scope.searchAsnAction.selectedItems.length ; i++ ) {
                    if ( !$scope.searchAsnAction.selectedItems[i]
                        || $scope.searchAsnAction.selectedItems[i] == false
                        || $scope.searchAsnAction.listAsn.length <= i ) {
                        continue;
                    }
                    var recAsnVO = $scope.searchAsnAction.listAsn[i];
                    var flag = voCheck(recAsnVO);
                    if ( flag == false ) {
                        return null;
                    }
                    asnIds.push(recAsnVO.asn.asnId);
                }
                if ( asnIds.length == 0 ) {
                    tooltip(err.err_asn_notSelected);
                    return null;
                }
                return asnIds;
            } ,
            showBatchConfirm : function () {
                // 显示批量收货
                var asnIds = $scope.searchAsnAction.choiceAll(function(recAsnVO){
                    if ( recAsnVO.asn.asnStatus != asnStatus.ACTIVE ) {
                        tooltip(err.err_asn_confirm_notActive);
                        return false;
                    }
                });
                if ( asnIds == null ) {
                    return ;
                }
                $('#bulkGoodsModal').modal('show');

                $scope.batchConfirmAsnAction.asnVOModel.listAsnId = [];
                for( var i = 0 ; i < $scope.searchAsnAction.selectedItems.length ; i++ ) {
                    if ( !$scope.searchAsnAction.selectedItems[i]
                        || $scope.searchAsnAction.selectedItems[i] == false
                        || $scope.searchAsnAction.listAsn.length <= i ) {
                        continue;
                    }
                    var recAsnVO = $scope.searchAsnAction.listAsn[i];
                    $scope.batchConfirmAsnAction.asnVOModel.listAsnId.push(recAsnVO.asn.asnId);
                }
            } ,
            // 生效ASN单
            activeAsn : function () {
                var asnId = $scope.searchAsnAction.choiceOne(function(recAsnVO){
                    if ( recAsnVO.asn.asnStatus != asnStatus.OPEN  ) {
                        tooltip(err.err_asn_active_notOpen);
                        return false;
                    }
                });
                if ( asnId == null ) {
                    return;
                }
                httpServer.postData(url.activeASN_url,[asnId]).then(function(res){
                    if ( res != 'error' ) {
                        $scope.searchAsnAction.searchAsn();
                        tooltip(msg.msg_asn_active_success);
                    }
                });
            } , // 生效ASN单 end
            // 失效ASN单
            inactiveAsn : function () {
                var asnId = $scope.searchAsnAction.choiceOne(function(recAsnVO){
                    if ( recAsnVO.asn.asnStatus != asnStatus.ACTIVE  ) {
                        tooltip(err.err_asn_inactive_notActive);
                        return false;
                    }
                });
                if ( asnId == null ) {
                    return;
                }
                httpServer.postData(url.inactiveASN_url,[asnId]).then(function(res){
                    if ( res != 'error' ) {
                        $scope.searchAsnAction.searchAsn();
                        tooltip(msg.msg_asn_inactive_success);
                    }
                });
            } , // 失效ASN单 end
            // 取消ASN单
            cancelAsn : function () {
                var asnId = $scope.searchAsnAction.choiceOne(function(recAsnVO){
                    if ( recAsnVO.asn.asnStatus != asnStatus.OPEN  ) {
                        tooltip(err.err_asn_cancel_notCancel);
                        return false;
                    }
                });
                if ( asnId == null ) {
                    return;
                }
                httpServer.postData(url.cancelASN_url,[asnId]).then(function(res){
                    if ( res != 'error' ) {
                        $scope.searchAsnAction.searchAsn();
                        tooltip(msg.msg_asn_cancel_success);
                    }
                });
            } ,  // 取消ASN单 end
            // 取消拆分ASN单
            unsplitAsn : function () {
                var asnId = $scope.searchAsnAction.choiceOne(function(recAsnVO){
                    if ( recAsnVO.asn.asnStatus != asnStatus.OPEN  ) {
                        tooltip(err.err_asn_unsplit_notCancel);
                        return false;
                    }
                });
                if ( asnId == null ) {
                    return;
                }
                httpServer.postData(url.unsplitASN_url,[asnId]).then(function(res){
                    if ( res != 'error' ) {
                        $scope.searchAsnAction.searchAsn();
                        tooltip(msg.msg_asn_unsplit_success);
                    }
                });
            } , // 取消拆分ASN单 end
            // 查询ASN列表
            searchAsn:function(){
                if(!angular.equals($scope.searchAsnAction.searchAsnModel,$scope.searchAsnAction._empty_searchAsnModel)){
                    var _obj={};
                    angular.copy($scope.searchAsnAction.searchAsnModel,_obj);
                    if($scope.searchAsnAction.historyMessages.length>=10){
                        $scope.searchAsnAction.historyMessages.shift(1);
                    }
                    $scope.searchAsnAction.historyMessages.push(_obj);
                }
                if ( $scope.searchAsnAction.searchAsnModel.asnStatusComment != "" ) {
                    var listStatus = $scope.getOriginData[cacheName.ASNSTATUS];
                    for ( var i = 0 ; i < listStatus.length ; i++ ) {
                        var s = listStatus[i];
                        if ( s.value == $scope.searchAsnAction.searchAsnModel.asnStatusComment ) {
                            $scope.searchAsnAction.searchAsnModel.asn.asnStatus = s.key;
                            break;
                        }
                    }
                } else {
                    $scope.searchAsnAction.searchAsnModel.asn.asnStatus = '';
                }
                if ( $scope.searchAsnAction.searchAsnModel.dataFromComment != "" ) {
                    var listDataFrom = $scope.getOriginData[cacheName.ASNDATAFROM];
                    for ( var i = 0 ; i < listDataFrom.length ; i++ ) {
                        var s = listDataFrom[i];
                        if ( s.value == $scope.searchAsnAction.searchAsnModel.dataFromComment ) {
                            $scope.searchAsnAction.searchAsnModel.asn.dataFrom = s.key;
                            break;
                        }
                    }
                } else {
                    $scope.searchAsnAction.searchAsnModel.asn.dataFrom = '';
                }
                //开始查询 即与绑定的page指令的查询端口进行双向数据绑定
                $scope.pageModelQuery = Object.assign({},$scope.searchAsnAction.searchAsnModel);
                // $scope.searchAsnAction.searchAsnModel.asn.asnStatus = '';
                // $scope.searchAsnAction.searchAsnModel.asn.dataFrom = '';

                if ( $scope.searchAsnAction.selectedItems && $scope.searchAsnAction.selectedItems.length > 0 ) {
                    angular.forEach($scope.searchAsnAction.selectedItems,function(data,index){
                        $scope.searchAsnAction.selectedItems[index] = false;
                    });
                }
            } , // 查询ASN列表 end
            // 重置
            reset:function(){
                angular.copy($scope.searchAsnAction._empty_searchAsnModel,$scope.searchAsnAction.searchAsnModel);
            } // 重置 end
        };

        // 初始化数据
        $scope.searchAsnAction.init();

        // 页面请求参数表数据
        httpServer.postData(url.showParam_url,[cacheName.ASNSTATUS,cacheName.ASNDATAFROM,cacheName.ASNDOCTYPE]).then(function(res){
            $scope.getOriginData = res;
            $scope.searchAsnAction.searchAsnModel.asnStatusComment="";
            $scope.searchAsnAction.searchAsnModel.dataFromComment="";
            $scope.searchAsnAction._empty_searchAsnModel.asnStatusComment="";
            $scope.searchAsnAction._empty_searchAsnModel.dataFromComment="";
            $scope.searchAsnAction.searchAsnModel.asn.asnStatus = '';
            $scope.searchAsnAction.searchAsnModel.asn.dataFrom = '';
            $scope.searchAsnAction._empty_searchAsnModel.asn.asnStatus = '';
            $scope.searchAsnAction._empty_searchAsnModel.asn.dataFrom = '';
            $scope.addAsnAction.addAsnModel.asn.docType="";
        });

        // 新增和修改ASN单Action
        $scope.addAsnAction = {
            addAsnModel : new AsnVO() , // 新增对象
            tooltipIsOpen : false , // 是否打开tip提示
            addAsnDetailListModel : [] , // 本次新增ASN单明细
            isUpdate : false , // 是否更新
            // 初始化
            init : function () {
                $scope.addAsnAction.addAsnModel = new AsnVO();
                $scope.addAsnAction.addAsnModel.asn.orderDate = $filter('date')(new Date(), "yyyy/MM/dd");
                $scope.addAsnAction.addAsnModel.asn.docType="";
                $scope.addAsnAction.addAsnDetailListModel = [];
                $scope.addAsnDetailAction.addAsnDetailModel = new AsnDetailVO();
            } , // 初始化 end
            // 保存ASN单
            save : function (formName) {
                $scope.addAsnAction.saveOrUpdateAsn(formName,function(res){
                    if(!$scope.addAsnAction.addAsnModel.asn.asnId || $scope.addAsnAction.addAsnModel.asn.asnId == ''){
                        tooltip('保存成功!');
                    } else {
                        tooltip('更新成功!');
                    }
                    $scope.btnAction.backToIndex();
                });
            } , // 保存ASN单 end
            // 保存并生效ASN单 begin
            saveAndActive : function (formName) {
                $scope.addAsnAction.saveOrUpdateAsn(formName,function(res){
                    if ( res.asn != null && res.asn.asnId != null ) {
                        httpServer.postData(url.activeASN_url,[res.asn.asnId]).then(function(resActive){
                            if ( resActive != 'error' ) {
                                tooltip('生效成功!');
                                $scope.btnAction.backToIndex();
                                $scope.searchAsnAction.searchAsn();
                            }
                        });
                    }
                });
            } , // 保存并生效ASN单 end
            // 保存ASN单 begin
            saveOrUpdateAsn : function ( formName , success  ) {
                if( $scope.addAsnAction.checkout(formName)){ //检验通过 就可以进行暂存操作
                    $scope.addAsnAction.addAsnModel.listSaveAsnDetail = [];
                    angular.forEach($scope.addAsnAction.addAsnDetailListModel,function(data,i){
                        $scope.addAsnAction.addAsnModel.listSaveAsnDetail.push(objectAction.newCopy($scope.addAsnAction.addAsnDetailListModel[i].asnDetail));
                    });
                    //如果是第一次保存 就没有deliveryId
                    if(!$scope.addAsnAction.addAsnModel.asn.asnId || $scope.addAsnAction.addAsnModel.asn.asnId == ''){
                        //发送暂存新增id  进行滞空操作
                        httpServer.postData(url.saveASN_url,$scope.addAsnAction.addAsnModel).then(function(res){
                            if ( res != "error" ) {
                                success(res);
                            }
                        });
                    } else {
                        // 修改ASN单
                        //发送暂存新增id
                        httpServer.postData(url.updateASN_url,$scope.addAsnAction.addAsnModel).then(function(res){
                            if ( res != "error" ) {
                                success(res);
                            }
                        });
                    }
                }
            } , // 保存ASN单 end
            // 表单验证
            checkout : function checkout(item){
                if($scope.addAsnAction.addAsnModel.asn.docType==''){//判断 单据类型是否为空
                    scrollObj.scrollTo('select#addAsnDocType');
                    $scope.addAsnAction.tooltipIsOpen=true;
                    setTimeout(function(){
                        $scope.addAsnAction.tooltipIsOpen=false;// 消失提示和弹出
                        $scope.$apply();
                    },2000);
                    return false;
                }
                if(item.orderDate.$invalid){ //判断数量是否为空
                    scrollObj.scrollTo('input#orderDate');
                    $scope.addAsnAction.tooltipIsOpen=true;
                    setTimeout(function(){
                        $scope.addAsnAction.tooltipIsOpen=false;// 消失提示和弹出
                        $scope.$apply();
                    },2000);
                    return false;
                }
                if(item.ownerComment.$invalid){ //判断货主是否为空
                    scrollObj.scrollTo('input#ownerComment');
                    $scope.addAsnAction.tooltipIsOpen=true;
                    setTimeout(function(){
                        $scope.addAsnAction.tooltipIsOpen=false;// 消失提示和弹出
                        $scope.$apply();
                    },2000);
                    return false;
                }
                return true;
            } , // 表单验证 end
            // 选择货主
            selectOwner:function(){
                commit.commitToParent($scope,'selectMerchantModel',{status:'addAsnActionOwner',isOwner:true});
                var on = commit.listening($scope,'addAsnActionOwner',function(event,data){
                        $scope.addAsnAction.addAsnModel.asn.owner = data.entity.merchantId;
                        $scope.addAsnAction.addAsnModel.ownerComment = data.entity.merchantName;
                        on();
                });
            },
            selectSender : function () {
                commit.commitToParent($scope,'selectMerchantModel',{status:'addAsnActionSender',isSender:true});
                var on = commit.listening($scope,'addAsnActionSender',function(event,data){
                    $scope.addAsnAction.addAsnModel.asn.sender = data.entity.merchantId;
                    $scope.addAsnAction.addAsnModel.senderComment = data.entity.merchantName;
                    on();
                });
            } ,
            // 选择货品
            selectSku : function () {
                commit.commitToParent($scope,'searchGoodsModel','addAsnActionSku')
                var on = commit.listening($scope,'addAsnActionSku',function(event,data){
                    if ( data.entity.perVolume && data.entity.perVolume != null ) {
                        $scope.addAsnDetailAction.addAsnDetailModel.perVolume = data.entity.perVolume;
                    } else {
                        $scope.addAsnDetailAction.addAsnDetailModel.perVolume = 0;
                    }
                    if ( data.entity.perWeight && data.entity.perWeight != null ) {
                        $scope.addAsnDetailAction.addAsnDetailModel.perWeight = data.entity.perWeight;
                    } else {
                        $scope.addAsnDetailAction.addAsnDetailModel.perWeight = 0;
                    }
                    $scope.addAsnDetailAction.addAsnDetailModel.asnDetail.measureUnit = data.entity.measureUnit;
                    $scope.addAsnDetailAction.addAsnDetailModel.skuComment = data.entity.skuName;
                    $scope.addAsnDetailAction.addAsnDetailModel.asnDetail.specModel = data.entity.specModel;
                    $scope.addAsnDetailAction.addAsnDetailModel.skuNo = data.entity.skuNo;
                    $scope.addAsnDetailAction.addAsnDetailModel.asnDetail.skuId = data.entity.skuId;
                    on();
                })
            }
        };

        // 新增ASN单 - 添加货品明细
        $scope.addAsnDetailAction = {
            tooltipIsOpen : false , // 是否提示
            addAsnDetailModel : new AsnDetailVO() , // 添加的ASN单明细
            currentSelectItems : 9999 , // 当前选中的明细项
            selectedItems : [] , // 明细项列表
            selectedAll : false , //全选
            // 全选
            selectAll : function () {
                if ( $scope.addAsnAction.addAsnDetailListModel.length>0 ) {
                    angular.forEach($scope.addAsnAction.addAsnDetailListModel,function(data,index){
                        if($scope.addAsnDetailAction.selectedAll){
                            $scope.addAsnDetailAction.selectedItems[index]=true;
                        }else{
                            $scope.addAsnDetailAction.selectedItems[index]=false;
                        }
                    });
                }
            } , // 全选 end
            // 单项选择框
            selectModify : function ($index,$event) {
                this.currentSelectItems=$index;
                //点击进行是否选择操作
                $scope.addAsnDetailAction.selectedItems[$index]=!$scope.addAsnDetailAction.selectedItems[$index];
                // 如果该点击项不是选中状态就将全部选中状态去掉
                $scope.addAsnDetailAction.selectedAll=false;
                var allCheck = true;
                angular.forEach($scope.addAsnAction.addAsnDetailListModel,function(data,index){
                    if(!$scope.addAsnDetailAction.selectedItems[index]){
                        allCheck = false;
                        return false;
                    }
                });
                if ( allCheck ) {
                    $scope.addAsnDetailAction.selectedAll=true;
                }

                // ------------------------------------------------------
                // 联动
                $scope.addAsnDetailAction.addAsnDetailModel = objectAction.newCopy($scope.addAsnAction.addAsnDetailListModel[$index]);
                if ( $scope.addAsnAction.addAsnDetailListModel[$index].specModelComment != null ) {
                    $scope.addAsnDetailAction.addAsnDetailModel.asnDetail.specModel = $scope.addAsnAction.addAsnDetailListModel[$index].specModelComment;
                }
            } , // 单项选择框 end
            // 添加ASN单明细
            addAsnDetailList : function (formItem) {
                if(formItem.addAsnSkuNo.$invalid){//判断货品代码是否为空
                    $scope.addAsnDetailAction.tooltipIsOpen=true;
                    setTimeout(function(){
                        $scope.addAsnDetailAction.tooltipIsOpen=false;// 消失提示和弹出
                        $scope.$apply();
                    },2000);
                    return ;
                }
                if(formItem.addAsnBatchNo.$invalid){//判断批次号是否为空
                    $scope.addAsnDetailAction.tooltipIsOpen=true;
                    setTimeout(function(){
                        $scope.addAsnDetailAction.tooltipIsOpen=false;// 消失提示和弹出
                        $scope.$apply();
                    },2000);
                    return ;
                }
                if(formItem.addAsnOrderQty.$invalid || $scope.addAsnDetailAction.addAsnDetailModel.asnDetail.orderQty <= 0 ){ //判断数量是否为空
                    $("#addAsnQty").focus();
                    $scope.addAsnDetailAction.tooltipIsOpen=true;
                    setTimeout(function(){
                        $scope.addAsnDetailAction.tooltipIsOpen=false;// 消失提示和弹出
                        $scope.$apply();
                    },2000);
                    return ;
                }else{
                    //遍历数组查找  货品id和批次是否一致
                    var _canPush=true;
                    angular.forEach($scope.addAsnAction.addAsnDetailListModel,function(data,index){
                        if( data.asnDetail.skuId == $scope.addAsnDetailAction.addAsnDetailModel.asnDetail.skuId
                                && data.asnDetail.batchNo==$scope.addAsnDetailAction.addAsnDetailModel.asnDetail.batchNo ){
                            _canPush=false;
                            tooltip('货品代码和批次不能同时重复！');
                        }
                    });
                    if(_canPush){
                        if ( !$scope.addAsnDetailAction.addAsnDetailModel.asnDetail.orderWeight
                                || $scope.addAsnDetailAction.addAsnDetailModel.asnDetail.orderWeight < 0 ) {
                            $scope.addAsnDetailAction.addAsnDetailModel.asnDetail.orderWeight = 0;
                        }
                        if ( !$scope.addAsnDetailAction.addAsnDetailModel.asnDetail.orderVolume
                                || $scope.addAsnDetailAction.addAsnDetailModel.asnDetail.orderVolume < 0 ) {
                            $scope.addAsnDetailAction.addAsnDetailModel.asnDetail.orderVolume = 0;
                        }
                        $scope.addAsnAction.addAsnDetailListModel.push(objectAction.newCopy($scope.addAsnDetailAction.addAsnDetailModel));
                        $scope.addAsnDetailAction.selectedItems.push(false);
                        // 让当前选中状态成为新增的这一条
                        $scope.addAsnDetailAction.currentSelectItems=$scope.addAsnDetailAction.selectedItems.length-1;
                        $scope.addAsnDetailAction.updateSum();
                    }
                }
            } , // 添加ASN单明细 end
            // 删除ASN单明细
            delAsnDetailList : function () {
                for ( var i = 0 ; i < $scope.addAsnDetailAction.selectedItems.length ; i++ ) {
                    if ( $scope.addAsnDetailAction.selectedItems[i] == true ) {
                        var detail = $scope.addAsnAction.addAsnDetailListModel[i].asnDetail;
                        $scope.addAsnAction.addAsnModel.listDelDetailId.push(detail.asnDetailId);
                        $scope.addAsnAction.addAsnDetailListModel.splice(i,1);
                        $scope.addAsnDetailAction.selectedItems.splice(i--,1);
                    }
                }
                $scope.addAsnDetailAction.updateSum();
            } , // 删除ASN单明细 end
            // 确认修改ASN单明细
            updateAsnDetailList : function () {
                $scope.addAsnAction.addAsnDetailListModel[$scope.addAsnDetailAction.currentSelectItems] = objectAction.newCopy($scope.addAsnDetailAction.addAsnDetailModel);
                var asnDetailVO =  $scope.addAsnAction.addAsnDetailListModel[$scope.addAsnDetailAction.currentSelectItems];
                $scope.addAsnAction.addAsnModel.listUpdateDetailId.push(asnDetailVO.asnDetail.asnDetailId);
                $scope.addAsnDetailAction.updateSum();
            } , // 确认修改ASN单明细
            // 更新统计数据
            updateSum : function () {
                var totalQty = 0;
                var totalWeight = 0;
                var totalVolume = 0;
                angular.forEach($scope.addAsnAction.addAsnDetailListModel,function(data,index){
                    totalQty += parseInt($scope.addAsnAction.addAsnDetailListModel[index].asnDetail.orderQty);
                    totalWeight += parseInt($scope.addAsnAction.addAsnDetailListModel[index].asnDetail.orderWeight);
                    totalVolume += parseInt($scope.addAsnAction.addAsnDetailListModel[index].asnDetail.orderVolume);
                });
                $scope.addAsnAction.addAsnModel.asn.orderQty = totalQty;
                $scope.addAsnAction.addAsnModel.asn.orderWeight = totalWeight;
                $scope.addAsnAction.addAsnModel.asn.orderVolume = totalVolume;
            }
        };

        $scope.splitAsnAction = {
            asnVOModel : new AsnVO() ,    //  ASN单VO
            pageListAsnDetailVO : [] ,     // 页面ASN单明细集合
            splitAsn : function () {
                angular.forEach($scope.splitAsnAction.asnVOModel.listAsnDetailVO,function(data,index){
                    $scope.splitAsnAction.asnVOModel.listSaveAsnDetail[index] = $scope.splitAsnAction.asnVOModel.listAsnDetailVO[index].asnDetail;
                });
                httpServer.postData(url.splitASN_url,$scope.splitAsnAction.asnVOModel).then(function(res){
                    if ( res != 'error' ) {
                        tooltip("拆分成功");
                    }
                });
            }
        };
        $scope.confirmAsnAction = {
            asnVOModel : new AsnVO() ,    //  ASN单VO
            tooltipIsOpen : false , // 是否提示
            currentSelectItems : 0 , // 当前选中的明细项
            selectedItems : [] , // 明细项列表
            selectedAll : false , //全选
            // 全选
            selectAll : function () {
                if ( $scope.confirmAsnAction.asnVOModel.listAsnDetailVO.length>0 ) {
                    angular.forEach($scope.confirmAsnAction.asnVOModel.listAsnDetailVO,function(data,index){
                        if($scope.confirmAsnAction.selectedAll){
                            $scope.confirmAsnAction.selectedItems[index]=true;
                        }else{
                            $scope.confirmAsnAction.selectedItems[index]=false;
                        }
                    });
                }
            } , // 全选 end
            // 单项选择框
            selectModify : function ($index,$event) {
                $scope.confirmAsnAction.currentSelectItems=$index;
                //点击进行是否选择操作
                $scope.confirmAsnAction.selectedItems[$index]=!$scope.confirmAsnAction.selectedItems[$index];
                // 如果该点击项不是选中状态就将全部选中状态去掉
                $scope.confirmAsnAction.selectedAll=false;
                var allCheck = true;
                angular.forEach($scope.confirmAsnAction.asnVOModel.listAsnDetailVO,function(data,index){
                    if(!$scope.confirmAsnAction.selectedItems[index]){
                        allCheck = false;
                        return false;
                    }
                });
                if ( allCheck ) {
                    $scope.confirmAsnAction.selectedAll=true;
                }
            } , // 单项选择框 end
            selectOpPerson : function () {
                commit.commitToParent($scope,'select_users_searchModel','confirmAsnActionOpPerson');
                commit.listening($scope,'confirmAsnActionOpPerson',function(event,data){
                    $scope.confirmAsnAction.asnVOModel.asn.opPerson = data.entity.userId;
                    $scope.confirmAsnAction.asnVOModel.opPersonComment = data.entity.userName;
                });
            } ,
            selectLocation : function () {
                commit.commitToParent($scope,'select_wareLocation_searchModel',{status:'confirmAsnActionLocation',location:{locationType:locationTypeTemp}});
                commit.listening($scope,'confirmAsnActionLocation',function(event,data){
                    $scope.confirmAsnAction.asnVOModel.locationComment = data.location.locationName;
                    $scope.confirmAsnAction.asnVOModel.locationId = data.location.locationId;
                    angular.forEach($scope.confirmAsnAction.asnVOModel.listAsnDetailVO,function(objData,index){
                        $scope.confirmAsnAction.asnVOModel.listAsnDetailVO[index].asnDetail.locationId = data.location.locationId;
                        $scope.confirmAsnAction.asnVOModel.listAsnDetailVO[index].locationComment = data.location.locationName;
                    });
                });
            } ,
            selectDetailLocation : function ($index) {
                commit.commitToParent($scope,'select_wareLocation_searchModel', {status:'confirmAsnActionDetailLocation'+$index ,location:{locationType:locationTypeTemp}});
                var on = commit.listening($scope,'confirmAsnActionDetailLocation'+$index,function(event,data){
                    $scope.confirmAsnAction.asnVOModel.listAsnDetailVO[$index].locationComment = data.location.locationName;
                    $scope.confirmAsnAction.asnVOModel.listAsnDetailVO[$index].asnDetail.locationId = data.location.locationId;
                    on();
                });
            } ,
            confirmAsn : function () {
                $scope.confirmAsnAction.asnVOModel.listSavetAsnDetail = [];
                angular.forEach($scope.confirmAsnAction.asnVOModel.listAsnDetailVO,function(data,index){
                    $scope.confirmAsnAction.asnVOModel.listSaveAsnDetail.push(data.asnDetail);
                });
                httpServer.postData(url.completeASN_url,$scope.confirmAsnAction.asnVOModel).then(function(res){
                    if ( res != 'error' ) {
                        // 进入收货确认页面
                        tooltip("收货确认成功");
                        // $scope.btnAction.backToIndex();
                        $scope.btnAction.MakeSureGetGoodsBtn();
                    }
                });
            }
        };
        $scope.batchConfirmAsnAction = {
            asnVOModel : new AsnVO() ,
            init : function () {
                $scope.batchConfirmAsnAction.asnVOModel = new AsnVO();
            } ,
            selectOpPerson : function () {
                commit.commitToParent($scope,'select_users_searchModel','batchConfirmAsnActionOpPerson');
                commit.listening($scope,'batchConfirmAsnActionOpPerson',function(event,data){
                    $scope.batchConfirmAsnAction.asnVOModel.asn.opPerson = data.entity.userId;
                    $scope.batchConfirmAsnAction.asnVOModel.opPersonComment = data.entity.userName;
                });
            } ,
            selectLocation : function () {
                commit.commitToParent($scope,'select_wareLocation_searchModel',{status:'batchConfirmAsnActionLocation' ,location:{locationType:locationTypeTemp}});
                commit.listening($scope,'batchConfirmAsnActionLocation',function(event,data){
                    $scope.batchConfirmAsnAction.asnVOModel.locationComment = data.location.locationName;
                    $scope.batchConfirmAsnAction.asnVOModel.locationId = data.location.locationId;
                });
            } ,
            batchConfirmAsn : function () {
                httpServer.postData(url.batchASN_url,$scope.batchConfirmAsnAction.asnVOModel).then(function(res){
                    if ( res != 'error' ) {
                        // 进入收货确认页面
                        tooltip("收货确认成功");
                        $('#bulkGoodsModal').modal('hide');
                        $scope.searchAsnAction.searchAsn();
                    }
                });
            }
        };

        $scope.viewAsnAction = {
            asnVOModel : new AsnVO() ,
            detailIndex : 0 ,
            selectTr : function (index) {
                $scope.viewAsnAction.detailIndex = index;
            }
        };




        $scope.clearSelect = function () {
            $scope.searchAsnAction.selectedItems[0]=false;
            return $scope.searchAsnAction.selectedItems[0];
        }

        //按钮操作页面
        var showTitle=['新增ASN单','修改ASN单'];
        $scope.btnAction={
            showText:{
                firstTitle:showTitle[0]
            },
            showAddOrModify:false,
            showSplitAsn:false,
            showIndex:true,
            showImport:false,
            addAsn:function(){ //点击切换新增ASN页面
                $scope.addAsnAction.init();
                this.showText.firstTitle=showTitle[0];
                this.showAddOrModify=!this.showAddOrModify;
                this.showIndex=!this.showIndex;
            } ,
            modifyAsn:function(){//点击切换修改ASN页面
                if ( !$scope.searchAsnAction.selectedItems || $scope.searchAsnAction.selectedItems.length == 0 ) {
                    tooltip(err.err_asn_update_notSelected);
                    return ;
                }
                var asnIds = [];
                for( var i = 0 ; i < $scope.searchAsnAction.selectedItems.length ; i++ ) {
                    if ( !$scope.searchAsnAction.selectedItems[i]
                        || $scope.searchAsnAction.selectedItems[i] == false
                        || $scope.searchAsnAction.listAsn.length <= i ) {
                        continue;
                    }
                    var recAsnVO = $scope.searchAsnAction.listAsn[i];
                    if ( recAsnVO.asn.asnStatus != asnStatus.OPEN ) {
                        tooltip(err.err_rec_asn_update_statusNotOpen);
                        return ;
                    }
                    asnIds.push(recAsnVO.asn.asnId);
                }
                if ( asnIds.length == 0 ) {
                    tooltip(err.err_asn_update_notSelected);
                    return ;
                } else if ( asnIds.length > 1 ) {
                    tooltip(err.err_asn_selectOne);
                    return;
                }
                httpServer.postData(url.viewASN_url,asnIds[0]).then(function(res){
                    if ( res != 'error' ) {
                        // 进入修改页面
                        $scope.addAsnAction.addAsnModel = res;
                        $scope.btnAction.showAddOrModify=!$scope.btnAction.showAddOrModify;
                        $scope.btnAction.showIndex=!$scope.btnAction.showIndex;
                        $scope.addAsnDetailAction.addAsnDetailModel = new AsnDetailVO();
                        $scope.btnAction.showText.firstTitle=showTitle[1];
                        if ( res.asn.docType && res.asn.docType != null ) {
                            $scope.addAsnAction.addAsnModel.asn.docType = res.asn.docType.toString();
                        }
                        $scope.addAsnAction.addAsnDetailListModel = [];
                        angular.forEach($scope.addAsnAction.addAsnModel.listAsnDetailVO,function(data,index){
                            $scope.addAsnAction.addAsnDetailListModel.push(objectAction.newCopy($scope.addAsnAction.addAsnModel.listAsnDetailVO[index]));
                        });
                    }
                });
            } ,
            splitAsn:function(){//点击切换拆分ASN页面
                if ( !$scope.searchAsnAction.selectedItems || $scope.searchAsnAction.selectedItems.length == 0 ) {
                    tooltip(err.err_asn_split_notSelected);
                    return ;
                }
                var asnIds = [];
                for( var i = 0 ; i < $scope.searchAsnAction.selectedItems.length ; i++ ) {
                    if ( !$scope.searchAsnAction.selectedItems[i]
                        || $scope.searchAsnAction.selectedItems[i] == false
                        || $scope.searchAsnAction.listAsn.length <= i ) {
                        continue;
                    }
                    var recAsnVO = $scope.searchAsnAction.listAsn[i];

                    if ( recAsnVO.asn.asnStatus != asnStatus.OPEN ) {
                        tooltip(err.err_rec_asn_split_statusNotOpen);
                        return ;
                    }
                    asnIds.push(recAsnVO.asn.asnId);
                }
                if ( asnIds.length == 0 ) {
                    tooltip(err.err_asn_split_notSelected);
                    return ;
                } else if ( asnIds.length > 1 ) {
                    tooltip(err.err_asn_selectOne);
                    return;
                }
                httpServer.postData(url.viewASN_url,asnIds[0]).then(function(res){
                    if ( res != 'error' ) {
                        // 进入拆分页面
                        $scope.splitAsnAction.asnVOModel = res;
                        angular.forEach($scope.splitAsnAction.asnVOModel.listAsnDetailVO,function(data,index){
                            $scope.splitAsnAction.asnVOModel.listAsnDetailVO[index].splitQty = $scope.splitAsnAction.asnVOModel.listAsnDetailVO[index].asnDetail.orderQty;
                            $scope.splitAsnAction.asnVOModel.listAsnDetailVO[index].splitWeight = $scope.splitAsnAction.asnVOModel.listAsnDetailVO[index].asnDetail.orderWeight;
                            $scope.splitAsnAction.asnVOModel.listAsnDetailVO[index].splitVolume = $scope.splitAsnAction.asnVOModel.listAsnDetailVO[index].asnDetail.orderVolume;
                        });
                        $scope.splitAsnAction.pageListAsnDetailVO = res.listAsnDetailVO;
                        $scope.btnAction.showIndex=!$scope.btnAction.showIndex;
                        $scope.btnAction.showSplitAsn=!$scope.btnAction.showSplitAsn;
                    }
                });
            } ,
            searchModel:function(id){
                $('#'+id).modal('show');
            } ,
            showMakeSureGetGoods:false,
            MakeSureGetGoodsBtn:function(){
                //点击切换收货确认
                if ( !$scope.searchAsnAction.selectedItems || $scope.searchAsnAction.selectedItems.length == 0 ) {
                    tooltip(err.err_asn_confirm_notSelected);
                    return ;
                }
                var asnIds = [];
                for( var i = 0 ; i < $scope.searchAsnAction.selectedItems.length ; i++ ) {
                    if ( !$scope.searchAsnAction.selectedItems[i]
                        || $scope.searchAsnAction.selectedItems[i] == false
                        || $scope.searchAsnAction.listAsn.length <= i ) {
                        continue;
                    }
                    var recAsnVO = $scope.searchAsnAction.listAsn[i];
                    if ( recAsnVO.asn.asnStatus != asnStatus.ACTIVE ) {
                        tooltip(err.err_rec_asn_confirm_statusNotActive);
                        return ;
                    }
                    asnIds.push(recAsnVO.asn.asnId);
                }
                if ( asnIds.length == 0 ) {
                    tooltip(err.err_asn_comfirm_notSelected);
                    return ;
                } else if ( asnIds.length > 1 ) {
                    tooltip(err.err_asn_selectOne);
                    return;
                }
                httpServer.postData(url.viewASN_url,asnIds[0]).then(function(res){
                    if ( res != 'error' ) {
                        // 进入收货确认页面
                        $scope.confirmAsnAction.asnVOModel = res;
                        angular.forEach($scope.confirmAsnAction.asnVOModel.listAsnDetailVO,function(data,index){
                            $scope.confirmAsnAction.asnVOModel.listAsnDetailVO[index].asnDetail.receiveQty = $scope.confirmAsnAction.asnVOModel.listAsnDetailVO[index].asnDetail.orderQty;
                            $scope.confirmAsnAction.asnVOModel.listAsnDetailVO[index].asnDetail.receiveWeight = $scope.confirmAsnAction.asnVOModel.listAsnDetailVO[index].asnDetail.orderWeight;
                            $scope.confirmAsnAction.asnVOModel.listAsnDetailVO[index].asnDetail.receiveVolume = $scope.confirmAsnAction.asnVOModel.listAsnDetailVO[index].asnDetail.orderVolume;
                        });
                        if ( $scope.confirmAsnAction.asnVOModel.listAsnDetailVO.length > 0 ) {
                            $scope.confirmAsnAction.currentSelectItems = 0 ;
                            $scope.confirmAsnAction.selectedItems[0] = true ;
                        }
                        $scope.btnAction.showMakeSureGetGoods=!$scope.btnAction.showMakeSureGetGoods;
                        $scope.btnAction.showIndex=!$scope.btnAction.showIndex;
                    }
                });
            },
            showAsnDetail:false,
            showDetail:function(id){
                httpServer.postData(url.viewASN_url,id).then(function(res){
                    if ( res != 'error' ) {
                        // 进入修改页面
                        $scope.viewAsnAction.asnVOModel = res;
                        $scope.btnAction.showAsnDetail=true;
                        $scope.btnAction.showIndex=false;
                    }
                });

            },
            showAsnDetailActionGetData:function(id){
                this.showAsnDetailAction();
                //而后进行查询数据绑定
                console.log(id);
            } ,
            backToIndex : function () {
                $scope.btnAction.showIndex=true;
                $scope.btnAction.showAddOrModify = false;
                $scope.btnAction.showSplitAsn = false;
                $scope.btnAction.showImport = false;
                $scope.btnAction.showAsnDetail = false;
            },
            showImportPg:function(){
                this.showIndex=!this.showIndex;
                this.showImport=!this.showImport;
            }
        }
    }]);

