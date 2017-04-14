
'use strict';
module.exports = angular.module("app.storeMgmt")
    .controller("deliveryGoodMgmtCtrl",
        ['$scope','tooltip','modifyById','arrayAction','httpServer','objectAction','scrollObj','commit',
        function($scope,tooltip,modifyById,arrayAction,httpServer,objectAction,scrollObj,commit) {
    var showTitle=['新增发货单','修改发货单'];

    //Url
    $scope.searchUrl = "/delivery/qryPageList";
    var url = {
        'addAndUpdate':'/delivery/addAndUpdate',
        'saveAndEnable':'/delivery/saveAndEnable',
        'view':'/delivery/view',
        'active': '/delivery/active',
        'disable':'/delivery/disable',
        'cancel':'/delivery/cancel',
        'loadConfirm':'/delivery/loadConfirm',
        'split':'/delivery/split',
        'qryPickLocations':'/delivery/qryPickLocations',
        'createPick':'/pick/addAndUpdate'
    };

    //状态
    var status = {
        'OPEN':10,
        'ENABLE':20,
        'PARTPICK':90,
        'ALLPICK':91,
        'CANCAL':99
    };

    //获取初始参数数据  这里可以继续get请求
    httpServer.postData('/param/show',['SENDSTATUS','DELIVERYTYPE','LOADCONFIRM']).then(function(res){
          $scope.getOriginData = res;
     });
    $scope.DeliverypageModelQuery = {};
    $scope.selectById={
        idArray:[],
        itemArray:[]
    };
            var _addModifyReqParam={
                "sendDelivery":{
                    "deliveryId":'', //发货单id
                    "deliveryNo":'',
                    "srcNo":'',//源单号
                    "owner":'',//货主
                    "sender":'',//发货方
                    "receiver":'',//收货方
                    "deliveryNo1":'',//相关单号1
                    "deliveryNo2":'',//相关单号2
                    "docType":"",//单据类型
                    "orderTime":"",//订单时间
                    "dataFrom":'',//
                    "contactPerson":'',//联系人
                    "contactAddress":'',//联系地址
                    "contactPhone":'',//联系电话
                    "province":'',//省份
                    "city":'',//城市
                    "county":'',//区县
                    "note":''//备注
                },
                'ownerName':'',
                'senderName':'',
                'receiverName':'',
                "deliveryDetailVoList":[]
            };
    var old_addModifyReqParam={};
   $scope.parseInt=function(item){
       return parseInt(item);
   }
    //选择
    $scope.searchAction = {
        selectedItems : [] , // 列表中选中的记录
        selectedAll : false , // 全选按钮默认不选中
        currentSelectItem : 9999 ,
        pageData:[],
        // 多选复选框
        chkSelectAll:function (flag) {
            if ( $scope.searchAction.pageData.length>0 ) {
                angular.forEach($scope.searchAction.pageData,function(data,index){
                    if(flag){
                        $scope.searchAction.selectedItems[index]=true;
                    }else{
                        $scope.searchAction.selectedItems[index]=false;
                    }
                });
            }
        } , // 多选复选框 end
        // 选中单选框
        selectOne:function(index,$event){
            this.currentSelectItem=index;
            //点击进行是否选择操作
            $scope.searchAction.selectedItems[index]= !$scope.searchAction.selectedItems[index];
            // 如果该点击项不是选中状态就将全部选中状态去掉
            $scope.searchAction.selectedAll=false;
            var allCheck = true;
            angular.forEach($scope.searchAction.pageData,function(data,index){
                if(!$scope.searchAction.selectedItems[index]){
                    allCheck = false;
                    return false;
                }
            });
            if ( allCheck ) {
                $scope.searchAction.selectedAll=true;
            }
        } , // 选中单选框 end
        isSelect:function(element){
            return element;
        },
        //检查是否选中一个
        isSelectOne:function(){
            if ($scope.searchAction.selectedItems.filter($scope.searchAction.isSelect).length == 0) {
                tooltip("请选择一个记录");
                return false;
            }

            if($scope.searchAction.selectedItems.filter($scope.searchAction.isSelect).length > 1){
                tooltip("您只能选择一项！");
                return false;
            }
            return true;
        },
        //选中的项
        selectedItem:function(){
            for(var i=0;i<$scope.searchAction.selectedItems.length;i++){
                if($scope.searchAction.selectedItems[i]){
                    return $scope.searchAction.pageData[i];
                }
            }
        },
        clear:function(){
            $scope.searchAction.selectedItems = [];
            $scope.searchAction.selectedAll = false;
            $scope.searchAction.pageData = [];
        }

    };

            function pickVo(){
                this.sendPick = {
                    "pickId":'',
                    "owner":'',
                    "pickStatus":'',
                    "orgId":'',
                    "parentId":'',
                    "warehouseId":'',
                    "receiptNo":'',
                    "docType":'',
                    "createPerson":'',
                    "updatePerson":'',
                    "deliveryId":'',
                    "waveId":'',
                    "pickNo":'',
                    "opPerson":'',
                    "opTime":'',
                    "planPickQty":'',
                    "planPickWeight":'',
                    "planPickVolume":'',
                    "realPickQty":'',
                    "realPickWeight":'',
                    "realPickVolume":'',
                    "pickId2":'',
                    "remark":''
                };
                this.deliveryNo ='';
                this.waveNo ='';
                this.ownerName='';
                this.statusComment = "";
                this.docTypeComment = "";
                this.opPersonName = '';
                this.sendPickDetailVoList = [];
            };

            $scope.pickVo = {};

    $scope.btnAction={
        showText:{
            firstTitle:showTitle[0]
        },
        showAddOrModify:false,
        showSplitAsn:false,
        showIndex:true,
        AddOrModify:function(){  //单独操作 是否显示新增或修改
            this.showAddOrModify=!this.showAddOrModify;
            this.showIndex=!this.showIndex;
            $scope.selectById={
                idArray:[],
                itemArray:[]
            };//page重新更新数据了 所以要重新滞空
            $("#deliveryConfirm").modal('hide');
        },
        addAsn:function(){ //点击切换新增ASN页面
            this.showText.firstTitle=showTitle[0]; //将显示页面显示为新增
            this.AddOrModify();
            //需要绑定的新的货品明细列表
            //新增 修改页面操作
            angular.copy(_addModifyReqParam,$scope.addModifyReqParam);
            $scope.deliveryDetailVolist=new deliveryDetailVolist();
            old_addModifyReqParam=objectAction.newCopy(_addModifyReqParam);
        },
        modify:function(){//点击切换修改ASN页面
            if(!$scope.searchAction.isSelectOne()){
                return;
            }
            var item  = $scope.searchAction.selectedItem();
            //打开状态才能修改
            if(item.sendDelivery.deliveryStatus != status.OPEN){
                tooltip('需选择状态为打开的记录进行修改！');
                return;
            };
            httpServer.postData(url.view,item).then(function(res){
                        if(res!='error'&&res!='errorId') {
                            //跳转 并绑定数据
                            $scope.addModifyReqParam = res;
                            if(res.sendDelivery.docType && res.sendDelivery.docType != null){
                                $scope.addModifyReqParam.sendDelivery.docType = res.sendDelivery.docType.toString();
                            }
                            old_addModifyReqParam = objectAction.newCopy(res);
                            $scope.btnAction.showText.firstTitle = showTitle[1];
                            $scope.btnAction.AddOrModify();
                        }
             });

            // if($scope.selectById.itemArray.length===1){
            //     var obj=$scope.selectById.itemArray[0];
            //     if(obj.sendDelivery.deliveryStatus!==status){
            //         tooltip('需选择状态为打开的项目进行生效！');
            //         return;
            //     }
            // };
            // var d=httpServer.postData('/wms/modify/',id);
            //
            // d.then(function(res){
            //     if(res!='error'&&res!='errorId'){
            //         //跳转 并绑定数据
            //         console.log(res.data.list);
            //
            //         $scope.addModifyReqParam=res;
            //         old_addModifyReqParam=objectAction.newCopy(res);
            //         $scope.btnAction.showText.firstTitle=showTitle[1];
            //         $scope.btnAction.AddOrModify();
            //     }
            // });
        },
        //生效按钮操作
        takeEffect:function(){
            if(!$scope.searchAction.isSelectOne()){
                return;
            }
            var item  = $scope.searchAction.selectedItem();
            //打开状态才能生效
            if(item.sendDelivery.deliveryStatus != status.OPEN){
                tooltip('需选择状态为打开的记录进行生效！');
                return;
            }else{
                httpServer.postData(url.active,item).then(function(res){
                    if(res!='error'){
                        $scope.searchAction.clear();
                        $scope.searchformAction.search();
                        $scope.pickVo = new pickVo();
                        $scope.pickVo.sendPick.deliveryId = item.sendDelivery.deliveryId;
                        $("#pickConfirm").modal('show');
                    }
                    // tooltip("生效成功！");
                });
            }

        },
        //自动生成拣货单
        autoCreatePick:function(){
            httpServer.postData(url.createPick,$scope.pickVo).then(function(res){
                if(res!='error'&&res!='errorId') {
                    tooltip("生成拣货单成功");
                    $("#pickConfirm").modal('hide');
                }
            });
        },
        //失效
        loseEffect:function(){
            if(!$scope.searchAction.isSelectOne()){
                return;
            }
            var item  = $scope.searchAction.selectedItem();
            //打开状态才能生效
            if(item.sendDelivery.deliveryStatus != status.ENABLE){
                tooltip('需选择状态为生效的记录进行失效！');
                return;
            }else{
                httpServer.postData(url.disable,item).then(function(res){
                    if(res!='error'&&res!='errorId') {
                        $scope.searchAction.clear();
                        $scope.searchformAction.search();
                        tooltip("失效成功！");
                    }
                });
            }
        },
        //取消
        cancel:function(){
            if(!$scope.searchAction.isSelectOne()){
                return;
            }
            var item  = $scope.searchAction.selectedItem();
            //打开状态才能生效
            if(item.sendDelivery.deliveryStatus != status.OPEN){
                tooltip('需选择状态为打开的记录进行取消！');
                return;
            }else{
                httpServer.postData(url.cancel,item).then(function(res){
                    if(res!='error'&&res!='errorId') {
                        $scope.searchAction.clear();
                        $scope.searchformAction.search();
                        tooltip("取消成功！");
                    }
                });
            }
        },
        splitAsn:function(){//点击切换拆分ASN页面
            if(!$scope.searchAction.isSelectOne()){
                return;
            }
            var item  = $scope.searchAction.selectedItem();
            //打开状态才能生效
            if(item.sendDelivery.deliveryStatus != status.OPEN){
                tooltip('需选择状态为打开的记录进行拆分！');
                return;
            }else{
                httpServer.postData(url.view,item).then(function (res) {
                    if(res!='error'&&res!='errorId') {
                        $scope.DeliveryGoodSplitItem=res;
                        split($scope.DeliveryGoodSplitItem);
                        $scope.btnAction.showIndex=!$scope.btnAction.showIndex;
                        $scope.btnAction.showSplitAsn=!$scope.btnAction.showSplitAsn;
                    }
                    // console.log(res);
                })
            }

            function split(obj){
                $scope.deliverySplitAction.datas =objectAction.newCopy(_deliverySplitForm);
                $scope.deliverySplitAction.datas.sendDelivery.deliveryId=obj.sendDelivery.deliveryId;
                //重新绑定需要修改的内容obj
                angular.forEach(obj.deliveryDetailVoList,function(data,index){
                    $scope.deliverySplitAction.datas.deliveryDetailVoList.push(objectAction.newCopy(data));
                });
            }
        },
        searchModel:function(id){
            $('#'+id).modal('show');
        },
        showAsnDetail:false,
        showAsnDetailAction:function(){
            this.showAsnDetail=!this.showAsnDetail;
            this.showIndex=!this.showIndex;

        },
        view:function(id){
            $scope.addModifyReqParam.sendDelivery.deliveryId = id;
            httpServer.postData(url.view,$scope.addModifyReqParam).then(function(res){
                //而后进行查询数据绑定
                $scope.addModifyReqParam = res;
                $scope.btnAction.showAsnDetailAction();

            });
        },
        pickLocations:[],
        viewPickLocations:function(datas){
            $scope.btnAction.pickLocations = datas;
        },
        slectOnly:function(item,_select,itemObj){
            arrayAction.selectedById(item,_select,itemObj,$scope.selectById);
        }
    }

    //查询 重置按钮设置
    $scope.deliveryGoodreqParam={ //个字段的顺序和前端显示顺序要一致 方便下步复用
        "sendDelivery":{
            "deliveryNo":"",// 发货单号
            "srcNo":"",//原单号
            "deliveryStatus":''//状态
        },
        "ownerName":""//货主
    };
    var _deliveryGoodreqParam={
        "sendDelivery":{
            "deliveryNo":"",// 发货单号
            "srcNo":"",//原单号
            "deliveryStatus":''//状态
        },
        "ownerName":""//货主
    };
    //开始查询页面
    $scope.searchformAction={
        search:function(){
            // if(!angular.equals($scope.deliveryGoodreqParam,_deliveryGoodreqParam)){
                //开始查询 即与绑定的page指令的查询端口进行双向数据绑定
                $scope.searchAction.pageData = [];
                var _pageModelQuery={};
                angular.copy($scope.deliveryGoodreqParam,_pageModelQuery);
                $scope.DeliverypageModelQuery=_pageModelQuery;
            // }
        },
        reset:function(){
            angular.copy(_deliveryGoodreqParam,$scope.deliveryGoodreqParam);
        }
    };
            //需要绑定的新的货品明细列表
        $scope.addModifyReqParam={
            "sendDelivery":{
                "deliveryId":'', //发货单id
                "deliveryStatus":'',//发货单状态
                "deliveryNo":'',
                "srcNo":'',//源单号
                "owner":'',//货主
                "sender":'',//发货方
                "receiver":'',//收货方
                "deliveryNo1":'',//相关单号1
                "deliveryNo2":'',//相关单号2
                "docType":"",//单据类型
                "orderTime":"",//订单时间
                "dataFrom":'',//
                "contactPerson":'',//联系人
                "contactAddress":'',//联系地址
                "contactPhone":'',//联系电话
                "province":'',//省份
                "city":'',//城市
                "county":'',//区县
                "note":''//备注
            },
            'ownerName':'',
            'docTypeComment':'',
            "deliveryDetailVoList":[]
        };
        //在storeMgmt的选择客商改变  就进行数据绑定
        $scope.$watch('selectedMerchant',function(newV,oldV){
            if(newV){
                $scope.addModifyReqParam.ownerName=newV.merchantName;
                $scope.addModifyReqParam.sendDelivery.owner=newV.merchantId;
                //console.log($scope.addModifyReqParam);
            };
        },true);
        //货品明细的表单数据绑定
            function deliveryDetailVolist(){
                this.deliveryDetail={
                    "deliveryDetailId":'',
                    "deliveryId":'',//发货单id
                    "skuId":"", //货品id
                    "batchNo":"",// 批次
                    "orderQty":0,//数量
                    "orderWeight":0,// 公斤
                    "orderVolume":0, //立方
                    "measureUnit":''//计量单位
                };
                this.skuNo='';
                this.skuName='';
                this.specModel='';
            }
            $scope.deliveryDetailVolist={
                "deliveryDetail":{
                    "deliveryDetailId":'',
                    "deliveryId":'',//发货单id
                    "skuId":"", //货品id
                    "batchNo":"",// 批次
                    "orderQty":'',//数量
                    "orderWeight":'',// 公斤
                    "orderVolume":'', //立方
                    "measureUnit":''//计量单位
                },
                "skuNo":"",//货品代码
                "skuName":"",//货品名称
                "specModel":'',//规格型号
                "pickQty":'',//拣货数量
                "pickWeight":'',//拣货重量
                "pickVolume":''//拣货体积
            };
            var _deliveryDetailVo={
                "deliveryDetail":{
                    "deliveryDetailId":'',
                    "deliveryId":'',//发货单id
                    "skuId":"", //货品id
                    "batchNo":"",// 批次
                    "orderQty":0,//数量
                    "orderWeight":0,// 公斤
                    "orderVolume":0, //立方
                    "measureUnit":''//计量单位
                },
                "skuNo":"",//货品代码
                "skuName":"",//货品名称
                "specModel":'',//规格型号
                "pickQty":'',//拣货数量
                "pickWeight":'',//拣货重量
                "pickVolume":''//拣货体积
            }
            $scope.$watch('selectedGoods',function(newV){ //检测是否 选择了货品
                if(newV){
                     $scope.deliveryDetailVolist= $.extend(true,{}, $scope.deliveryDetailVolist,newV);//递归拷贝深合并
                };
            },true);
            // 检测输入数量 及进行自动填充公斤 立方
            $scope.$watch("deliveryDetailVolist.deliveryDetail.orderQty",function(newV,oldV){ //检测是否 选择了货品
                if(newV!=oldV){
                    if($scope.deliveryDetailVolist.perWeight){
                        $scope.deliveryDetailVolist.deliveryDetail.orderWeight=$scope.deliveryDetailVolist.perWeight * newV;
                    }
                    if($scope.deliveryDetailVolist.perVolume){
                        $scope.deliveryDetailVolist.deliveryDetail.orderVolume=$scope.deliveryDetailVolist.perVolume * newV;
                    }
                };
            },true);
            //发货单明星操作
            $scope.deliveryDetailAction={
                tooltipIsOpen:false,
                selectedAll:false,
                selectedGoodItems:[],//选择货品项目
                selectAll:function(){ //进行全选操作
                    if($scope.deliveryDetailAction.selectedGoodItems.length>0){
                        angular.forEach($scope.deliveryDetailAction.selectedGoodItems,function(data,index){
                            if($scope.deliveryDetailAction.selectedAll){
                                $scope.deliveryDetailAction.selectedGoodItems[index]=true;
                            }else{
                                $scope.deliveryDetailAction.selectedGoodItems[index]=false;
                            }
                        });
                    }
                },
                addList:function(item){
                    if(item.skuNo.$invalid){//判断货品代码是否为空
                        this.tooltipIsOpen=true;
                        setTimeout(function(){
                            $scope.deliveryDetailAction.tooltipIsOpen=false;// 消失提示和弹出
                            $scope.$apply();
                        },2000)
                        return;
                    }
                    if(item.orderQty.$invalid){ //判断数量是否为空
                        $("#input_orderQty").focus();
                    }else{
                        //遍历数组查找  货品id和批次是否一致
                        var _canPush=true;
                        angular.forEach($scope.addModifyReqParam.deliveryDetailVoList,function(data,index){
                           if(data.deliveryDetail.skuId==$scope.deliveryDetailVolist.deliveryDetail.skuId&&data.deliveryDetail.batchNo==$scope.deliveryDetailVolist.deliveryDetail.batchNo){
                                _canPush=false;
                                tooltip('货品代码和批次不能同时重复！');
                           }
                        });
                        if(_canPush){
                            $scope.addModifyReqParam.deliveryDetailVoList.push(objectAction.newCopy($scope.deliveryDetailVolist));
                            $scope.deliveryDetailAction.selectedGoodItems.push(false);
                            // 让当前选中状态成为新增的这一条
                             $scope.deliveryDetailAction.currentSelectGoodItems=$scope.deliveryDetailAction.selectedGoodItems.length-1;
                        }
                        $scope.deliveryDetailVolist = objectAction.newCopy(_deliveryDetailVo);
                    }
                },
                currentSelectGoodItems:'9999',
                selectModify:function(index,$event){
                    this.currentSelectGoodItems=index;
                    //点击进行是否选择操作
                    $scope.deliveryDetailAction.selectedGoodItems[index]=!$scope.deliveryDetailAction.selectedGoodItems[index];

                    // 如果该点击项不是选中状态就将全部选中状态去掉
                    $scope.deliveryDetailAction.selectedAll=true;
                    angular.forEach($scope.deliveryDetailAction.selectedGoodItems,function(data){
                        if(!data){
                            $scope.deliveryDetailAction.selectedAll=false;
                        }
                    });
                    //实现输入额数据绑定
                    $scope.deliveryDetailVolist=objectAction.newCopy($scope.addModifyReqParam.deliveryDetailVoList[index]);
                    $event.stopPropagation();
                },
                //货品明细删除列表
                DeleteItem:function(){
                    var _deliveryDetailVoList=[];
                    angular.forEach($scope.deliveryDetailAction.selectedGoodItems,function(data,index){
                        if(!data){
                            _deliveryDetailVoList.push($scope.addModifyReqParam.deliveryDetailVoList[index]);
                        }
                    });
                    $scope.addModifyReqParam.deliveryDetailVoList=_deliveryDetailVoList;
                    $scope.deliveryDetailAction.selectedGoodItems=[];
                    angular.forEach($scope.addModifyReqParam.deliveryDetailVoList,function(data,index){
                        $scope.deliveryDetailAction.selectedGoodItems[index]=false;
                    });
                    $scope.deliveryDetailAction.selectedAll=false;
                },
                selectModifyMakeSure:function(item){
                    var _index=this.currentSelectGoodItems;
                    if(_index>='9999'){
                        return;
                    }
                    if(item.orderQty.$invalid){ //判断数量是否为空
                        $("#input_orderQty").focus();
                        return;
                    }
                    var _canPush=true;
                    //不能与自己比对
                    angular.forEach($scope.addModifyReqParam.deliveryDetailVoList,function(data,index){
                        if($scope.deliveryDetailAction.currentSelectGoodItems!=index){
                            if(data.deliveryDetail.skuId==$scope.deliveryDetailVolist.deliveryDetail.skuId&&data.deliveryDetail.batchNo==$scope.deliveryDetailVolist.deliveryDetail.batchNo){
                                _canPush=false;
                                tooltip('货品代码和批次不能同时重复！');
                            }
                        }

                    });
                    if(_canPush){
                        $scope.addModifyReqParam.deliveryDetailVoList.splice(_index,1,objectAction.newCopy($scope.deliveryDetailVolist));
                    }
                    $scope.deliveryDetailVolist = objectAction.newCopy(_deliveryDetailVo);

                }
            };

            //新增修改 里 暂存  保存并生效 返回 按钮操作
            function checkout(item){
                if($scope.addModifyReqParam.sendDelivery.docType==''){//判断 单据类型是否为空
                    scrollObj.scrollTo('select#docType');
                    $scope.addModifyBtnAction.tooltipIsOpen=true;
                    setTimeout(function(){
                        $scope.addModifyBtnAction.tooltipIsOpen=false;// 消失提示和弹出
                        $scope.$apply();
                    },2000);
                    return false;
                }
                if(item.sendDeliveryOrderTime.$invalid){ //判断数量是否为空
                    scrollObj.scrollTo('input#sendDeliveryOrderTime');
                    $scope.addModifyBtnAction.tooltipIsOpen=true;
                    setTimeout(function(){
                        $scope.addModifyBtnAction.tooltipIsOpen=false;// 消失提示和弹出
                        $scope.$apply();
                    },2000);
                    return false;
                }
                if($scope.addModifyReqParam.sendDelivery.owner.$invalid){ //判断数量是否为空
                    scrollObj.scrollTo('input#ownerName');
                    $scope.addModifyBtnAction.tooltipIsOpen=true;
                    setTimeout(function(){
                        $scope.addModifyBtnAction.tooltipIsOpen=false;// 消失提示和弹出
                        $scope.$apply();
                    },2000);
                    return false;
                }
                return true;
            };

            $scope.addModifyBtnAction={
                selectOwner:function(){
                    commit.commitToParent($scope,'selectMerchantModel',{status:'addModifyBtnActionSelectOwner',isOwner:true})
                    var on = commit.listening($scope,'addModifyBtnActionSelectOwner',function(event,data){
                        $scope.addModifyReqParam.sendDelivery.owner = data.entity.merchantId;
                        $scope.addModifyReqParam.ownerName = data.entity.merchantName;
                        on();
                    })
                },
                selectSender:function(){
                    commit.commitToParent($scope,'selectMerchantModel',{status:'addModifyBtnActionSelectSender',isOwner:true})
                    var on = commit.listening($scope,'addModifyBtnActionSelectSender',function(event,data){
                        $scope.addModifyReqParam.sendDelivery.sender = data.entity.merchantId;
                        $scope.addModifyReqParam.senderName = data.entity.merchantName;
                        $scope.addModifyReqParam.sendDelivery.contactPerson =data.entity.contactPerson;
                        $scope.addModifyReqParam.sendDelivery.contactPhone =data.entity.contactPhone;
                        $scope.addModifyReqParam.sendDelivery.contactAddress =data.entity.contactAddress;
                        $scope.addModifyReqParam.sendDelivery.province =data.entity.province;
                        $scope.addModifyReqParam.sendDelivery.city =data.entity.city;
                        on();
                    })
                },
                selectReceiver:function(){
                    commit.commitToParent($scope,'selectMerchantModel',{status:'addModifyBtnActionSelectReceiver',isOwner:true})
                    var on = commit.listening($scope,'addModifyBtnActionSelectReceiver',function(event,data){
                        $scope.addModifyReqParam.sendDelivery.receiver = data.entity.merchantId;
                        $scope.addModifyReqParam.receiverName = data.entity.merchantName;
                        on();
                    })
                },
                selectGood:function(){
                    commit.commitToParent($scope,'searchGoodsModel','deliveryAddGoods')
                    var on = commit.listening($scope,'deliveryAddGoods',function(event,data){
                        if ( !data.entity.perVolume && data.entity.perVolume != null ) {
                            $scope.deliveryDetailVolist.perVolume = data.entity.perVolume;
                        } else {
                            $scope.deliveryDetailVolist.perVolume = 0;
                        }
                        if ( !data.entity.perWeight && data.entity.perWeight != null ) {
                            $scope.deliveryDetailVolist.perWeight = data.entity.perWeight;
                        } else {
                            $scope.deliveryDetailVolist.perWeight = 0;
                        }
                        $scope.deliveryDetailVolist.deliveryDetail.skuId = data.entity.skuId;
                        $scope.deliveryDetailVolist.deliveryDetail.measureUnit = data.entity.measureUnit;
                        $scope.deliveryDetailVolist.skuName = data.entity.skuName;
                        $scope.deliveryDetailVolist.specModel = data.entity.specModel;
                        $scope.deliveryDetailVolist.skuNo = data.entity.skuNo;
                        on();

                    })
                },
                tooltipIsOpen:false,
                temporarilySave:function(formName){
                    if(checkout(formName)){ //检验通过 就可以进行暂存操作

                        httpServer.postData(url.addAndUpdate,$scope.addModifyReqParam).then(function(res){
                            if(res!='error'&&res!='errorId') {
                                angular.copy(_addModifyReqParam, $scope.addModifyReqParam);
                                angular.copy(_addModifyReqParam,old_addModifyReqParam);
                                tooltip('暂存成功！');
                            }
                        })
                        //如果是第一次保存 就没有deliveryId
                        // if(!$scope.addModifyReqParam.sendDelivery.deliveryId||$scope.addModifyReqParam.sendDelivery.deliveryId==''){
                        //     //发送暂存新增id  进行滞空操作
                        //    httpServer.postData(url.addAndUpdate,$scope.addModifyReqParam).then(function(res){
                        //            if (res!='error'){
                        //                angular.copy(_addModifyReqParam, $scope.addModifyReqParam);
                        //                tooltip('暂存成功！');
                        //            }
                        //    })
                        // }
                        //现在是修改状态
                        // if($scope.addModifyReqParam.sendDelivery.deliveryId||$scope.addModifyReqParam.sendDelivery.deliveryId!=''){
                        //     //发送暂存新增id
                        //
                        //     httpServer.postData('/delivery/addAndUpdate',$scope.addModifyReqParam).then(function(res){
                        //         if (res!='error'){
                        //             tooltip('暂存成功！');
                        //         }
                        //     });
                        // }
                    }
                },
                saveEffectBack:function(formName){
                    if(checkout(formName)) { //检验通过 就可以进行暂存操作
                        httpServer.postData(url.saveAndEnable,$scope.addModifyReqParam).then(function(res){
                            console.log(res);
                            if (res!='error'){
                                tooltip('保存成功！');
                                $scope.btnAction.AddOrModify();
                            }

                        })
                    }
                },
                backToIndex:function(){
                    if(!angular.equals(old_addModifyReqParam,$scope.addModifyReqParam)){
                        $("#deliveryConfirm").modal('show');
                    }else{
                        $scope.btnAction.AddOrModify();
                    }

                    //新增
                    // if(!$scope.addModifyReqParam.sendDelivery.deliveryId||$scope.addModifyReqParam.sendDelivery.deliveryId==''){
                    //     //发送暂存新增id  进行滞空操作
                    //     if(!angular.equals(_addModifyReqParam,$scope.addModifyReqParam)){
                    //         $("#deliveryConfirm").modal('show');
                    //     }else{
                    //         $scope.btnAction.AddOrModify();
                    //     }
                    // };
                    // //现在是修改状态
                    // if($scope.addModifyReqParam.sendDelivery.deliveryId||$scope.addModifyReqParam.sendDelivery.deliveryId!=''){
                    //     //进行比对 判断用户是否对数据继续了修改
                    //     if(!angular.equals(_addModifyReqParam,$scope.addModifyReqParam)){
                    //         $("#deliveryConfirm").modal('show');
                    //     }else{
                    //         $scope.btnAction.AddOrModify();
                    //     }
                    // }


                }
            };

            var _deliverySplitVo={
                "sendDelivery":{
                    "deliveryId":""
                },
                "deliveryDetailVoList":[]
            };

            var _deliverySplitForm = {
                "sendDelivery":{
                    "deliveryId":""
                },
                "deliveryDetailVoList":[]
            }

            //拆分 需要绑定上传数据
            $scope.deliverySplitAction={
                datas:{
                    "sendDelivery":{
                      "deliveryId":""
                     },
                    "deliveryDetailVoList":[]

                },
                saveAndBack:function(){
                    httpServer.postData(url.split,$scope.deliverySplitAction.datas).then(function(res){
                        if(res!='error'&&res!='errorId') {
                          tooltip('拆分成功！');
                          $scope.btnAction.showIndex=!$scope.btnAction.showIndex;
                          $scope.btnAction.showSplitAsn=!$scope.btnAction.showSplitAsn;
                      }
                    })
                }


            };


            //装车确认操作
            $scope.loadGoodsConfirmData={
                "sendDelivery":{
                    "deliveryId":"",
                    "deliveryStatus":"",
                    "note":""
                }
            };
            $scope.loadGoodsConfirmBtnAction={

                selectLoadGoods:function(){

                    if(!$scope.searchAction.isSelectOne()){
                        return;
                    }
                    var item  = $scope.searchAction.selectedItem();
                    //部分拣货或者全部拣货的记录进行装车确认
                    if(item.sendDelivery.deliveryStatus != status.PARTPICK && item.sendDelivery.deliveryStatus != status.ALLPICK){
                        tooltip('需选择状态为部分拣货或者全部拣货的记录进行装车确认！');
                        return;
                    }else{
                        $scope.loadGoodsConfirmData.sendDelivery.deliveryId = item.sendDelivery.deliveryId;
                        $scope.btnAction.searchModel('loadGoodsConfirm');
                    }
                   //  console.log($scope.selectById.idArray);
                   //  if($scope.selectById.idArray.length>1){
                   //      tooltip('您只能选择一项进行装车确认！');
                   //      return;
                   //  };
                   // if($scope.selectById.idArray.length==0){
                   //     tooltip('您需要选择一项进行装车确认！');
                   //     return;
                   // }
                   //  $scope.btnAction.searchModel('loadGoodsConfirm');

                 },
                 makeSure:function(){
                     $scope.loadGoodsConfirmData.deliveryId=$scope.selectById.idArray[0];
                     httpServer.postData('/delivery/loadConfirm',$scope.loadGoodsConfirmData).then(function(res){
                         if(res!='error'&&res!='errorId') {
                             $scope.searchformAction.search();
                             tooltip('装车确认成功！');
                             $('#loadGoodsConfirm').modal('hide');
                         }
                     })
                 }
            }
}]).name;
/*
 *
 * Created by yangl on 2017/3/6.
 */
