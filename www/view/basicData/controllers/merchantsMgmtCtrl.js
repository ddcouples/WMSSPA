'use strict';
module.exports = angular.module("app.basicData").controller("merchantsMgmtCtrl",
    ['$scope','tooltip','modifyById','arrayAction','httpServer','objectAction','scrollObj',
    function($scope,tooltip,modifyById,arrayAction,httpServer,objectAction,scrollObj) {

    //新增修改页面的标题内容
    var showTitle=['新增客商','修改客商'];

    //初始化数据
    $scope.getOriginData={
        merchantsStatus:[
        {
            key:10,
            value:'打开'
        },{
            key:20,
            value:'生效'
        },{
            key:99,
            value:'取消'
        }
        ]
    };

    //勾选框选中的数据
    $scope.selectById={
        idArray:[],
        itemArray:[]
    };
    function chkItem() {
        if($scope.selectById.idArray.length > 1){
            tooltip('您只能选择一项进行修改！');
            return false;
        };
        if($scope.selectById.idArray.length == 0){
            tooltip('请先选择一个项目！');
            return false;
        };
        return true;
    }

    //列表页的【新增，修改，生效，失效，取消等】按钮触发的事件
    $scope.btnAction={
        showText:{
            firstTitle:showTitle[0]
        },
        showAddOrModify:false,
        showIndex:true,
        AddOrModify:function(){  //单独操作 是否显示新增或修改
            this.showAddOrModify=!this.showAddOrModify;
            this.showIndex=!this.showIndex;
            $scope.selectById={
                idArray:[],
                itemArray:[]
            };//page重新更新数据了 所以要重新滞空
        },
        addPage:function(){ //点击切换新增页面
            this.showText.firstTitle=showTitle[0];
            this.AddOrModify();
            //清空【新增，修改页面往后台提交的参数】
            var _addModifyReqParam={
                "entity":{
                    "merchantNo":"",
                    "merchantName":"",
                    "merchantShortName":"",
                    "country":"",
                    "province":"",
                    "city":"",
                    "contactPerson":"",
                    "contactAddress":"",
                    "contactPhone":"",
                    "mobile":"",
                    "fax":"",
                    "email":"",
                    "isOwner":"",
                    "isCustomer":"",
                    "isCarrier":"",
                    "isProvider":"",
                    "isSender":"",
                    "isReceiver":"",
                    "note":""
                }
            };
            $scope.addModifyReqParam=_addModifyReqParam;
            console.log($scope.addModifyReqParam);
        },
        modifyPage:function(id){//点击切换修改页面
            if(!chkItem()) return;
            var d = modifyById({"entity":{"merchantId":id}}, '/merchant/view','请先选择一个项目');
            d.then(function(res){
                if(res!='error'&&res!='errorId'){
                    //绑定数据并跳转到修改页面
                    $scope.addModifyReqParam = res;
                    $scope.btnAction.showText.firstTitle=showTitle[1];
                    $scope.btnAction.AddOrModify();
                }
            });
        },
        takeEffect:function(id,status){
            if(!chkItem()) return;
            var obj=$scope.selectById.itemArray[0];
            if(obj.entity.merchantStatus!==status){
                tooltip('需选择状态为打开的项目进行生效！');
                return;
            };
            var d = httpServer.postData('/merchant/enable', {"entity":{"merchantId":id}});
            d.then(function(res){
                if(res!='error'){
                    $scope.searchformAction.search();
                    $scope.selectById={
                        idArray:[],
                        itemArray:[]
                    };
                }
            });
        },
        loseEffect:function(id,status){
            if(!chkItem()) return;
            var obj=$scope.selectById.itemArray[0];
            if(obj.entity.merchantStatus!==status){
                tooltip('需选择状态为生效的项目进行失效！');
                return;
            };
            var d = httpServer.postData('/merchant/disable', {"entity":{"merchantId":id}});
            d.then(function(res){
                if(res!='error'){
                    $scope.searchformAction.search();
                    $scope.selectById={
                        idArray:[],
                        itemArray:[]
                    };
                }
            });
        },
        cancel:function(id,status){
            if(!chkItem()) return;
            var obj=$scope.selectById.itemArray[0];
            if(obj.entity.merchantStatus!==status){
                tooltip('需选择状态为打开的项目进行取消！');
                return;
            };
            var d = httpServer.postData('/merchant/cancel', {"entity":{"merchantId":id}});
            d.then(function(res){
                if(res!='error'){
                    $scope.searchformAction.search();
                    $scope.selectById={
                        idArray:[],
                        itemArray:[]
                    };
                }
            });
        },
        searchModel:function(id){
            $('#'+id).modal('show');
        },
        showDetail:false,
        showDetailAction:function(){
            this.showDetail=!this.showDetail;
            this.showIndex=!this.showIndex;
        },
        showDetailActionGetData:function(id){
            //this.showDetailAction();
            //而后进行查询数据绑定
            var d = httpServer.postData('/merchant/view',{"entity":{"merchantId":id}});
            d.then(function(res){
                if(res!='error'&&res!='errorId'){
                    //跳转到查看详情页面并绑定数据
                    $scope.viewRspParam = res;
                    $scope.btnAction.showDetailAction();
                }
            });
            console.log(id);
        },
        slectOnly:function(item,_select,itemObj){
            arrayAction.selectedById(item,_select,itemObj,$scope.selectById);
        }
    };

    //列表页的查询参数begin
    //绑定查询参数，不直接绑定分页指令，防止数据改变时直接从后台查询数据
    $scope.queryReqParam={ //个字段的顺序和前端显示顺序要一致 方便下步复用
        "entity":{
            "merchantNo":"",
            "merchantName":"",
            "contactPerson":'',
            "merchantStatus":''
        }
    };
    //空参数，方便重置时复制
    var _queryReqParam={
        "entity":{
            "merchantNo":"",
            "merchantName":"",
            "contactPerson":'',
            "merchantStatus":''
        }
    };
    //绑定分页指令数据，用于用户点击查询按钮时候从后台查询数据
    $scope.queryParam={
        "entity":{}
    };
    //列表页的查询参数end

    //列表页的【查询，重置】按钮触发的事件
    $scope.searchformAction={
        search:function(){
            //if(!angular.equals($scope.queryReqParam, _queryReqParam)){
                //从后台查询数据，与绑定的page指令进行双向数据绑定即可
                //不能直接把queryReqParam拷贝到queryParam，否则不会从后台查询数据
                var _pageModelQuery={};
                angular.copy($scope.queryReqParam, _pageModelQuery);
                $scope.queryParam = _pageModelQuery;
            //}
        },
        reset:function(){
            angular.copy(_queryReqParam, $scope.queryReqParam);
        }
    };

    //新增，修改页面往后台提交的参数
    $scope.addModifyReqParam={
        "entity":{
            "merchantId":"",
            "merchantNo":"",
            "merchantName":"",
            "merchantShortName":"",
            "country":"",
            "province":"",
            "city":"",
            "contactPerson":"",
            "contactAddress":"",
            "contactPhone":"",
            "mobile":"",
            "fax":"",
            "eamil":"",
            "isOwner":"",
            "isCustomer":"",
            "isCarrier":"",
            "isProvider":"",
            "isSender":"",
            "isReceiver":"",
            "note":""
        }
    };

    //查看详情页面显示的参数
    $scope.viewRspParam={};

    //新增，修改页面的【暂存，保存】按钮事件begin
    function checkout(form){
        if(form.$invalid) {
            $scope.addModifyBtnAction.tooltipIsOpen=true;
            setTimeout(function(){
                // 消失提示和弹出
                $scope.addModifyBtnAction.tooltipIsOpen=false;
                $scope.$apply();
            },2000);
            return false;
        };
        return true;
    };
    $scope.addModifyBtnAction={
        tooltipIsOpen:false,
        temporarilySave:function(formName){
            if(checkout(formName)){ //检验通过 就可以进行暂存操作
                //通过是否存在id来判断新增还是修改
                if($scope.addModifyReqParam.entity.merchantId==null || $scope.addModifyReqParam.entity.merchantId==''){
                    httpServer.postData('/merchant/add',$scope.addModifyReqParam).then(function(res){
                        if (res!='error'){
                            $scope.addModifyReqParam=res;
                            tooltip('暂存成功！');
                        }
                    })
                } else {
                    httpServer.postData('/merchant/update',$scope.addModifyReqParam).then(function(res){
                        if (res!='error'){
                            tooltip('暂存成功！');
                        }
                    })
                }
            }
        },
        saveEffectBack:function(formName){
            if(checkout(formName)) { //检验通过 就可以进行暂存操作
                //通过是否存在id来判断新增还是修改
                if($scope.addModifyReqParam.entity.merchantId==null || $scope.addModifyReqParam.entity.merchantId==''){
                    httpServer.postData('/merchant/add',$scope.addModifyReqParam).then(function(res){
                        if (res!='error'){
                            tooltip('保存成功！');
                            $scope.btnAction.AddOrModify();
                        }
                    })
                } else {
                    httpServer.postData('/merchant/update',$scope.addModifyReqParam).then(function(res){
                        if (res!='error'){
                            tooltip('保存成功！');
                            $scope.btnAction.AddOrModify();
                        }
                    })
                }
            }
        }
    };
    //新增，修改页面的【暂存，保存】按钮事件end

}]).name
