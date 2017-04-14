'use strict';
module.exports = angular.module("app.basicData").controller("bdGoodsMgmtCtrl",
    ['$scope','tooltip','modifyById','arrayAction','httpServer','objectAction','scrollObj',
    function($scope,tooltip,modifyById,arrayAction,httpServer,objectAction,scrollObj) {

        //新增修改页面的标题内容
        var showTitle=['新增货品','修改货品'];

        //初始化数据
        $scope.getOriginData={
            skuStatus:[
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

        //勾选框选中的数据---通用，无需修改
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
            //标识跳转到新增或者修改页面---通用，无需修改
            AddOrModify:function(){
                this.showAddOrModify=!this.showAddOrModify;
                this.showIndex=!this.showIndex;
                //新增/修改页面跳转时候清空列表页面的查询条件和勾选框数据
                $scope.selectById = {
                        idArray: [],
                        itemArray: []
                    };
                $scope.searchformAction.reset();
            },
            //点击切换新增页面
            addPage:function(){
                $scope.subObject={};
                $scope.addModifyReqParam.list = [];
                this.showText.firstTitle=showTitle[0];
                this.AddOrModify();
                //清空【新增，修改页面往后台提交的参数】
                var _addModifyReqParam={
                    "entity":{
                        "skuId":"",
                        "skuNo":"",
                        "skuName":"",
                        "owner":"",
                        "skuBarCode":"",
                        "skuStatus":"",
                        "measureUnit":"",
                        "specModel":"",
                        "skuTypeId":"",
                        "shelflife":"",
                        "minSafetyStock":"",
                        "maxSafetyStock":"",
                        "perVolume":"",
                        "perWeight":"",
                        "note":"",
                        "attribute1":"",
                        "attribute2":"",
                        "attribute3":"",
                        "attribute4":""
                    },
                    "merchant":{
                        "merchantId":"",
                        "merchantName":""
                    },
                    "list":[]
                };
                $scope.addModifyReqParam=_addModifyReqParam;
            },
            modifyPage:function(id){//点击切换修改页面
                if(!chkItem()) return;
                $scope.subObject={};
                var d = modifyById({"entity":{"skuId":id}}, '/sku/view','请先选择一个项目');
                d.then(function(res){
                    if(res!='error'&&res!='errorId'){
                        console.log(res);
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
                if(obj.entity.skuStatus!==status){
                    tooltip('需选择状态为打开的项目进行生效！');
                    return;
                };
                var d = httpServer.postData('/sku/enable', {"entity":{"skuId":id}});
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
                if(obj.entity.skuStatus!==status){
                    tooltip('需选择状态为生效的项目进行失效！');
                    return;
                };
                var d = httpServer.postData('/sku/disable', {"entity":{"skuId":id}});
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
                if(obj.entity.skuStatus!==status){
                    tooltip('需选择状态为打开的项目进行取消！');
                    return;
                };
                var d = httpServer.postData('/sku/cancel', {"entity":{"skuId":id}});
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
            //标识跳转到查看详情页面---通用，无需修改
            showDetailAction:function(){
                this.showDetail=!this.showDetail;
                this.showIndex=!this.showIndex;
            },
            showDetailActionGetData:function(id){
                //而后进行查询数据绑定
                var d = httpServer.postData('/sku/view',{"entity":{"skuId":id}});
                d.then(function(res){
                    console.log(res);
                    if(res!='error'&&res!='errorId'){
                        //跳转到查看详情页面并绑定数据
                        $scope.viewRspParam = res;
                        $scope.btnAction.showDetailAction();
                    }
                });
            },
            //通用，无需修改
            slectOnly:function(item,_select,itemObj){
                arrayAction.selectedById(item,_select,itemObj,$scope.selectById);
            }
        };

        //列表页的查询参数begin
        //绑定查询参数，不直接绑定分页指令，防止数据改变时直接从后台查询数据
        $scope.queryReqParam={
            "entity":{
                "skuNo":"",
                "skuName":"",
                "owner":"",
                "skuStatus":""
            },
            "merchant":{
                "merchantId":"",
                "merchantName":""
            }
        };
        //空参数，方便重置时复制
        var _queryReqParam={
            "entity":{
                "skuNo":"",
                "skuName":"",
                "owner":"",
                "skuStatus":""
            },
            "merchant":{
                "merchantId":"",
                "merchantName":""
            }
        };
        //绑定分页指令数据，用于用户点击查询按钮时候从后台查询数据
        $scope.queryParam={
            "entity":{},
            "merchant":{}
        };
        //列表页的查询参数end

        //列表页的【查询，重置】按钮触发的事件---通用，无需修改
        $scope.searchformAction={
            search:function(){
                //从后台查询数据，与绑定的page指令进行双向数据绑定即可
                //不能直接把queryReqParam拷贝到queryParam，否则不会从后台查询数据
                var _pageModelQuery={};
                angular.copy($scope.queryReqParam, _pageModelQuery);
                $scope.queryParam = _pageModelQuery;
            },
            reset:function(){
                angular.copy(_queryReqParam, $scope.queryReqParam);
            }
        };

        //新增，修改页面往后台提交的参数
        $scope.addModifyReqParam={
            "entity":{},
            "skuTypeId":"",
            "merchant":{
                "merchantId":"",
                "merchantName":""
            },
            "list":[]
        };
        //从表数据
        $scope.subObject={};
        //从表操作
        $scope.detailAction={
            tooltipIsOpen:false,
            selectedAll:false,
            //是否全选
            selectAll:function(){ //进行全选操作
                if($scope.addModifyReqParam.list.length>0){
                    angular.forEach($scope.addModifyReqParam.list,function(data,index){
                        if($scope.detailAction.selectedAll){
                            $scope.addModifyReqParam.list[index].xstatus = true;
                        }else{
                            $scope.addModifyReqParam.list[index].xstatus = false;
                        }
                    });
                }
            },
            //加入列表
            addList:function(item){
                $scope.detailAction.selectedAll = false;
                $scope.detailAction.selectAll();
                if($scope.subObject.packId==null || $scope.subObject.packId==''){//判断是否为空
                    tooltip('包装单位不能为空！');
                    return false;
                };
                //TODO 包装系数不能为空
                //不允许重复
                var _canPush=true;
                angular.forEach($scope.addModifyReqParam.list, function(data,index){
                    if(data.packId==$scope.subObject.packId){
                        _canPush=false;
                        tooltip('不允许重复加入！');
                        return;
                    }
                });
                if(!_canPush) return false;
                $scope.addModifyReqParam.list.push(objectAction.newCopy($scope.subObject));
            },
            //勾选记录
            selectModify:function(index,$event){
                //去掉其他选择框勾选状态
                if($scope.addModifyReqParam.list.length > 1) {
                    $scope.detailAction.selectedAll=false;
                } else {
                    $scope.detailAction.selectedAll=true;
                }
                angular.forEach($scope.addModifyReqParam.list,function(data, i){
                    $scope.addModifyReqParam.list[i].xstatus = false;
                });
                $scope.addModifyReqParam.list[index].xstatus = true;
                //实现输入额数据绑定
                $scope.subObject = objectAction.newCopy($scope.addModifyReqParam.list[index]);
                $event.stopPropagation();
            },
            //删除明细
            deleteItem:function(){
                var _allList=[];
                angular.forEach($scope.addModifyReqParam.list,function(data,index){
                    if(!$scope.addModifyReqParam.list[index].xstatus){
                        _allList.push($scope.addModifyReqParam.list[index]);
                    }
                });
                $scope.addModifyReqParam.list=_allList;
                //清空选择项
                angular.forEach($scope.addModifyReqParam.list,function(data,index){
                    $scope.addModifyReqParam.list[index].xstatus=false;
                });
                $scope.detailAction.selectedAll = false;
            },
            //确认修改
            makeSure:function(item){
                if($scope.subObject.packId==null || $scope.subObject.packId==''){//判断是否为空
                    tooltip('包装单位不能为空！');
                    return false;
                };
                //判断是否已经在列表中的记录
                var _canPush = false;
                angular.forEach($scope.addModifyReqParam.list, function(data,index){
                    if(data.packId==$scope.subObject.packId){
                        _canPush = true;
                        return;
                    }
                });
                if(!_canPush) {
                    tooltip('记录在列表中不存在！');
                    return;
                }
                //先删除然后重新加入
                $scope.detailAction.deleteItem();
                $scope.detailAction.addList('addForm');
                $scope.subObject={};
                $scope.detailAction.selectedAll = false;
                $scope.detailAction.selectAll();
            }
        };

        //查看详情页面显示的参数---通用，无需修改
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
                if(!checkout(formName)) return;
                //通过是否存在id来判断新增还是修改
                if($scope.addModifyReqParam.entity.skuId==null || $scope.addModifyReqParam.entity.skuId==''){
                    httpServer.postData('/sku/add',$scope.addModifyReqParam).then(function(res){
                        if (res!='error'){
                            $scope.addModifyReqParam.entity.skuId = res.entity.skuId;
                            // $scope.addModifyReqParam=res;
                            tooltip('暂存成功！');
                        }
                    })
                } else {
                    httpServer.postData('/sku/update',$scope.addModifyReqParam).then(function(res){
                        if (res!='error'){
                            tooltip('暂存成功！');
                        }
                    })
                }
            },
            saveEffectBack:function(formName){
                //数据合法性校验
                if(!checkout(formName)) return;
                //通过是否存在id来判断新增还是修改
                if($scope.addModifyReqParam.entity.skuId==null || $scope.addModifyReqParam.entity.skuId==''){
                    httpServer.postData('/sku/add',$scope.addModifyReqParam).then(function(res){
                        if (res!='error'){
                            tooltip('保存成功！');
                            $scope.btnAction.AddOrModify();
                        }
                    })
                } else {
                    httpServer.postData('/sku/update',$scope.addModifyReqParam).then(function(res){
                        if (res!='error'){
                            tooltip('保存成功！');
                            $scope.btnAction.AddOrModify();
                        }
                    })
                }
            }
        };
        //新增，修改页面的【暂存，保存】按钮事件end


        //弹出框（选择客商）begin
        //列表页的查询参数begin
        //绑定查询参数，不直接绑定分页指令，防止数据改变时直接从后台查询数据
        $scope.queryReqParam1={ //个字段的顺序和前端显示顺序要一致 方便下步复用
            "entity":{
                "merchantNo":"",
                "merchantName":"",
                "contactPerson":"",
                "merchantId":""
            }
        };
        //空参数，方便重置时复制
        var _queryReqParam1={
            "entity":{
                "merchantNo":"",
                "merchantName":"",
                "contactPerson":"",
                "merchantId":""
            }
        };
        //绑定分页指令数据，用于用户点击查询按钮时候从后台查询数据
        $scope.queryParam1={
            "entity":{}
        };
        //列表页的查询参数end
        //列表页的【查询，重置】按钮触发的事件
        $scope.selectForm1={
            search:function(){
                //从后台查询数据，与绑定的page指令进行双向数据绑定即可
                //不能直接把queryReqParam拷贝到queryParam，否则不会从后台查询数据
                var _pageModelQuery={};
                angular.copy($scope.queryReqParam1, _pageModelQuery);
                $scope.queryParam1 = _pageModelQuery;
            },
            reset:function(){
                angular.copy(_queryReqParam1, $scope.queryReqParam1);
            },
            selectMerchant:function(item){
                $scope.queryReqParam.merchant.merchantName = item.entity.merchantName;
                $scope.queryReqParam.entity.owner = item.entity.merchantId;
                $scope.addModifyReqParam.merchant.merchantName = item.entity.merchantName;
                $scope.addModifyReqParam.entity.owner = item.entity.merchantId;
                $('#selectOrganizationModal').modal('hide');
            }
        };
        //弹出框（选择客商）end


        //弹出框（选择货品类型）begin
        //列表页的查询参数begin
        //绑定查询参数，不直接绑定分页指令，防止数据改变时直接从后台查询数据
        $scope.queryReqParam4SkuType={ //个字段的顺序和前端显示顺序要一致 方便下步复用
            "entity":{
                "skuTypeNo":"",
                "skuTypeName":"",
                "skuTypeStatus":"",
                "skuTypeId":"",
                "parentId":""
            }
        };
        //空参数，方便重置时复制
        var _queryReqParam4SkuType={
            "entity":{
                "skuTypeNo":"",
                "skuTypeName":"",
                "skuTypeStatus":"",
                "skuTypeId":"",
                "parentId":""
            }
        };
        //绑定分页指令数据，用于用户点击查询按钮时候从后台查询数据
        $scope.queryParam4SkuType={
            "entity":{}
        };
        //列表页的查询参数end
        //选中的货品类型id与名称
        $scope.selectedSkuType={};
        $scope.$watch('selectedSkuType',function(newV,oldV){
            if(newV){
                $scope.addModifyReqParam.skuTypeId = newV.skuTypeName;
                $scope.addModifyReqParam.entity.skuTypeId = newV.skuTypeId;
            };
        },true);
        //列表页的【查询，重置】按钮触发的事件
        $scope.selectForm4SkuType={
            search:function(){
                //从后台查询数据，与绑定的page指令进行双向数据绑定即可
                //不能直接把queryReqParam拷贝到queryParam，否则不会从后台查询数据
                var _pageModelQuery={};
                angular.copy($scope.queryReqParam4SkuType, _pageModelQuery);
                $scope.queryParam4SkuType = _pageModelQuery;
            },
            reset:function(){
                angular.copy(_queryReqParam4SkuType, $scope.queryReqParam4SkuType);
            },
            select:function(item){
                $scope.selectedSkuType.skuTypeId=item.entity.skuTypeId;
                $scope.selectedSkuType.skuTypeName=item.entity.skuTypeName;
                $('#selectSkuTypeModal').modal('hide');
            }
        };
        //弹出框（选择货品类型）end


        //弹出框（选择包装）begin
        //列表页的查询参数begin
        //绑定查询参数，不直接绑定分页指令，防止数据改变时直接从后台查询数据
        $scope.queryReqParam4Pack={ //个字段的顺序和前端显示顺序要一致 方便下步复用
            "entity":{
            }
        };
        //空参数，方便重置时复制
        var _queryReqParam4Pack={
            "entity":{
            }
        };
        //绑定分页指令数据，用于用户点击查询按钮时候从后台查询数据
        $scope.queryParam4Pack={
            "entity":{}
        };
        //列表页的查询参数end
        //列表页的【查询，重置】按钮触发的事件
        $scope.selectForm4Pack={
            search:function(){
                //从后台查询数据，与绑定的page指令进行双向数据绑定即可
                //不能直接把queryReqParam拷贝到queryParam，否则不会从后台查询数据
                var _pageModelQuery={};
                angular.copy($scope.queryReqParam4Pack, _pageModelQuery);
                $scope.queryParam4Pack = _pageModelQuery;
            },
            reset:function(){
                angular.copy(_queryReqParam4Pack, $scope.queryReqParam4Pack);
            },
            select:function(item){
                $scope.subObject = item.entity;
                $('#selectPackModel').modal('hide');
            }
        };
        //弹出框（选择包装）end

}]).name;
