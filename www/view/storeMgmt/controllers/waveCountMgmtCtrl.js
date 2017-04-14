'use strict';
module.exports = angular.module("app.storeMgmt").controller("waveCountMgmtCtrl",
    ['$scope','tooltip','commit','modifyById','arrayAction','httpServer','objectAction','scrollObj',
        function($scope,tooltip,commit,modifyById,arrayAction,httpServer,objectAction,scrollObj) {
    var showTitle=['新增波次单','修改波次单'];

    //url
    $scope.searchUrl = "/wave/qryPageList";
    var url = {
        'view':'/wave/view',
        'addAndUpdate':'/wave/addAndUpdate',
        'saveAndEnable':'/wave/saveAndEnable',
        'active':'/wave/active',
        'disable':'/wave/disable',
        'abolish':'/wave/abolish',
        'qryListInWave':'/delivery/qryListInWave'
    };

            //状态
            var status = {
                'OPEN':10,
                'ENABLE':20,
                'CANCAL':99
            };

    //获取初始参数数据  这里可以继续get请求
    httpServer.postData('/param/show',['WAVESTATUS','DELIVERYTYPE']).then(function(res){
        $scope.getOriginData = res;
    });

    $scope.wavePageModelQuery = {};

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
    }


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

    //查询 重置按钮设置
    $scope.waveReqParam={ //个字段的顺序和前端显示顺序要一致 方便下步复用
        "sendWave":{
            "waveNo":"",// 波次单号
            "waveStatus":''//状态
        },
        "ownerName":""//货主
    };

    var _waveReqParam={ //个字段的顺序和前端显示顺序要一致 方便下步复用
        "sendWave":{
            "waveNo":"",// 波次单号
            "waveStatus":''//状态
        },
        "ownerName":""//货主
    };

    var old_waveVo = {};
    $scope.waveVoInfo = {};

    //开始查询页面
    $scope.searchformAction={
        search:function(){
            //开始查询 即与绑定的page指令的查询端口进行双向数据绑定
            $scope.searchAction.dataList =[];
            var _pageModelQuery={};
            angular.copy($scope.waveReqParam,_pageModelQuery);
            $scope.wavePageModelQuery=_pageModelQuery;
        },
        reset:function(){
            $scope.waveReqParam = _waveReqParam;
        },
        view:function(id){
            $scope.waveVoInfo = new waveVo();
            $scope.waveVoInfo.sendWave.waveId = id;
            httpServer.postData(url.view,$scope.waveVoInfo).then(function(res){
                if(res!='error'&&res!='errorId') {
                    //跳转 并绑定数据
                    $scope.waveVoInfo = res;
                    $scope.searchDeliveryAction.dataList = $scope.waveVoInfo.sendDeliberyVoList;
                    $scope.btnAction.showText.firstTitle = showTitle[1];
                    $scope.btnAction.showAsnDetailAction();
                }
            })
        },
        modify:function(){
            if(!$scope.searchAction.isSelectOne()){
                return;
            }
            var item  = $scope.searchAction.selectedItem();
            if(item.sendWave.waveStatus != status.OPEN){
                tooltip('需选择状态为打开的记录进行修改！');
                return;
            };
            httpServer.postData(url.view,item).then(function(res){
                if(res!='error'&&res!='errorId') {
                    //跳转 并绑定数据
                    $scope.waveVoInfo = res;
                    arrayAction.copyTo($scope.waveVoInfo.sendDeliberyVoList,$scope.searchDeliveryAction.dataList);
                    old_waveVo = objectAction.newCopy(res);
                    $scope.btnAction.showText.firstTitle = showTitle[1];
                    $scope.btnAction.addOrModify();
                }
            })
        },
        //生效
        enable:function(){
            if(!$scope.searchAction.isSelectOne()){
                return;
            }
            var item  = $scope.searchAction.selectedItem();
            //打开状态才能生效
            if(item.sendWave.waveStatus != status.OPEN){
                tooltip('需选择状态为打开的记录进行生效！');
                return;
            }else{
                httpServer.postData(url.active,item).then(function (res) {
                    if(res!='error'&& res!='errorId') {
                        tooltip("生效成功！");
                        $scope.searchformAction.search();
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
            //打开状态才能生效
            if(item.sendWave.waveStatus != status.ENABLE){
                tooltip('需选择状态为生效的记录进行失效！');
                return;
            }else{
                httpServer.postData(url.disable,item).then(function (res) {
                    if(res!='error'&& res!='errorId') {
                        tooltip("失效成功！");
                        $scope.searchformAction.search();
                    }
                });;
            }
        },
        //取消
        cancel:function(){
            if(!$scope.searchAction.isSelectOne()){
                return;
            }
            var item  = $scope.searchAction.selectedItem();
            //打开状态才能生效
            if(item.sendWave.waveStatus != status.OPEN){
                tooltip('需选择状态为打开的记录进行取消！');
                return;
            }else{
                httpServer.postData(url.abolish,item).then(function (res) {
                    if(res!='error'&& res!='errorId') {
                        tooltip("取消成功！");
                        $scope.searchformAction.search();
                    }
                });
            }
        }
    };

    //查询发货单
    function searchDeliveryForm(){
        this.sendDelivery ={
            "owner":"",
            "sender":"",
            "receiver":"",
            "contactPerson":"",
            "contactPhone":"",
            "province":"",
            "city":"",
            "county":"",
            "docType":""
        },
        this.beginTime="";
        this.endTime="";
        this.senderName="";
        this.receiverName="";
        this.ownerName=""
    }
    $scope.searchDeliveryAction = {
        tooltipIsOpen:false,
        searchDeliveryForm:new searchDeliveryForm(),
        selectedItems : [] , // 列表中选中的记录
        selectedAll : false , // 全选按钮默认不选中
        currentSelectItem : 9999 ,
        dataList:[],
        // 多选复选框
        chkSelectAll:function (flag) {
            if ( $scope.searchDeliveryAction.dataList.length>0 ) {
                angular.forEach($scope.searchDeliveryAction.dataList,function(data,index){
                    if(flag){
                        $scope.searchDeliveryAction.selectedItems[index]=true;
                    }else{
                        $scope.searchDeliveryAction.selectedItems[index]=false;
                    }
                });
            }
        } , // 多选复选框 end
        // 选中单选框
        selectOne:function(index,$event){
            this.currentSelectItem=index;
            //点击进行是否选择操作
            $scope.searchDeliveryAction.selectedItems[index]= !$scope.searchDeliveryAction.selectedItems[index];
            // 如果该点击项不是选中状态就将全部选中状态去掉
            $scope.searchDeliveryAction.selectedAll=false;
            var allCheck = true;
            angular.forEach($scope.searchDeliveryAction.dataList,function(data,index){
                if(!$scope.searchDeliveryAction.selectedItems[index]){
                    allCheck = false;
                    return false;
                }
            });
            if ( allCheck ) {
                $scope.searchDeliveryAction.selectedAll=true;
            }
        } , // 选中单选框 end
        isSelect:function(element){
            return element;
        },
        //检查是否选中一个
        isSelectOne:function(){
            if ($scope.searchDeliveryAction.selectedItems.filter($scope.searchDeliveryAction.isSelect).length == 0) {
                tooltip("请选择一个记录");
                return false;
            }

            if($scope.searchDeliveryAction.selectedItems.filter($scope.searchDeliveryAction.isSelect).length > 1){
                tooltip("您只能选择一项进行修改！");
                return false;
            }
            return true;
        },
        //选中的项
        selectedItem:function(){
            for(var i=0;i<$scope.searchDeliveryAction.selectedItems.length;i++){
                if($scope.searchDeliveryAction.selectedItems[i]){
                    return $scope.searchDeliveryAction.dataList[i];
                }
            }
        },
        deleteItems:function($event){
            $event.stopPropagation();
            var items = [];
            angular.forEach($scope.searchDeliveryAction.dataList,function(data,index){
                if(!$scope.searchDeliveryAction.selectedItems[index]){
                   items.push($scope.searchDeliveryAction.dataList[index]);
                }
            });
            angular.copy(items,$scope.searchDeliveryAction.dataList);
            $scope.searchDeliveryAction.selectedItems=[];
        },
        //查询
        search:function(){
            httpServer.postData(url.qryListInWave,$scope.searchDeliveryAction.searchDeliveryForm).then(function(res){
                if(res!='error'&& res!='errorId') {
                    $scope.searchDeliveryAction.dataList = res;
                }
            });
        },
        reset:function(){
            $scope.searchDeliveryAction.searchDeliveryForm = new searchDeliveryForm();
        },
        selectOwner:function(){
            commit.commitToParent($scope,'selectMerchantModel',{status:'searchDeliveryActionSelectOwner',isOwner:true})
            var on = commit.listening($scope,'searchDeliveryActionSelectOwner',function(event,data){
                $scope.searchDeliveryAction.searchDeliveryForm.sendDelivery.owner = data.entity.merchantId;
                $scope.searchDeliveryAction.searchDeliveryForm.ownerName = data.entity.merchantName;
                on();
            })
        },
        selectSender:function(){
            commit.commitToParent($scope,'selectMerchantModel',{status:'searchDeliveryActionSelectSender',isOwner:true})
            var on = commit.listening($scope,'searchDeliveryActionSelectSender',function(event,data){
                $scope.searchDeliveryAction.searchDeliveryForm.sendDelivery.sender = data.entity.merchantId;
                $scope.searchDeliveryAction.searchDeliveryForm.senderName = data.entity.merchantName;
                on();
            })
        },
        selectReceiver:function(){
            commit.commitToParent($scope,'selectMerchantModel',{status:'searchDeliveryActionSelectReceiver',isOwner:true})
            var on = commit.listening($scope,'searchDeliveryActionSelectReceiver',function(event,data){
                $scope.searchDeliveryAction.searchDeliveryForm.sendDelivery.receiver = data.entity.merchantId;
                $scope.searchDeliveryAction.searchDeliveryForm.receiverName = data.entity.merchantName;
                on();
            })
        }

    }

    $scope.btnAction={
        showText:{
            firstTitle:showTitle[0]
        },
        showAddOrModify:false,
        showSplitAsn:false,
        showIndex:true,
        clearAddForm:function(){
            $scope.searchDeliveryAction.dataList = [];
            $scope.searchDeliveryAction.searchDeliveryForm=new searchDeliveryForm();
            $scope.searchDeliveryAction.selectedItems = [];
        },
        addOrModify:function(){
            this.showAddOrModify=!this.showAddOrModify;
            this.showIndex=!this.showIndex;
        },
        show:function(){
            this.showAddOrModify=!this.showAddOrModify;
            this.showIndex=!this.showIndex;
        },
        clearAndBack:function(){
            $scope.btnAction.clearAddForm();
            $scope.btnAction.addOrModify();
            $("#waveConfirm").modal('hide');
        },
        add:function(){ //点击切换新增ASN页面
            this.showAddOrModify=!this.showAddOrModify;
            this.showIndex=!this.showIndex;
            //新增 修改页面操作
            $scope.waveVoInfo = new waveVo();
            // angular.copy(_addModifyReqParam,$scope.addModifyReqParam);
            // $scope.deliveryDetailVolist=new deliveryDetailVolist();
        },
        modifyAsn:function(){//点击切换修改ASN页面
            this.showAddOrModify=!this.showAddOrModify;
            this.showIndex=!this.showIndex;
            this.showText.firstTitle=showTitle[1];
        },
        searchModel:function(id){
            $('#'+id).modal('show');
        },
        showAsnDetail:false,
        showAsnDetailAction:function(){
            this.showAsnDetail=!this.showAsnDetail;
            this.showIndex=!this.showIndex;
        },
        showAsnDetailActionGetData:function(id){
            this.showAsnDetailAction();
            //而后进行查询数据绑定
            console.log(id);
        },
        //暂存
        save:function(){
            $scope.waveVoInfo.sendDeliberyVoList = $scope.searchDeliveryAction.dataList;
            httpServer.postData(url.addAndUpdate, $scope.waveVoInfo).then(function(res){
                if(res!='error'&& res!='errorId') {
                    $scope.waveVoInfo = new waveVo();
                    $scope.btnAction.clearAddForm();
                }
            });
        },
        //保存并生效
        saveAndEnable:function(){
            $scope.waveVoInfo = new waveVo();
            $scope.waveVoInfo.sendDeliberyVoList = $scope.searchDeliveryAction.dataList;
            httpServer.postData(url.saveAndEnable, $scope.waveVoInfo).then(function(res){
                if(res!='error'&& res!='errorId') {
                    $scope.btnAction.clearAddForm();
                    $scope.btnAction.addOrModify();
                }
            });
        },
        saveAndBack:function(){
            $btnAction.save();
            $btnAction.clearAndBack();
        },
        backToIndex:function(){
            if(!angular.equals(old_waveVo,$scope.waveVoInfo)){
                $("#waveConfirm").modal('show');
            }else{
                $scope.btnAction.clearAndBack();
            }
        }

    }
}]).name;
/**
 * Created by yangl on 2017/3/6.
 */
