
'use strict';
module.exports = angular.module("app.storeMgmt").controller("pickingMgmtCtrl",
    ['$scope','commit','tooltip','modifyById','arrayAction','httpServer','objectAction','$filter','scrollObj',
    function($scope,commit,tooltip,modifyById,arrayAction,httpServer,objectAction,$filter,scrollObj) {
    var showTitle=['新增拣货单','修改拣货单'];

    //获取初始参数数据  这里可以继续get请求
     httpServer.postData('/param/show',['PICKSTATUS','PICKTYPE']).then(function(res){
          $scope.getOriginData = res;
     });

        $scope.pickPageModelQuery = {};

     //Url
     $scope.searchUrl = "/pick/qryList";

        var url = {
            'addAndUpdate':'/pick/addAndUpdate',
            'saveAndEnable':'/pick/saveAndEnable',
            'view':'/pick/view',
            'active': '/pick/active',
            'disable':'/pick/disable',
            'abolish':'/pick/abolish',
            'autoAllocate':'/pick/autoAllocate',
            'split':'/pick/split',
            'removeSplit':'/pick/removeSplit',
            'confirm':'/pick/confirm',
            'qryDelList':'/delivery/qryListNotFinish',
            'qryWaveList':'/wave/qryNotFinishList',
            'viewDelivery':'/delivery/view',
            'viewWave':'/wave/view',
            'qryDelDetails':'/wave/qryDelDetails',
            'qryDetail':'/pick/qryDetail'
        };

        //状态
        var status = {
            'OPEN':10,
            'ENABLE':20,
            'WORKING':30,
            'FINISH':40,
            'CANCAL':99
        };

        var DOCTYPE = {
            'PICKTYPE_FORM_DELIVERY':'230',
            'PICKTYPE_FORM_WAVE':'240',
            'PICKTYPE_FORM_HANDLE':'250'
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

        }

        var _deliveryReqParam={
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

        function waveVo(){
            this.sendWave = {
                "waveId":'',
                "waveNo":'',
                "waveStatus":'',
                "orgId":'',
                "warehouseId":'',
                "orderQty":'',
                "orderWeight":'',
                "orderVolume":'',
                "deliveryAmount":'',
                "remark":'',
                "waveId2":''
            },
                this.sendDeliberyVoList = [],
                this.statusComment = '',
                this.totalQty = '',
                this.totalWeight = '',
                this.totalVolume = ''
        };

        $scope.searchAction = {
            selectedItems : [] , // 列表中选中的记录
            selectedAll : false , // 全选按钮默认不选中
            currentSelectItem : 9999 ,
            dataList:[],
            // 多选复选框
            chkSelectAll:function (flag) {
                if ( $scope.searchAction.dataList.length>0 ) {
                    angular.forEach($scope.searchAction.dataList,function(data,index){
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
                angular.forEach($scope.searchAction.dataList,function(data,index){
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
                    tooltip("您只能选择一项进行修改！");
                    return false;
                }
                return true;
            },
            //选中的项
            selectedItem:function(){
                for(var i=0;i<$scope.searchAction.selectedItems.length;i++){
                    if($scope.searchAction.selectedItems[i]){
                        return $scope.searchAction.dataList[i];
                    }
                }
            }

        };

        var old_data = {};

    $scope.btnAction={
        showText:{
            firstTitle:showTitle[0]
        },
        showAddOrModify:false,
        showSplitAsn:false,
        showIndex:true,
        addModShow:function(){
            this.showAddOrModify=!this.showAddOrModify;
            this.showIndex=!this.showIndex;
            $("#backConfirm").modal('hide');
        },
        newPick:function(){ //点击切换新增ASN页面
            //查询发货单
            var reqParam = {};
            httpServer.postData(url.qryDelList,reqParam).then(function (res) {
                if(res!='error'&& res!='errorId' && res != 'ok') {
                    $scope.newAndModifyAction.deliveryVoList = res;
                }
            });
            //查询波次单
            httpServer.postData(url.qryWaveList,reqParam).then(function (res) {
                if(res!='error'&& res!='errorId' && res != 'ok') {
                    $scope.newAndModifyAction.waveVoList = res;
                }
            });
            $scope.btnAction.showText.firstTitle=showTitle[0];
            $scope.newAndModifyAction.clear();
            this.addModShow();
        },
        modify:function(){//点击切换修改ASN页面
            //检查是否一个
            if(!$scope.searchAction.isSelectOne()){
                return;
            }
            //获取选中项
            var item  = $scope.searchAction.selectedItem();
            //检查状态打开
            if(item.sendPick.pickStatus != status.OPEN){
                tooltip('需选择状态为打开的记录进行修改！');
                return;
            }
            //查询发货单
            var reqParam = {};
            httpServer.postData(url.qryDelList,reqParam).then(function (res) {
                if(res!='error'&& res!='errorId' && res != 'ok') {
                    $scope.newAndModifyAction.deliveryVoList = res;
                }
            });
            //查询波次单
            httpServer.postData(url.qryWaveList,reqParam).then(function (res) {
                if(res!='error'&& res!='errorId' && res != 'ok') {
                    $scope.newAndModifyAction.waveVoList = res;
                }
            });
            //查询拣货单
            httpServer.postData(url.view,item).then(function (res) {
                if(res!='error'&& res!='errorId') {
                    $scope.newAndModifyAction.pickVo = res;
                    if(res.sendPick.docType){
                        $scope.newAndModifyAction.pickVo.sendPick.docType = res.sendPick.docType.toString();
                    }
                    old_data = objectAction.newCopy(res);
                    $scope.newAndModifyAction.pickDetailVoList =  $scope.newAndModifyAction.pickVo.sendPickDetailVoList;
                    var hasFlag = false;
                    if($scope.newAndModifyAction.pickVo.sendPick.docType.toString() == DOCTYPE.PICKTYPE_FORM_DELIVERY){
                        var id = $scope.newAndModifyAction.pickVo.sendPick.deliveryId;
                        angular.forEach($scope.newAndModifyAction.deliveryVoList,function(data,index){
                            if(data.sendDelivery.deliveryId == id){
                                $scope.newAndModifyAction.deliveryVoList[index].display = true;
                                hasFlag = true;
                            }
                        });
                        //把发货单添加到发货单列表
                        if(!hasFlag){
                            //查询原发货单
                            var _param = objectAction.newCopy(_deliveryReqParam);
                            _param.sendDelivery.deliveryId = id;
                            httpServer.postData(url.viewDelivery,_param).then(function(re){
                                re.display = true;
                                $scope.newAndModifyAction.deliveryVoList.push(re);
                            })
                        }
                    }else if($scope.newAndModifyAction.pickVo.sendPick.docType.toString() == DOCTYPE.PICKTYPE_FORM_WAVE){
                        var id = $scope.newAndModifyAction.pickVo.sendPick.waveId;
                        angular.forEach($scope.newAndModifyAction.waveVoList,function(data,index){
                            if(data.sendWave.waveId == id){
                                $scope.newAndModifyAction.waveVoList[index].display = true;
                                hasFlag = true;
                            }
                        });
                        if(!hasFlag){
                            //把波次单添加到波次单列表
                            var _param = new waveVo();
                            _param.sendWave.waveId = id;
                            httpServer.postData(url.viewWave,_param).then(function(re){
                                re.display = true;
                                $scope.newAndModifyAction.waveVoList.push(re);
                            })
                        }
                    }
                }
            });
            $scope.newAndModifyAction.allocateBtn_display = true;
            this.addModShow();
            this.showText.firstTitle=showTitle[1];
        },
        showSplit:function(){
            this.showIndex=!this.showIndex;
            this.showSplitAsn=!this.showSplitAsn;
        },
        //拆分
        split:function(){//点击切换拆分ASN页面
            if(!$scope.searchAction.isSelectOne()){
                return;
            }
            var item  = $scope.searchAction.selectedItem();
            //打开状态才能生效
            if(item.sendPick.pickStatus != status.OPEN){
                tooltip('需选择状态为打开的记录进行拆分！');
                return;
            }else{
                $scope.splitAction.data = new pickVo();
                httpServer.postData(url.view,item).then(function (res) {
                    if(res!='error'&& res!='errorId') {
                        $scope.pickSplitItem=res;
                        split($scope.pickSplitItem);
                        $scope.btnAction.showSplit();
                        $scope.searchAction.selectedItems = [];
                    }
                });
            }
            function split(obj){
                $scope.splitAction.data.sendPick.pickId=obj.sendPick.pickId;
                //重新绑定需要修改的内容obj
                angular.forEach(obj.sendPickDetailVoList,function(data,index){
                    $scope.splitAction.data.sendPickDetailVoList.push(objectAction.newCopy(data));
                });
            }
        },
        //取消拆分
        removeSplit:function(){
            if(!$scope.searchAction.isSelectOne()){
                return;
            }
            var item  = $scope.searchAction.selectedItem();
            //打开状态才能生效
            if(item.sendPick.pickStatus != status.OPEN){
                tooltip('需选择状态为打开的记录进行拆分！');
                return;
            }
            if(!item.sendPick.parentId || item.sendPick.parentId == ''){
                tooltip('没有父编号不能拆分！');
                return;
            }
            httpServer.postData(url.removeSplit,item).then(function (res) {
                if(res!='error'&& res!='errorId') {
                    $scope.searchformAction.search();
                    tooltip("取消拆分成功！");
                    $scope.searchAction.selectedItems = [];
                }

            });
        },
        searchModel:function(id){
            $('#'+id).modal('show');
        },
        showAsnDetail:false,
        showAsnDetailAction:function(){
            this.showAsnDetail=!this.showAsnDetail;
            this.showIndex=!this.showIndex;
        },
        pickVoInfo:new pickVo(),
        //查看
        view:function(id){
            this.showAsnDetailAction();
            //而后进行查询数据绑定
            var _pickVo = new pickVo();
            _pickVo.sendPick.pickId = id;
            httpServer.postData(url.view,_pickVo).then(function (res) {
                if(res!='error'&& res!='errorId') {
                    $scope.btnAction.pickVoInfo = res;
                }
            });
        },
        MakeSureWork:false,
        makeSureTurnPage:function(){
            this.MakeSureWork=!this.MakeSureWork;
            this.showIndex=!this.showIndex;
        },
        MakeSureWorkBtn:function(){//点击切换收货确认
            if(!$scope.searchAction.isSelectOne()){
                return;
            }
            var item  = $scope.searchAction.selectedItem();
            //生效状态与工作中
            if(item.sendPick.pickStatus != status.ENABLE && item.sendPick.pickStatus != status.WORKING){
                tooltip('需选择状态为生效或者工作中的记录进行确认！');
                return;
            }
            httpServer.postData(url.view,item).then(function (res) {
                if(res!='error'&& res!='errorId') {
                    $scope.workConfirm = res;
                    angular.forEach($scope.workConfirm.sendPickDetailVoList,function(data,index){
                        $scope.workConfirm.sendPickDetailVoList[index].realPickLocations=[];
                        angular.forEach(data.planPickLocations,function(d,i){
                            //d是对象 存的是地址  所以要新建
                            d.sendPickLocation.pickWeight=$filter('number')(d.sendPickLocation.pickWeight,2);
                            d.sendPickLocation.pickVolume=$filter('number')(d.sendPickLocation.pickWeight,2);
                            // d.putawayLocation.putawayQty=$filter('number')(d.putawayLocation.putawayQty);
                            $scope.workConfirm.sendPickDetailVoList[index].realPickLocations.push(objectAction.newCopy(d));
                        });
                    });
                    $scope.btnAction.makeSureTurnPage();
                }
            });
        },

        //生效
        active:function(){
            if(!$scope.searchAction.isSelectOne()){
                return;
            }
            var item  = $scope.searchAction.selectedItem();
            //打开状态才能生效
            if(item.sendPick.pickStatus != status.OPEN){
                tooltip('需选择状态为打开的记录进行生效！');
                return;
            }else{
                httpServer.postData(url.active,item).then(function(res){
                    if(res!='error'&& res!='errorId') {
                        $scope.searchformAction.search();
                        $scope.searchAction.selectedItems = [];
                        tooltip("生效成功！");
                    }
                });
            }
        },
        //失效
        disable:function(){
            if(!$scope.searchAction.isSelectOne()){
                return;
            }
            var item  = $scope.searchAction.selectedItem();
            //生效状态才能失效
            if(item.sendPick.pickStatus != status.ENABLE){
                tooltip('需选择状态为生效的记录进行失效！');
                return;
            }else{
                httpServer.postData(url.disable,item).then(function(res){
                    if(res!='error'&& res!='errorId') {
                        $scope.searchformAction.search();
                        $scope.searchAction.selectedItems = [];
                        tooltip("失效成功！");
                    }
                });

            }
        },
        //取消
        abolish:function(){
            if(!$scope.searchAction.isSelectOne()){
                return;
            }
            var item  = $scope.searchAction.selectedItem();
            //打开状态才能取消
            if(item.sendPick.pickStatus != status.OPEN){
                tooltip('需选择状态为打开的记录进行取消！');
                return;
            }else{
                httpServer.postData(url.abolish,item).then(function(res){
                    if(res!='error'&& res!='errorId') {
                        $scope.searchformAction.search();
                        $scope.searchAction.selectedItems = [];
                        tooltip("取消成功！");
                    }
                });
            }
        }
    };

    function pickDetailVo(){
        this.sendPickDetail = {
            "pickDetailId":"",
            "deliveryDetailId":"",
            "skuId":"",
            "batchNo":"",
            "measureUnit":"",
            "orderQty":"",
            "orderWeight":"",
            "orderVolume":""
        };
        this.skuNo= "";
        this.skuName="";
        this.specModel="";
        this.planPickLocations = [];
        this.realPickLocations = [];
    }

    //新增修改
        $scope.newAndModifyAction={
            delItems:[],
            waveItems:[],
            deliveryVoList:[],
            deliveryDetailVoList:[],
            pickDetailVoList:[],
            waveVoList:[],
            selVoIndex:0,
            pickVo:new pickVo(),
            allocateBtn_display:false,
            clear:function(){
                $scope.newAndModifyAction.delItems = [];
                $scope.newAndModifyAction.waveItems = [];
                // $scope.newAndModifyAction.deliveryVoList = [];
                $scope.newAndModifyAction.deliveryDetailVoList = [];
                $scope.newAndModifyAction.pickDetailVoList = [];
                // $scope.newAndModifyAction.waveVoList = [];
                $scope.newAndModifyAction.pickVo = new pickVo();
                $scope.newAndModifyAction.selVoIndex = 0;
            },
            addPickSku:function(tag){
                //发货单
                if(tag == 0){
                    //检查是否选择一个
                    if(!$scope.newAndModifyAction.checkOne($scope.newAndModifyAction.delItems)){
                        return;
                    }
                    //删除原选中的明细
                    $scope.newAndModifyAction.delSku();
                    //获取选中项
                    var item = this.getSelectedItem(this.delItems,this.deliveryVoList);
                    //隐藏选择的记录
                    this.unDisplay(this.delItems,this.deliveryVoList);
                    this.delItems = [];
                    $scope.newAndModifyAction.pickVo = new pickVo();
                    $scope.newAndModifyAction.pickVo.sendPick.deliveryId = item.sendDelivery.deliveryId;
                    //查询发货明细
                    httpServer.postData(url.viewDelivery,item).then(function (res) {
                        if(res!='error'&& res!='errorId') {
                            $scope.newAndModifyAction.deliveryDetailVoList = res.deliveryDetailVoList;
                            angular.forEach($scope.newAndModifyAction.deliveryDetailVoList,function(data,index){
                                var _pickDetailVo =  $scope.newAndModifyAction.parseFromDeliveryDetailToPickDetail(data);
                                $scope.newAndModifyAction.pickDetailVoList.push(_pickDetailVo);
                                $scope.newAndModifyAction.pickVo.sendPickDetailVoList.push(_pickDetailVo);
                            });
                        }
                    });
                    this.pickVo.sendPick.docType = DOCTYPE.PICKTYPE_FORM_DELIVERY;
                }
                //波次单
                if(tag == 2){
                    //检查是否选择一个
                    if(!$scope.newAndModifyAction.checkOne($scope.newAndModifyAction.waveItems)){
                        return;
                    }
                    //删除原选中的明细
                    $scope.newAndModifyAction.delSku();
                    //获取选中项
                    var item = this.getSelectedItem(this.waveItems,this.waveVoList);
                    //隐藏选择的记录
                    this.unDisplay(this.waveItems,this.waveVoList);
                    this.waveItems = [];
                    $scope.newAndModifyAction.pickVo = new pickVo();
                    $scope.newAndModifyAction.pickVo.sendPick.waveId = item.sendWave.waveId;
                    //查询发货明细
                    httpServer.postData(url.qryDelDetails,item).then(function (res) {
                        if(res!='error'&& res!='errorId') {
                            $scope.newAndModifyAction.deliveryDetailVoList = res;
                            angular.forEach($scope.newAndModifyAction.deliveryDetailVoList,function(data,index){
                                var _pickDetailVo =  $scope.newAndModifyAction.parseFromDeliveryDetailToPickDetail(data);
                                $scope.newAndModifyAction.pickDetailVoList.push(_pickDetailVo);
                                $scope.newAndModifyAction.pickVo.sendPickDetailVoList.push(_pickDetailVo);
                            });
                        }

                    });
                    this.pickVo.sendPick.docType = DOCTYPE.PICKTYPE_FORM_WAVE;
                }

            },
            delSku:function(){
                //删除所有的货品
                $scope.newAndModifyAction.pickDetailVoList = [];
                $scope.newAndModifyAction.pickVo.sendPickDetailVoList = [];
                //显示隐藏的记录
                this.allDisplay(this.deliveryVoList);
                this.allDisplay(this.waveVoList);
                this.pickVo.sendPick.docType = "";

            },
            checkOne:function(items){
                if (items.filter(isSelect).length == 0) {
                    tooltip("请选择一个记录");
                    return false;
                }
                if(items.filter(isSelect).length > 1){
                    tooltip("您只能选择一项！");
                    return false;
                }
                function isSelect(element){
                    return element;
                }
                return true;
            },
            //获取选中项
            getSelectedItem:function (items,list) {
                for(var i=0;i<items.length;i++){
                    if(items[i]){
                        return list[i];
                    }
                }
            },
            //隐藏选中项
            unDisplay:function(items,list){
                for(var i=0;i<items.length;i++){
                    if(items[i]){
                        list[i].display = true;
                    }
                }
            },
            allDisplay:function(list){
                angular.forEach(list,function (data,i) {
                    list[i].display = false;
                })
            },
            //发货明细转换成拣货明细
            parseFromDeliveryDetailToPickDetail:function(deliveryDetailVo){
                var _pickDetailVo = new pickDetailVo();
                _pickDetailVo.sendPickDetail.deliveryDetailId = deliveryDetailVo.deliveryDetail.deliveryDetailId;
                _pickDetailVo.skuNo = deliveryDetailVo.skuNo;
                _pickDetailVo.skuName = deliveryDetailVo.skuName;
                _pickDetailVo.specModel = deliveryDetailVo.specModel;
                _pickDetailVo.sendPickDetail.skuId = deliveryDetailVo.deliveryDetail.skuId;
                _pickDetailVo.sendPickDetail.batchNo = deliveryDetailVo.deliveryDetail.batchNo;
                _pickDetailVo.sendPickDetail.measureUnit= deliveryDetailVo.deliveryDetail.measureUnit;
                _pickDetailVo.sendPickDetail.orderQty = deliveryDetailVo.deliveryDetail.orderQty;
                _pickDetailVo.sendPickDetail.orderWeight = deliveryDetailVo.deliveryDetail.orderWeight;
                _pickDetailVo.sendPickDetail.orderVolume = deliveryDetailVo.deliveryDetail.orderVolume;
                return _pickDetailVo;
            },
            //自动分配
            autoAllocate:function(){
                //是否已选中记录
                if(!$scope.detailSelectAction.hasSelected()){
                    return;
                }
                //获取选中的记录
                var _selectDetailItems = $scope.detailSelectAction.getAllSelectedItems();
                var _pickVo = new pickVo();
                _pickVo.sendPick = objectAction.newCopy($scope.newAndModifyAction.pickVo.sendPick);
                _pickVo.sendPickDetailVoList = _selectDetailItems;
                //提交自动分配
                httpServer.postData(url.autoAllocate,_pickVo).then(function(res){
                    if(res!='error'&& res!='errorId') {
                        // $scope.newAndModifyAction.pickDetailVoList[$scope.planLocationAction.selectedIndex].planPickLocations = [];
                        angular.forEach($scope.detailSelectAction.selectedItems,function(data,index){
                            if(data){
                                $scope.newAndModifyAction.pickDetailVoList[index] = res.sendPickDetailVoList[index];
                            }
                        });
                        tooltip("自动分配拣货库位完成！");
                        //查询拣货单
                        // httpServer.postData(url.view,$scope.newAndModifyAction.pickVo).then(function (r) {
                        //     debugger;
                        //     if(r!='error'&& r!='errorId') {
                        //         $scope.newAndModifyAction.pickDetailVoList =  r.sendPickDetailVoList;
                        //     }
                        // });
                    }
                });
            },
            //查询拣货明细
            qryDetail:function(pickDetailVo,$index){
                httpServer.postData(url.qryDetail,pickDetailVo).then(function(res){
                    if(res!='error'&& res!='errorId') {
                        $scope.newAndModifyAction.pickDetailVoList[$index] = res;
                    }
                });
            },
            save:function(){
                if($scope.newAndModifyAction.pickDetailVoList.length == 0){
                    tooltip("请添加拣货单货品明细");
                    return;
                }
                $scope.newAndModifyAction.pickVo.sendPickDetailVoList = $scope.newAndModifyAction.pickDetailVoList;

                if($scope.newAndModifyAction.checkData()){
                    httpServer.postData(url.addAndUpdate,$scope.newAndModifyAction.pickVo).then(function(res){
                        if(res!='error'&& res!='errorId') {
                            $scope.newAndModifyAction.pickVo = res;
                            old_data = objectAction.newCopy(res);
                            $scope.newAndModifyAction.pickDetailVoList =  $scope.newAndModifyAction.pickVo.sendPickDetailVoList;
                            $scope.newAndModifyAction.allocateBtn_display = true;
                            tooltip("保存成功！");
                        }
                    });
                }
            },
            saveAndEnable:function(){
                if($scope.newAndModifyAction.pickDetailVoList.length == 0){
                    tooltip("请添加拣货单货品明细");
                    return;
                }
                $scope.newAndModifyAction.pickVo.sendPickDetailVoList = $scope.newAndModifyAction.pickDetailVoList;
                if($scope.newAndModifyAction.checkData()){
                    httpServer.postData(url.saveAndEnable,$scope.newAndModifyAction.pickVo).then(function () {
                        if(res!='error'&& res!='errorId') {
                            $scope.newAndModifyAction.clear();
                            $scope.btnAction.addModShow();
                        }
                    })
                }
            },
            backToIndex:function(){
                $scope.newAndModifyAction.pickVo.sendPickDetailVoList = $scope.newAndModifyAction.pickDetailVoList;
                if(!angular.equals(old_data,$scope.newAndModifyAction.pickVo)){
                    $("#backConfirm").modal('show');
                }else{
                    $scope.newAndModifyAction.clear();
                    $scope.btnAction.addModShow();
                }
            },
            checkData:function(){
                var _flag = true;
                //检查是否选择库位，检查计划拣货数量是否与拣货明细订单数量一致
                angular.forEach($scope.newAndModifyAction.pickVo.sendPickDetailVoList,function(data,index){
                    var _planPick ={
                        qty:0,
                        weight:0,
                        volume:0
                    };
                    if(!data.planPickLocations || data.planPickLocations.length == 0){
                        tooltip("请选择"+data.skuName+"拣货库位！");
                        _flag = false;
                        return _flag;
                    }
                    angular.forEach(data.planPickLocations,function(d,i){
                        if(!d.sendPickLocation.locationId || d.sendPickLocation.locationId == ''){
                            tooltip("请选择"+data.skuName+"拣货库位！");
                            _flag = false;
                            return _flag;
                        }
                        //拣货数量不为0
                        if(parseFloat(d.sendPickLocation.pickQty) == 0){
                            tooltip("请选择"+data.skuName+"拣货数量！");
                            _flag = false;
                            return _flag;
                        }
                        _planPick.qty += parseFloat(d.sendPickLocation.pickQty);
                        _planPick.weight += parseFloat(d.sendPickLocation.pickWeight);
                        _planPick.volume += parseFloat(d.sendPickLocation.pickVolume);
                    });
                    if(data.sendPickDetail.orderQty != _planPick.qty){
                        tooltip(data.skuName+"订单数量与计划拣货数量不一致！");
                        _flag = false;
                        return _flag;
                    }
                    if(data.sendPickDetail.orderWeight != _planPick.weight){
                        tooltip(data.skuName+"订单重量与计划拣货重量不一致！");
                        _flag = false;
                        return _flag;
                    }
                    if(data.sendPickDetail.orderVolume != _planPick.volume){
                        tooltip(data.skuName+"订单体积与计划拣货体积不一致！");
                        _flag = false;
                        return _flag;
                    }
                });
                return _flag;
            }

        };

        //选择计划库位
        $scope.planLocationAction= {
            selectedDetail:{},
            selectedIndex:'0',
            sendDetailSelect:function(item,$index,$event){
                this.selectedIndex=$index;
                $scope.detailSelectAction.selectOne($index,$event);
                //查询拣货库位明细
                // if(item.sendPickDetail.pickDetailId && item.sendPickDetail.pickDetailId != ''){
                //     $scope.newAndModifyAction.qryDetail(item,$index);
                // }
            },
            selectedRealIndex:'0',
            realDetailVOSelect:function(index){
                this.selectedRealIndex=index;
            },
            addRealLocation:function(){
                var _sendPickLocationVo= new SendPickLocationVo();
                $scope.newAndModifyAction.pickDetailVoList[$scope.planLocationAction.selectedIndex].planPickLocations.push(_sendPickLocationVo);
            },
            removeReaLocation:function(){
                if( $scope.newAndModifyAction.pickDetailVoList[$scope.planLocationAction.selectedIndex].planPickLocations.length > 1){
                    $scope.newAndModifyAction.pickDetailVoList[$scope.planLocationAction.selectedIndex].planPickLocations.splice($scope.planLocationAction.selectedRealIndex,1);
                }

            },
            _skuComment:[], //存放不符合数量的货品名称
            makeSurePost:function(){
                $scope.planLocationAction._skuComment=[];
                var _sendPickDetailVoList=$scope.newAndModifyAction.pickDetailVoList;
                // var _realPickLocations=$scope.newAndModifyAction.pickDetailVoList[$scope.confirmAction.selectedIndex].realPickLocations;
                var _canPase=true;
                angular.forEach(_sendPickDetailVoList,function(d,i){
                    var addPlan={
                        orderQty:0,
                        orderWeight:0,
                        orderVolume:0
                    };
                    angular.forEach(_sendPickDetailVoList[i].planPickLocations,function(data){
                        addPlan.orderQty+=parseFloat(data.sendPickLocation.pickQty);
                        addPlan.orderWeight+=parseFloat(data.sendPickLocation.pickWeight);
                        addPlan.orderVolume+=parseFloat(data.sendPickLocation.pickVolume);
                    });
                    if(parseFloat(d.sendPickDetail.orderQty)>addPlan.pickQty
                    // ||parseFloat(d.putawayDetail.planPutawayWeight)<addReal.putawayWeight
                    // ||parseFloat(d.putawayDetail.planPutawayVolume)<addReal.putawayVolume
                    ){
                        _canPase=false;
                        $scope.planLocationAction._skuComment.push(d.skuComment);
                    }
                });
                if(_canPase){
                    this.mSPost();
                }else{
                    $('#pickConfirm').modal('show');
                }
            },

            //计划库位确认提交
            mSPost:function(){
                httpServer.postData(url.confirm,$scope.workConfirm).then(function(){
                    $('#pickConfirm').modal('hide');
                });

            },
            changeWareLocation:function(index){
                commit.commitToParent($scope,'select_wareLocation_searchModel','pickWareLocation'+index);
                commit.listening($scope,'pickWareLocation'+index,function(event,data){
                    //这里可以绑定date
                    console.log(data);
                    $scope.workConfirm.sendPickDetailVoList[$scope.confirmAction.selectedIndex].planPickLocations[index].locationComment=data.location.locationName;
                    $scope.workConfirm.sendPickDetailVoList[$scope.confirmAction.selectedIndex].planPickLocations[index].sendPickLocation.locationId=data.location.locationId;
                });
                $scope.btnAction.searchModel('select_wareLocation_searchModel')
            },
            // 选择库存
            selectStock:function(){
                commit.commitToParent($scope,'inventoryGoodsModal',{"status":"searchStock",
                    queryParam:{
                        "invStock":{
                            "skuId":$scope.newAndModifyAction.pickDetailVoList[$scope.planLocationAction.selectedIndex].sendPickDetail.skuId,
                            "batchNo":$scope.newAndModifyAction.pickDetailVoList[$scope.planLocationAction.selectedIndex].sendPickDetail.batchNo
                        },
                        "containTemp":false
                    },
                    "isShow":false
                });
                var on = commit.listening($scope,'searchStock',function(event,data){
                    $scope.newAndModifyAction.pickDetailVoList[$scope.planLocationAction.selectedIndex].planPickLocations[$scope.planLocationAction.selectedRealIndex].sendPickLocation.locationId = data.invStock.locationId;
                    $scope.newAndModifyAction.pickDetailVoList[$scope.planLocationAction.selectedIndex].planPickLocations[$scope.planLocationAction.selectedRealIndex].locationComment = data.locationName;
                    on();
                });
            }
        };

        $scope.viewPlanLocationAction={
            selectedIndex:'0',
            sendDetailSelect:function(item,$index,$event){
                this.selectedIndex=$index;
            }

        };

        // 货品明细选择
        $scope.detailSelectAction = {
            selectedItems : [] , // 列表中选中的记录
            selectedAll : false , // 全选按钮默认不选中
            currentSelectItem : 9999 ,
            dataList:[],
            // 多选复选框
            chkSelectAll:function (flag) {
                if ( $scope.newAndModifyAction.pickDetailVoList.length>0 ) {
                    angular.forEach($scope.newAndModifyAction.pickDetailVoList,function(data,index){
                        if(flag){
                            $scope.detailSelectAction.selectedItems[index]=true;
                        }else{
                            $scope.detailSelectAction.selectedItems[index]=false;
                        }
                    });
                }
            } , // 多选复选框 end
            // 选中单选框
            selectOne:function(index,$event){
                this.currentSelectItem=index;
                //点击进行是否选择操作
                $scope.detailSelectAction.selectedItems[index]= !$scope.detailSelectAction.selectedItems[index];
                // 如果该点击项不是选中状态就将全部选中状态去掉
                $scope.detailSelectAction.selectedAll=false;
                var allCheck = true;
                angular.forEach($scope.newAndModifyAction.pickDetailVoList,function(data,index){
                    if(!$scope.detailSelectAction.selectedItems[index]){
                        allCheck = false;
                        return false;
                    }
                });
                if ( allCheck ) {
                    $scope.detailSelectAction.selectedAll=true;
                }

            } , // 选中单选框 end
            isSelect:function(element){
                return element;
            },
            //检查是否选中一个
            isSelectOne:function(){
                if ($scope.detailSelectAction.selectedItems.filter($scope.detailSelectAction.isSelect).length == 0) {
                    tooltip("请选择一个记录");
                    return false;
                }

                if($scope.detailSelectAction.selectedItems.filter($scope.detailSelectAction.isSelect).length > 1){
                    tooltip("您只能选择一项！");
                    return false;
                }
                return true;
            },
            hasSelected:function(){
                if ($scope.detailSelectAction.selectedItems.filter($scope.detailSelectAction.isSelect).length == 0) {
                    tooltip("您必须选择一项");
                    return false;
                }
                return true;
            },
            //选中的项
            selectedItem:function(){
                for(var i=0;i<$scope.detailSelectAction.selectedItems.length;i++){
                    if($scope.detailSelectAction.selectedItems[i]){
                        return $scope.newAndModifyAction.pickDetailVoList[i];
                    }
                }
            },
            getAllSelectedItems:function(){
                var _items = [];
                for(var i=0;i<$scope.detailSelectAction.selectedItems.length;i++){
                    if($scope.detailSelectAction.selectedItems[i]){
                        _items.push($scope.newAndModifyAction.pickDetailVoList[i]);
                    }
                }
                return _items;
            }

        };

        $scope.pickSplitItem = {};
        //拆分 需要绑定上传数据
        $scope.splitAction={
            data:{
                "sendPick":{
                    "pickId":""
                },
                "sendPickDetailVoList":[]
            },
            splitSaveAndBack:function(){
                httpServer.postData(url.split,$scope.splitAction.data).then(function(res){
                    if(res!='error'&& res!='errorId') {
                        tooltip('拆分成功！');
                        $scope.btnAction.showIndex=!$scope.btnAction.showIndex;
                        $scope.btnAction.showSplitAsn=!$scope.btnAction.showSplitAsn;
                    }
                })
            }
        };

        //拣货库位vo
        function SendPickLocationVo() {
            this.sendPickLocation = new SendPickLocation();
            this.locationComment = '';                   //     库位中文名称
        }

        //拣货库位
        function SendPickLocation() {
            this.createTime = '';              // 创建时间
            this.updateTime = '';              // 修改时间
            this.createPerson = '';                 // 创建人
            this.updatePerson = '';                 // 修改人
            this.pickLocationId = '';            // 拣货单操作明细id
            this.locationId = '';                   //  库位id
            this.pickDetailId = '';              //  拣货单明细id
            this.pickQty = '0';                   //  数量
            this.pickWeight = '0';                //  重量
            this.pickVolume = '0';                //  体积
            this.pickType = '';                  //  类型
            this.packId = '';                       //  包装id
            this.measureUnit = '';                  //  计量单位
            this.warehouseId = '';                  //  仓库id
            this.orgId = '';                        //  企业id
            this.asnDetailId = '';                        //  asn明细id
        }

        $scope.workConfirm = {};
        //作业确认
        $scope.confirmAction= {

            selectedWorker:function(){
                //commit.commitToParent方法向上级传递参数 传递 你想发回来的数据
                // 第一个参数 为当前$scope 第二个参数为你想调用的弹框 第三个参数 为你想接收的数据名称
                commit.commitToParent($scope,'select_users_searchModel','pickWorker');
                //选择对应的项目 与selectedWorker发回的参数一致！
                commit.listening($scope,'pickWorker',function(event,data){
                    //这里可以绑定date
                    $scope.workConfirm.sendPick.opPerson=data.entity.userId;
                    $scope.workConfirm.opPersonName=data.entity.userName;
                });
            },
            selectedIndex:'0',
            sendDetailSelect:function(item,$index){
                this.selectedIndex=$index;
            },
            selectedRealIndex:'0',
            realDetailVOSelect:function(index){
                this.selectedRealIndex=index;
            },
            addRealLocation:function(){
                var _sendPickLocationVo=new SendPickLocationVo();
                $scope.workConfirm.sendPickDetailVoList[$scope.confirmAction.selectedIndex].realPickLocations.push(_sendPickLocationVo);
            },
            removeReaLocation:function(){
                if( $scope.workConfirm.sendPickDetailVoList[$scope.confirmAction.selectedIndex].realPickLocations.length > 1){
                    $scope.workConfirm.sendPickDetailVoList[$scope.confirmAction.selectedIndex].realPickLocations.splice($scope.confirmAction.selectedRealIndex,1);
                }

            },
            _skuComment:[], //存放不符合数量的货品名称
            makeSurePost:function(){
                $scope.confirmAction._skuComment=[];
                var _sendPickDetailVoList=$scope.workConfirm.sendPickDetailVoList;
                // var _realPickLocations=$scope.workConfirm.sendPickDetailVoList[$scope.confirmAction.selectedIndex].realPickLocations;
                var _canPase=true;
                //拣货明细
                for(var i=0;i<_sendPickDetailVoList.length;i++){
                    var d = _sendPickDetailVoList[i];
                    var addReal={
                        pickQty:0,
                        pickWeight:0,
                        pickVolume:0
                    };
                    //确认库位循环
                    for(var j=0;j < _sendPickDetailVoList[i].realPickLocations.length;j++){
                        var data = _sendPickDetailVoList[i].realPickLocations[j];
                        if(!data.sendPickLocation.locationId || data.sendPickLocation.locationId == ''){
                            tooltip("请选择实际库位！");
                            return;
                        }
                        if(!data.sendPickLocation.pickQty || data.sendPickLocation.pickQty == 0){
                            tooltip("请选择实际拣货数量！");
                            return;
                        }
                        addReal.pickQty+=parseFloat(data.sendPickLocation.pickQty);
                        addReal.pickWeight+=parseFloat(data.sendPickLocation.pickWeight);
                        addReal.pickVolume+=parseFloat(data.sendPickLocation.pickVolume);
                    };
                    //若实际拣货数量大于计划，则提示失败
                    if(parseFloat(d.sendPickDetail.orderQty)<addReal.pickQty){
                        tooltip("实际拣货数量大于订单数量，确认失败");
                        return;
                    }
                    //若实际拣货重量大于计划，则提示失败
                    if(parseFloat(d.sendPickDetail.orderWeight)<addReal.pickWeight){
                        tooltip("实际拣货重量大于订单重量，确认失败");
                        return;
                    }
                    //若实际拣货体积大于计划，则提示失败
                    if(parseFloat(d.sendPickDetail.orderVolume)<addReal.pickVolume){
                        tooltip("实际拣货体积大于订单体积，确认失败");
                        return;
                    }
                    if(parseFloat(d.sendPickDetail.orderQty)>addReal.pickQty
                        ||parseFloat(d.sendPickDetail.orderWeight)>addReal.pickWeight
                        ||parseFloat(d.sendPickDetail.orderVolume)>addReal.pickVolume
                    ){
                        // _canPase=false;
                        $scope.confirmAction._skuComment.push(d.skuComment);
                        $('#pickConfirm').modal('show');
                    }else{
                        $scope.confirmAction.mSPost();
                    }
                }
                // console.log(1);
                // if(_canPase){
                //     this.mSPost();
                // }else{
                //     $('#pickConfirm').modal('show');
                // }
            },
            //作业确认提交
            mSPost:function(){
                $('#pickConfirm').modal('hide');
                httpServer.postData(url.confirm,$scope.workConfirm).then(function(){
                    if(res!='error'&& res!='errorId') {
                        $scope.searchformAction.search();
                        $scope.btnAction.makeSureTurnPage();
                    }
                });
            },
            changeWareLocation:function(index){
                commit.commitToParent($scope,'select_wareLocation_searchModel','pickWareLocation'+index);
                commit.listening($scope,'pickWareLocation'+index,function(event,data){
                    //这里可以绑定date
                    console.log(data);
                    $scope.workConfirm.sendPickDetailVoList[$scope.confirmAction.selectedIndex].realPickLocations[index].locationComment=data.location.locationName;
                    $scope.workConfirm.sendPickDetailVoList[$scope.confirmAction.selectedIndex].realPickLocations[index].sendPickLocation.locationId=data.location.locationId;
                });
                $scope.btnAction.searchModel('select_wareLocation_searchModel')
            },
            //选择库位
            selectRealStock:function(){
                commit.commitToParent($scope,'inventoryGoodsModal',{"status":"searchStock",
                    queryParam:{
                        "invStock":{
                            "skuId":$scope.workConfirm.sendPickDetailVoList[$scope.confirmAction.selectedIndex].sendPickDetail.skuId,
                            "batchNo":$scope.workConfirm.sendPickDetailVoList[$scope.confirmAction.selectedIndex].sendPickDetail.batchNo
                        },
                        "containTemp":false
                    },
                    "isShow":false
                });
                var on = commit.listening($scope,'searchStock',function(event,data){
                    $scope.workConfirm.sendPickDetailVoList[$scope.confirmAction.selectedIndex].realPickLocations[$scope.confirmAction.selectedRealIndex].sendPickLocation.locationId = data.invStock.locationId;
                    $scope.workConfirm.sendPickDetailVoList[$scope.confirmAction.selectedIndex].realPickLocations[$scope.confirmAction.selectedRealIndex].locationComment = data.locationName;
                    on();
                });
            }
        }

//查询 重置按钮设置
$scope.searchPickForm = {
    "sendPick":{
        "pickStatus":""
    },
    "deliveryNo":"",
    "waveNo":"",
    "ownerName":""
};
var _searchPickForm ={
    "sendPick":{
        "pickStatus":""
    },
    "deliveryNo":"",
    "waveNo":"",
    "ownerName":""
}

$scope.searchformAction = {
    search:function(){
        //开始查询 即与绑定的page指令的查询端口进行双向数据绑定
        $scope.searchAction.dataList = [];
        var _pageModelQuery={};
        angular.copy($scope.searchPickForm,_pageModelQuery);
        $scope.pickPageModelQuery=_pageModelQuery;
    },
    reset:function(){
        $scope.searchPickForm = objectAction.newCopy(_searchPickForm);
    }
}


}]).name;
/**
 * Created by yangl on 2017/3/6.
 */
