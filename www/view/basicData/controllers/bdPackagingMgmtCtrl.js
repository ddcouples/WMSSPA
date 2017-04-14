'use strict';
module.exports = angular.module("app.basicData").controller("bdPackagingMgmtCtrl",
    ['$scope','tooltip','modifyById','arrayAction','httpServer','objectAction','scrollObj',
    function($scope,tooltip,modifyById,arrayAction,httpServer,objectAction,scrollObj) {

        //新增修改页面的标题内容
        var showTitle=['新增包装','修改包装','查看包装'];

        //初始化数据
        $scope.getOriginData={
            status:[
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
                this.showText.firstTitle=showTitle[0];
                this.AddOrModify();
                //清空【新增，修改页面往后台提交的参数】
                var _addModifyReqParam={
                    "entity":{}
                };
                $scope.addModifyReqParam=_addModifyReqParam;
            },
            //点击切换修改页面
            modifyPage:function(id){
                if(!chkItem()) return;
                var d = httpServer.postData('/pack/view', {"entity":{"packId":id}});
                d.then(function(res){
                    if(res!='error'){
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
                if(obj.entity.packStatus!==status){
                    tooltip('需选择状态为打开的项目进行生效！');
                    return;
                };
                var d = httpServer.postData('/pack/enable', {"entity":{"packId":id}});
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
                if(obj.entity.packStatus!==status){
                    tooltip('需选择状态为生效的项目进行失效！');
                    return;
                };
                var d = httpServer.postData('/pack/disable', {"entity":{"packId":id}});
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
                if(obj.entity.packStatus!==status){
                    tooltip('需选择状态为打开的项目进行取消！');
                    return;
                };
                var d = httpServer.postData('/pack/cancel', {"entity":{"packId":id}});
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
            //显示DIV层---通用
            searchModel:function(id){
                $('#'+id).modal('show');
            },
            showDetail:false,
            //标识跳转到查看详情页面---通用，无需修改
            showDetailAction:function(){
                this.showDetail=!this.showDetail;
                this.showIndex=!this.showIndex;
            },
            //查看详情页面后台数据查询
            showDetailActionGetData:function(id){
                var d = httpServer.postData('/pack/view',{"entity":{"packId":id}});
                d.then(function(res){
                    console.log(res);
                    if(res!='error'){
                        //跳转到查看详情页面并绑定数据
                        $scope.viewRspParam = res;
                        $scope.btnAction.showText.firstTitle=showTitle[2];
                        $scope.btnAction.showDetailAction();
                    };
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
            "entity":{}
        };
        //空参数，方便重置时复制
        var _queryReqParam={
            "entity":{}
        };
        //绑定分页指令数据，用于用户点击查询按钮时候从后台查询数据
        $scope.queryParam={
            "entity":{}
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
            "entity":{}
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
                if($scope.addModifyReqParam.entity.packId==null || $scope.addModifyReqParam.entity.packId==''){
                    httpServer.postData('/pack/add',$scope.addModifyReqParam).then(function(res){
                        if (res!='error' && res.entity!=null && res.entity.packId != null){
                            console.log(res);
                            $scope.addModifyReqParam.entity.packId = res.entity.packId;
                            // $scope.addModifyReqParam=res;
                            tooltip('暂存成功！');
                        } else if(res.entity == null || res.entity.packId == null){
                            tooltip('暂存失败！');
                        }
                    })
                } else {
                    httpServer.postData('/pack/update',$scope.addModifyReqParam).then(function(res){
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
                if($scope.addModifyReqParam.entity.packId==null || $scope.addModifyReqParam.entity.packId==''){
                    httpServer.postData('/pack/add',$scope.addModifyReqParam).then(function(res){
                        if (res!='error'){
                            tooltip('保存成功！');
                            $scope.btnAction.AddOrModify();
                        }
                    })
                } else {
                    httpServer.postData('/pack/update',$scope.addModifyReqParam).then(function(res){
                        if (res!='error'){
                            tooltip('保存成功！');
                            $scope.btnAction.AddOrModify();
                        }
                    })
                }
            }
        };
        //新增，修改页面的【暂存，保存】按钮事件end

}]).name;
