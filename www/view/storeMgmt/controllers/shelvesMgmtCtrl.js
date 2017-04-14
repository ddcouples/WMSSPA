'use strict';
module.exports = angular.module("app.storeMgmt")
    .controller("shelvesMgmtCtrl",
        ['$scope','commit','httpServer','objectAction','$filter','tooltip','arrayAction',
            function($scope,commit,httpServer,objectAction,$filter,tooltip,arrayAction) {

        $scope.listptw_url = "/ptw/list";
        var url = {
            'showParam_url' : '/param/show' ,
            'saveptw_url' : '/ptw/save' ,
            'viewptw_url' : '/ptw/view' ,
            'updateptw_url' : '/ptw/update' ,
            'activeptw_url' : '/ptw/enable' ,
            'inactiveptw_url' : '/ptw/disable'
        };

        var cacheName = {
            'PUTAWAYSTATUS' : 'PUTAWAYSTATUS'
        };


        var err = {
            'err_ptw_notSelected' : '请选择列表中一项，再进行操作!' ,
            'err_ptw_selectOne' : '只能选取其中一项，进行操作'
        };
        

        // 页面请求参数表数据
        httpServer.postData(url.showParam_url,[cacheName.PUTAWAYSTATUS]).then(function(res){
            $scope.getOriginData = res;
        });
                
        var showTitle=['新增上架单','修改上架单'];
        $scope.putawayVO={};
        $scope.searchPtwAction={
            showText:{
                firstTitle:showTitle[0]
            },
            selectedAll : false , // 全选按钮默认不选中
            showAddOrModify:false,
            showSplitAsn:false,
            showIndex:true,
            currentSelectItems : 9999 ,
            selectedItems : [] ,
            listVO : [] ,      // 分页列表
            voModel : new PutawayVO() , //   仓库查询条件
            active : function () {
                if ( !$scope.searchPtwAction.selectedItems || $scope.searchPtwAction.selectedItems.length == 0 ) {
                    tooltip(err.err_ptw_notSelected);
                    return ;
                }
                var ptwIds = [];
                for( var i = 0 ; i < $scope.searchPtwAction.selectedItems.length ; i++ ) {
                    if ( !$scope.searchPtwAction.selectedItems[i]
                        || $scope.searchPtwAction.selectedItems[i] == false
                        || $scope.searchPtwAction.listVO.length <= i ) {
                        continue;
                    }
                    var recPtwVO = $scope.searchPtwAction.listVO[i];
                    ptwIds.push(recPtwVO.putaway.putawayId);
                }
                if ( ptwIds.length == 0 ) {
                    tooltip(err.err_ptw_notSelected);
                    return ;
                } else if ( ptwIds.length > 1 ) {
                    tooltip(err.err_ptw_selectOne);
                    return;
                }
                httpServer.postData(url.activeptw_url,ptwIds).then(function(res){
                    if ( res != 'error' ) {
                        tooltip("生效成功");
                        $scope.searchPtwAction.clearSelect();
                        $scope.searchPtwAction.search();
                    }
                });
            } ,
            inactive : function () {
                if ( !$scope.searchPtwAction.selectedItems || $scope.searchPtwAction.selectedItems.length == 0 ) {
                    tooltip(err.err_ptw_notSelected);
                    return ;
                }
                var ptwIds = [];
                for( var i = 0 ; i < $scope.searchPtwAction.selectedItems.length ; i++ ) {
                    if ( !$scope.searchPtwAction.selectedItems[i]
                        || $scope.searchPtwAction.selectedItems[i] == false
                        || $scope.searchPtwAction.listVO.length <= i ) {
                        continue;
                    }
                    var recPtwVO = $scope.searchPtwAction.listVO[i];
                    ptwIds.push(recPtwVO.putaway.putawayId);
                }
                if ( ptwIds.length == 0 ) {
                    tooltip(err.err_ptw_notSelected);
                    return ;
                } else if ( ptwIds.length > 1 ) {
                    tooltip(err.err_ptw_selectOne);
                    return;
                }
                httpServer.postData(url.inactiveptw_url,ptwIds).then(function(res){
                    if ( res != 'error' ) {
                        tooltip("失效成功");
                        $scope.searchPtwAction.clearSelect();
                        $scope.searchPtwAction.search();

                    }
                });
            } ,
            search : function () {
                $scope.indexModule.shelvesIndexModelQuery = [];
                if ( $scope.searchPtwAction.voModel.putawayStatusComment != "" ) {
                    var listStatus = $scope.getOriginData[cacheName.PUTAWAYSTATUS];
                    for ( var i = 0 ; i < listStatus.length ; i++ ) {
                        var s = listStatus[i];
                        if ( s.value == $scope.searchPtwAction.voModel.putawayStatusComment ) {
                            $scope.searchPtwAction.voModel.putaway.putawayStatus = s.key;
                            break;
                        }
                    }
                } else {
                    $scope.searchPtwAction.voModel.putaway.putawayStatus = '';
                }
                $scope.indexModule.shelvesIndexModelQuery = Object.assign({},$scope.searchPtwAction.voModel);
            } ,
            // 多选复选框
            selectAll : function () {
                if ( $scope.searchPtwAction.listVO.length>0 ) {
                    angular.forEach($scope.searchPtwAction.listVO,function(data,index){
                        if($scope.searchPtwAction.selectedAll){
                            $scope.searchPtwAction.selectedItems[index]=true;
                        }else{
                            $scope.searchPtwAction.selectedItems[index]=false;
                        }
                    });
                }
            } , // 多选复选框 end
            reset : function () {
                $scope.searchPtwAction.voModel = new PutawayVO();
            } ,
            // 选中单选框
            selectModify:function(index,$event){
                this.currentSelectItems=index;
                //点击进行是否选择操作
                $scope.searchPtwAction.selectedItems[index]=!$scope.searchPtwAction.selectedItems[index];
                // 如果该点击项不是选中状态就将全部选中状态去掉
                $scope.searchPtwAction.selectedAll=false;
                var allCheck = true;
                angular.forEach($scope.searchPtwAction.listVO,function(data,i){
                    if(!$scope.searchPtwAction.selectedItems[i]){
                        allCheck = false;
                        // return false;
                    }
                });
                if ( allCheck ) {
                    $scope.searchPtwAction.selectedAll=true;
                }
            } , // 选中单选框 end
            // 清空单选框
            clearSelect : function () {
                angular.forEach ($scope.searchPtwAction.selectedItems,function( data , i ){
                    $scope.searchPtwAction.selectedItems[i] = false;
                }) ;
            } , // 清空单选框
            
            addModShow:function(){
                this.showAddOrModify=!this.showAddOrModify;
                this.showIndex=!this.showIndex;
            },
            addAsn:function(){ //点击切换新增ASN页面
                $scope.shelvesAddModify.asnVos = [];
                $scope.shelvesAddModify.asnDetailVos = [];
                httpServer.postData('/asn/listStock',null).then(function(res){
                   if(res!="error"){
                       $scope.searchPtwAction.showText.firstTitle=showTitle[0];
                       $scope.shelvesAddModify.asnVos=res;
                       $scope.searchPtwAction.addModShow();
                       arrayAction.copyToDouble($scope.shelvesAddModify.asnVos,$scope.shelvesAddModify.asnDetailVos,'listAsnDetailVO');
                       //ANDY 如果页面格式修改  一次请求的时候把数据相应的绑定
                   }
                });

                $scope.shelvesAddModify.shelvesVo= new PutawayVO();
            },
            modifyAsn:function(){//点击切换修改ASN页面
                if ( !$scope.searchPtwAction.selectedItems || $scope.searchPtwAction.selectedItems.length == 0 ) {
                    tooltip(err.err_ptw_notSelected);
                    return ;
                }
                var ptwIds = [];
                for( var i = 0 ; i < $scope.searchPtwAction.selectedItems.length ; i++ ) {
                    if ( !$scope.searchPtwAction.selectedItems[i]
                        || $scope.searchPtwAction.selectedItems[i] == false
                        || $scope.searchPtwAction.listVO.length <= i ) {
                        continue;
                    }
                    var recPtwVO = $scope.searchPtwAction.listVO[i];
                    if ( recPtwVO.putaway.putawayStatus != 10 ) {
                        tooltip("上架单状态为打开时，才能进行上架单更新操作!");
                        return ;
                    }
                    ptwIds.push(recPtwVO.putaway.putawayId);
                }
                if ( ptwIds.length == 0 ) {
                    tooltip(err.err_ptw_notSelected);
                    return ;
                } else if ( ptwIds.length > 1 ) {
                    tooltip(err.err_ptw_selectOne);
                    return;
                }
                //进入修改页面
                httpServer.postData('/ptw/find',ptwIds[0]).then(function(res){
                    $scope.shelvesAddModify.putawayVO=res;
                    $scope.shelvesAddModify.shelvesVo = objectAction.newCopy(res);
                    $scope.searchPtwAction.showText.firstTitle=showTitle[1];
                    $scope.shelvesAddModify.shelvesVo.listSavePutawayDetailVO = $scope.shelvesAddModify.putawayVO.listPutawayDetailVO;
                    $scope.shelvesAddModify.isUpdate = true;
                    httpServer.postData('/asn/listStock',null).then(function(res){
                        if(res!="error"){
                            $scope.shelvesAddModify.asnVos=res;
                            $scope.searchPtwAction.addModShow();
                            arrayAction.copyToDouble($scope.shelvesAddModify.asnVos,$scope.shelvesAddModify.asnDetailVos,'listAsnDetailVO');
                            for ( var j = 0 ; j < $scope.shelvesAddModify.asnDetailVos.length ; j++ ) {
                                var asnDetailVO = $scope.shelvesAddModify.asnDetailVos[j];
                                asnDetailVO.isDown = false;
                                for ( var i = 0 ; i < $scope.shelvesAddModify.putawayVO.listPutawayDetailVO.length ; i++ ) {
                                    var ptwDetailVO = $scope.shelvesAddModify.putawayVO.listPutawayDetailVO[i];
                                    var ptwDetail = ptwDetailVO.putawayDetail;
                                    if ( asnDetailVO.asnDetail.asnDetailId == ptwDetail.asnDetailId ) {
                                        asnDetailVO.isDown = true;
                                        break;
                                    }
                                }
                            }
                            $scope.shelvesAddModify.sumQty();
                            $scope.shelvesAddModify.syncAsnCheck();
                            $scope.shelvesAddModify.calAsnNoPoNo();
                            // angular.forEach( $scope.shelvesAddModify.asnVos , function(asnVO,i){
                            //     var asn = asnVO.asn;
                            //     asnVO.isDown = false;
                            //     for ( var j = 0 ; j < $scope.shelvesAddModify.asnDetailVos.length ; j++ ) {
                            //         var asnDetailVO = $scope.shelvesAddModify.asnDetailVos[j];
                            //         if ( asnDetailVO.asnDetail.asnId == asn.asnId && asnDetailVO.isDown == true ) {
                            //             asnVO.isDown = true;
                            //             break;
                            //         }
                            //     }
                            // });
                            //ANDY 如果页面格式修改  一次请求的时候把数据相应的绑定
                        }
                    });
                })
            },
            splitAsn:function(){//点击切换拆分ASN页面
                this.showIndex=!this.showIndex;
                this.showSplitAsn=!this.showSplitAsn;
            },
            searchModel:function(id){
                $('#'+id).modal('show');
            },
            MakeSureWork:false,
            makeSureTurnPage:function(){
                this.MakeSureWork=!this.MakeSureWork;
                this.showIndex=!this.showIndex;
            },
            MakeSureWorkBtn:function(){//点击切换收货确认
                if ( !$scope.searchPtwAction.selectedItems || $scope.searchPtwAction.selectedItems.length == 0 ) {
                    tooltip(err.err_ptw_notSelected);
                    return ;
                }
                var ptwIds = [];
                for( var i = 0 ; i < $scope.searchPtwAction.selectedItems.length ; i++ ) {
                    if ( !$scope.searchPtwAction.selectedItems[i]
                        || $scope.searchPtwAction.selectedItems[i] == false
                        || $scope.searchPtwAction.listVO.length <= i ) {
                        continue;
                    }
                    var recPtwVO = $scope.searchPtwAction.listVO[i];
                    if ( recPtwVO.putaway.putawayStatus != 20 ) {
                        tooltip("上架单状态为生效或者工作中时，才能进行上架单确认操作!");
                        return ;
                    }
                    ptwIds.push(recPtwVO.putaway.putawayId);
                }
                if ( ptwIds.length == 0 ) {
                    tooltip(err.err_ptw_notSelected);
                    return ;
                } else if ( ptwIds.length > 1 ) {
                    tooltip(err.err_ptw_selectOne);
                    return;
                }
                //进入确认作业页面
                httpServer.postData('/ptw/find',ptwIds[0]).then(function(res){
                    $scope.putawayVO=res;
                    angular.forEach($scope.putawayVO.listPutawayDetailVO,function(data,index){
                        $scope.putawayVO.listPutawayDetailVO[index].listRealLocationVO=[];
                        angular.forEach(data.listPlanLocationVO,function(d,i){
                            //d是对象 存的是地址  所以要新建
                            d.putawayLocation.putawayWeight=$filter('number')(d.putawayLocation.putawayWeight,2);
                            d.putawayLocation.putawayVolume=$filter('number')(d.putawayLocation.putawayVolume,2);
                            $scope.putawayVO.listPutawayDetailVO[index].listRealLocationVO.push(objectAction.newCopy(d));
                        });
                    });
                    $scope.searchPtwAction.makeSureTurnPage();
                })
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
            }
        }


        $scope.indexModule={
            shelvesIndexModelQuery:{}
        };


        /*
          *   新增页面逻辑
          *
         * */
        $scope.shelvesAddModify={
            asnVos:[],//asn单
            asnDetailVos:[],//asn明细单
            selectAllAsn:false,//asn单和货品单的全选
            selectAsnAction:function(){
                switch(arguments[0]){
                    case 0:
                        var item=arguments[1];
                        var item2=arguments[2];
                        if(this.selectAllAsn){
                            if(item){
                                angular.forEach(item,function(data){
                                    data['selectedStatus']=true;
                                })
                            }
                            if(item2){
                                angular.forEach(item2,function(data){
                                    data['selectedStatus']=true;
                                })
                            }


                        }else{
                            if(item){
                                angular.forEach(item,function(data){
                                    data['selectedStatus']=false;
                                })
                            }
                            if(item2){
                                angular.forEach(item2,function(data){
                                    data['selectedStatus']=false;
                                })
                            }

                        };
                        break;
                    case 1:
                        this.selectAllAsn=false;
                        var targetArray=arguments[1];
                        var sourceObj=arguments[2];
                        if(sourceObj.selectedStatus){
                            sourceObj.selectedStatus=false;
                        }else{
                            sourceObj.selectedStatus=true;
                        }
                        var baseSourceArray=arguments[5];

                        if(baseSourceArray){
                            var _allSelectGood=true;
                            angular.forEach(baseSourceArray,function(data){
                                if(!data.selectedStatus&&!data.isDown){
                                    _allSelectGood=false;
                                }
                            });
                            if(_allSelectGood){
                                this.selectAllAsn=true;
                            }else{
                                this.selectAllAsn=false;
                            }
                        }

                        var arg=arguments[3];
                        var baseArg=objectAction.findProp(sourceObj,arg);
                        var targetArg=arguments[4];
                        var doChange=true;
                        angular.forEach(baseSourceArray,function (data,index) {
                            var _base=objectAction.findProp(data,arg);
                            if(!data.selectedStatus&&_base==baseArg&&!data.isDown){
                                doChange=false;
                            }
                        });

                        if(doChange){
                            angular.forEach(targetArray,function(data){
                                var _baseArg=objectAction.findProp(data,targetArg);
                                if(_baseArg==baseArg&&!data.isDown){
                                    data['selectedStatus']=true;
                                }
                            });
                        }else{
                            angular.forEach(targetArray,function(data){
                                var _baseArg=objectAction.findProp(data,targetArg);
                                if(_baseArg==baseArg&&!data.isDown){
                                    data['selectedStatus']=false;
                                }
                            });
                        }
                        break;
                    case 2:
                        this.selectAllAsn=false;
                        var targetArray2=arguments[1];
                        var sourceObj2=arguments[2];
                        var arg2=arguments[3];
                        var targetArg2=arguments[4];
                        if(sourceObj2.selectedStatus){
                            sourceObj2.selectedStatus=false;
                        }else{
                            sourceObj2.selectedStatus=true;
                        }
                        var baseSourceArray2=arguments[5];

                        if(baseSourceArray2){
                            var _allSelect=true;
                            angular.forEach(baseSourceArray2,function(data){
                                if(!data.selectedStatus&&!data.isDown){
                                    _allSelect=false;
                                }
                            });
                            if(_allSelect){
                                this.selectAllAsn=true;
                            }else{
                                this.selectAllAsn=false;
                            }
                        }

                        var baseArg2=objectAction.findProp(sourceObj2,arg2);

                        angular.forEach(targetArray2,function(data){
                            var _baseArg=objectAction.findProp(data,targetArg2);
                            if(_baseArg==baseArg2&&!data.isDown){
                                if(sourceObj2.selectedStatus){
                                    data['selectedStatus']=true;
                                }else{
                                    data['selectedStatus']=false;
                                }
                            }
                        });
                        break;
                }

            }, //asn单选择操作
            shelvesVo:new PutawayVO(), //新增 修改页面结构
            detailSelAll:false, //选中的货品明细 可以进行添加上面
            detailSelAllAction:function(){ //对需要删除的货品明细进行操作  根据传入参数进行处理
                switch(arguments[0]) {
                    case 0:
                        var item = arguments[1];
                        if (this.detailSelAll) {
                            angular.forEach(item, function (data) {
                                data['selectedStatus'] = true;
                            })
                        } else {
                            angular.forEach(item, function (data) {
                                data['selectedStatus'] = false;
                            });
                        };
                        break;
                    case 1:
                        var sourceObj=arguments[2];
                        this.detailSelAll=false;
                        var _objs=arguments[1];
                        if(sourceObj.selectedStatus){
                            sourceObj.selectedStatus=false;
                        }else{
                            sourceObj.selectedStatus=true;
                        }
                        var _allSelect=true;
                        angular.forEach(_objs,function(data){
                            if(!data.selectedStatus){
                                _allSelect=false;
                            }
                        });
                        if(_allSelect){
                            this.detailSelAll=true;
                        }else{
                            this.detailSelAll=false;
                        }

                        this.selectAsnDetailIndex=arguments[3];
                        console.log($scope.shelvesAddModify.shelvesVo.listSavePutawayDetailVO[$scope.shelvesAddModify.selectAsnDetailIndex]);
                        break;
                }
            }, //
            isUpdate : false ,
            syncAsnCheck : function () {
                angular.forEach( $scope.shelvesAddModify.asnVos , function(asnVO,i){
                    var asn = asnVO.asn;
                    var isD = true;
                    for ( var j = 0 ; j < $scope.shelvesAddModify.asnDetailVos.length ; j++ ) {
                        var asnDetailVO = $scope.shelvesAddModify.asnDetailVos[j];
                        if ( asnDetailVO.asnDetail.asnId == asn.asnId && asnDetailVO.isDown == false ) {
                            isD = false;
                            break;
                        }
                    }
                    asnVO.isDown = isD;
                });
            } ,
            //进行添加 删除 自动分配操作
            doAsnAddDel:function(){
                switch (arguments[0]){
                    case 0://添加到列表
                        var _emptySelect=true;
                        angular.forEach($scope.shelvesAddModify.asnDetailVos,function(data){
                            if(!data.isDown&&data.selectedStatus){
                                _emptySelect=false;
                            }
                        });
                        if(_emptySelect){
                            tooltip('请选择asn单项目或者货品项目！')
                        }

                        angular.forEach($scope.shelvesAddModify.asnDetailVos,function (data) {
                            if(data.isDown){
                                return;
                            }
                            if(data.selectedStatus){
                                var _putawayDetailVO=new PutawayDetailVO();
                                _putawayDetailVO.putawayDetail = new PutawayDetail();
                                _putawayDetailVO.putawayDetail.asnId=data.asnDetail.asnId;
                                _putawayDetailVO.putawayDetail.asnDetailId=data.asnDetail.asnDetailId;
                                _putawayDetailVO.putawayDetail.locationId=data.asnDetail.locationId;
                                _putawayDetailVO.putawayDetail.owner = data.asnDetail.owner;
                                _putawayDetailVO.skuNo=data.skuNo;
                                _putawayDetailVO.skuComment=data.skuComment;
                                _putawayDetailVO.putawayDetail.batchNo=data.asnDetail.batchNo;
                                _putawayDetailVO.specModelComment=data.specModelComment;
                                _putawayDetailVO.putawayDetail.measureUnit=data.asnDetail.measureUnit;
                                _putawayDetailVO.orderQty=data.asnDetail.orderQty;
                                _putawayDetailVO.orderWeight=data.asnDetail.orderWeight;
                                _putawayDetailVO.orderVolume=data.asnDetail.orderVolume;
                                _putawayDetailVO.receiveQty=data.asnDetail.receiveQty;
                                _putawayDetailVO.receiveWeight=data.asnDetail.receiveWeight;
                                _putawayDetailVO.receiveVolume=data.asnDetail.receiveVolume;
                                _putawayDetailVO.stockQty=data.stockQty;
                                _putawayDetailVO.stockWeight=data.stockWeight;
                                _putawayDetailVO.stockVolume=data.stockVolume;
                                _putawayDetailVO.putawayDetail.planPutawayQty=data.asnDetail.receiveQty;
                                _putawayDetailVO.putawayDetail.planPutawayWeight=data.asnDetail.receiveWeight;
                                _putawayDetailVO.putawayDetail.planPutawayVolume=data.asnDetail.receiveVolume;

                                var putawayLocationVO=new PutawayLocationVO();
                                putawayLocationVO.putawayLocation.putawayQty=_putawayDetailVO.putawayDetail.planPutawayQty;
                                putawayLocationVO.putawayLocation.putawayWeight=_putawayDetailVO.putawayDetail.planPutawayWeight;
                                putawayLocationVO.putawayLocation.putawayVolume=_putawayDetailVO.putawayDetail.planPutawayVolume;
                                _putawayDetailVO.listPlanLocationVO.push(putawayLocationVO);
                                $scope.shelvesAddModify.shelvesVo.listSavePutawayDetailVO.push(_putawayDetailVO);

                                data.isDown=true;
                            }else{
                                data.isDown=false;
                            }
                        });


                        $scope.shelvesAddModify.syncAsnCheck();

                        // angular.forEach($scope.shelvesAddModify.asnVos,function(data){
                        //     if(!data.selectedStatus){
                        //        data.isDown=false;
                        //     }else{
                        //         data.isDown=true;
                        //         if ( totalAsnNo.length == 0 ) {
                        //             totalAsnNo = data.asn.asnNo;
                        //         } else {
                        //             totalAsnNo += ","+ data.asn.asnNo;
                        //         }
                        //         if ( totalPoNo.length == 0 ) {
                        //             totalPoNo = data.asn.poNo;
                        //         } else {
                        //             totalPoNo += ","+ data.asn.poNo;
                        //         }
                        //     }
                        // });


                        if($scope.shelvesAddModify.shelvesVo.listSavePutawayDetailVO.length<=0){
                            tooltip('请选择asn单项目或者货品项目！')
                        }

                        var _empty=true;
                        angular.forEach($scope.shelvesAddModify.asnDetailVos,function(data){
                            if(!data.isDown){
                                _empty=false;
                            }
                        });
                        if(_empty){
                            $scope.shelvesAddModify.selectAllAsn=false;
                        }

                        //ANDY  添加的时候遍历$scope.shelvesAddModify.shelvesVo.listSavePutawayDetailVO货品明细列表

                        $scope.shelvesAddModify.sumQty();
                        $scope.shelvesAddModify.calAsnNoPoNo();

                        // 取到所有的字段添加到 $scope.shelvesAddModify.shelvesVo 当前页面的数据view

                        break;
                    case 1://删除到列表
                        var _del=[];
                        var _residue=[];
                        angular.forEach($scope.shelvesAddModify.shelvesVo.listSavePutawayDetailVO,function(data){
                            if(data['selectedStatus']){
                               _del.push(data);
                            }else{
                                _residue.push(data);
                            }
                        });
                        $scope.shelvesAddModify.isUpdate
                        $scope.shelvesAddModify.shelvesVo.listSavePutawayDetailVO=_residue;
                        if(_del.length<=0){
                            tooltip('请选择货品项目进行删除！');
                            return;
                        }
                        if($scope.shelvesAddModify.shelvesVo.listSavePutawayDetailVO.length==0){
                            this.detailSelAll=false;
                        }
                        angular.forEach(_del,function(data){
                            // 比对asnid
                             var baseAsnId=objectAction.findProp(data,'putawayDetail.asnId');
                             var baseAsnDetailId=objectAction.findProp(data,'putawayDetail.asnDetailId');
                             var baseLocationId=objectAction.findProp(data,'putawayDetail.locationId');
                             angular.forEach($scope.shelvesAddModify.asnVos,function(asnVosData){
                                 var _targetAsnId=objectAction.findProp(asnVosData,'asn.asnId');
                                 if(!asnVosData.isDown) return;
                                 if(baseAsnId==_targetAsnId){
                                     asnVosData.isDown=false;
                                 }else{
                                     asnVosData.isDown=true;
                                 }
                             });
                            angular.forEach($scope.shelvesAddModify.asnDetailVos,function(asnDetailVosData){
                                //货品比对货品id
                                var _asnDetailId=objectAction.findProp(asnDetailVosData,'asnDetail.asnDetailId');
                                var _locationId=objectAction.findProp(asnDetailVosData,'asnDetail.locationId');
                                if(!asnDetailVosData.isDown) return;
                                if( baseAsnDetailId==_asnDetailId && baseLocationId==_locationId ){
                                    asnDetailVosData.isDown=false;
                                }else{
                                    asnDetailVosData.isDown=true;
                                }
                            });
                        });
                        var _selectAll=true;
                        angular.forEach($scope.shelvesAddModify.asnDetailVos,function(data){
                            if(!data.selectedStatus){
                                _selectAll=false;
                            }
                        });
                        if(_selectAll){
                            $scope.shelvesAddModify.selectAllAsn=true;
                        }
                        this.selectAsnDetailIndex=0;
                        $scope.shelvesAddModify.sumQty();
                        $scope.shelvesAddModify.calAsnNoPoNo();
                        break;
                }
            },
            sumQty : function () {
                var totalReceiveQty = 0;
                var totalReceiveWeight = 0;
                var totalReceiveVolume = 0;
                var totalOrderQty = 0;
                var totalOrderWeight = 0;
                var totalOrderVolume = 0;
                var totalPtwQty = 0;
                var totalPtwWeight = 0;
                var totalPtwVolume = 0;
                angular.forEach($scope.shelvesAddModify.shelvesVo.listSavePutawayDetailVO,function(data,i){
                    // 统计数量
                    var ptwDetailVO = $scope.shelvesAddModify.shelvesVo.listSavePutawayDetailVO[i];
                    totalOrderQty += ptwDetailVO.orderQty;
                    totalOrderWeight += ptwDetailVO.orderWeight;
                    totalOrderVolume += ptwDetailVO.orderVolume;
                    totalReceiveQty += ptwDetailVO.receiveQty==null?0:ptwDetailVO.receiveQty;
                    totalReceiveWeight += ptwDetailVO.receiveWeight==null?0:ptwDetailVO.receiveWeight;
                    totalReceiveVolume += ptwDetailVO.receiveVolume==null?0:ptwDetailVO.receiveVolume;
                    var listPtwLoc = ptwDetailVO.listPlanLocationVO;
                    var planQty = 0;
                    var planWeight = 0;
                    var planVolume = 0;
                    for ( var j = 0 ; j < listPtwLoc.length ; j++ ) {
                        var ptwLocVO = listPtwLoc[j];
                        planQty += ptwLocVO.putawayLocation.putawayQty==null?0:parseInt(ptwLocVO.putawayLocation.putawayQty);
                        planWeight += ptwLocVO.putawayLocation.putawayWeight==null?0:parseFloat(ptwLocVO.putawayLocation.putawayWeight);
                        planVolume += ptwLocVO.putawayLocation.putawayVolume==null?0:parseFloat(ptwLocVO.putawayLocation.putawayVolume);
                    }
                    ptwDetailVO.putawayDetail.planPutawayQty = planQty;
                    ptwDetailVO.putawayDetail.planPutawayWeight = planWeight;
                    ptwDetailVO.putawayDetail.planPutawayVolume = planVolume;
                    totalPtwQty += planQty;
                    totalPtwWeight += planWeight;
                    totalPtwVolume += planVolume;
                });
                $scope.shelvesAddModify.shelvesVo.orderQty = totalOrderQty;
                $scope.shelvesAddModify.shelvesVo.orderWeight = totalOrderWeight;
                $scope.shelvesAddModify.shelvesVo.orderVolume = totalOrderVolume;
                $scope.shelvesAddModify.shelvesVo.receiveQty = totalReceiveQty;
                $scope.shelvesAddModify.shelvesVo.receiveWeight = totalReceiveWeight;
                $scope.shelvesAddModify.shelvesVo.receiveVolume = totalReceiveVolume;
                $scope.shelvesAddModify.shelvesVo.putaway.planQty = totalPtwQty;
                $scope.shelvesAddModify.shelvesVo.putaway.planWeight = totalPtwWeight;
                $scope.shelvesAddModify.shelvesVo.putaway.planVolume = totalPtwVolume;
            } ,
            calAsnNoPoNo : function () {
                var totalAsnNo = "";
                var totalPoNo = "";
                angular.forEach( $scope.shelvesAddModify.asnVos , function(asnVO,i) {
                    // 双循环
                    // 添加判断明细
                    var isAppend = false;
                    for ( var j = 0 ; j < $scope.shelvesAddModify.asnDetailVos.length ; j++ ) {
                        var asnDetailVO = $scope.shelvesAddModify.asnDetailVos[j];
                        if ( asnDetailVO.asnDetail.asnId != asnVO.asn.asnId ) {
                            continue;
                        }
                        if ( asnDetailVO.isDown == true ) {
                            isAppend = true;
                            break;
                        }
                    }
                    if ( isAppend == false ) {
                        return;
                    }
                    if ( totalAsnNo.length == 0 ) {
                        totalAsnNo = asnVO.asn.asnNo;
                    } else {
                        totalAsnNo += ","+ asnVO.asn.asnNo;
                    }
                    if ( totalPoNo.length == 0 ) {
                        totalPoNo = asnVO.asn.poNo;
                    } else {
                        totalPoNo += ","+ asnVO.asn.poNo;
                    }
                });
                $scope.shelvesAddModify.shelvesVo.putaway.asnNo = totalAsnNo;
                $scope.shelvesAddModify.shelvesVo.putaway.poNo = totalPoNo;
            } ,
            selectAsnDetailIndex:'0', //当前选中的货品明细项目
            selPutawayLocationVOsIndex:'0',//当前选中的货品明细中一条数据对应的计划上架数量 某一项
            doSelPutawayLocationVOsIndex:function(index){ //选中某一个货品明细项目
                this.selPutawayLocationVOsIndex=index;
            },
            addPutawayLocationVO:function(){ //添加一列计划上架
                var putawayLocationVO=new PutawayLocationVO();
                putawayLocationVO.putawayLocation.putawayQty=0;
                putawayLocationVO.putawayLocation.putawayWeight=0;
                putawayLocationVO.putawayLocation.putawayVolume=0;
                $scope.shelvesAddModify.shelvesVo.listSavePutawayDetailVO[$scope.shelvesAddModify.selectAsnDetailIndex].listPlanLocationVO.push(putawayLocationVO);
            },
            removePutawayLocationVO:function(){ //移除一行
                $scope.shelvesAddModify.shelvesVo.listSavePutawayDetailVO[$scope.shelvesAddModify.selectAsnDetailIndex].listPlanLocationVO.splice(this.selPutawayLocationVOsIndex,1);
            },
            changeWareLocation:function(index){ //选择弹框
                var ptwDetailVO = $scope.shelvesAddModify.shelvesVo.listSavePutawayDetailVO[$scope.shelvesAddModify.selectAsnDetailIndex];
                var ptwDetail = ptwDetailVO.putawayDetail;

                angular.forEach($scope.shelvesAddModify.asnVos,function(asnVO,i){
                    if ( asnVO.asn.asnId == ptwDetail.asnId ) {
                        ptwDetail.owner = asnVO.asn.owner;
                    }
                });

                var ownerId = $scope.shelvesAddModify.shelvesVo.listSavePutawayDetailVO[$scope.shelvesAddModify.selectAsnDetailIndex].putawayDetail.owner;
                commit.commitToParent($scope,'select_wareLocation_searchModel',{status:'shelvesPlanWareLocation'+index,nullOwner:1,location:{owner:ownerId,locationType:20}});
                var on = commit.listening($scope,'shelvesPlanWareLocation'+index,function(event,data){
                    //这里可以绑定date
                    $scope.shelvesAddModify.shelvesVo.listSavePutawayDetailVO[$scope.shelvesAddModify.selectAsnDetailIndex].listPlanLocationVO[index].locationComment=data.location.locationName;
                    $scope.shelvesAddModify.shelvesVo.listSavePutawayDetailVO[$scope.shelvesAddModify.selectAsnDetailIndex].listPlanLocationVO[index].putawayLocation.locationId=data.location.locationId;
                    on();
                });
                $scope.searchPtwAction.searchModel('select_wareLocation_searchModel')
            },
            _skuComment:[],//当前不符合标注的货品集合
            checkOutSave:function(){  //验证数量
                $scope.shelvesAddModify._skuComment=[];
                var _listPutawayDetailVO=$scope.shelvesAddModify.shelvesVo.listSavePutawayDetailVO;
                var _canPase=true;
                var _canTip=false;
                angular.forEach(_listPutawayDetailVO,function(d,i){
                    var addReal={
                        putawayQty:0,
                        putawayWeight:0,
                        putawayVolume:0
                    };
                    angular.forEach(_listPutawayDetailVO[i].listPlanLocationVO,function(data){
                        addReal.putawayQty+=parseFloat(data.putawayLocation.putawayQty);
                        addReal.putawayWeight+=parseFloat(data.putawayLocation.putawayWeight);
                        addReal.putawayVolume+=parseFloat(data.putawayLocation.putawayVolume);
                    });
                    if(parseFloat(d.putawayDetail.planPutawayQty)<addReal.putawayQty){
                        _canTip=true;
                        $scope.shelvesAddModify._skuComment.push(d.skuNo);
                    }
                    if(parseFloat(d.putawayDetail.planPutawayQty)>addReal.putawayQty
                    // ||parseFloat(d.putawayDetail.planPutawayWeight)<addReal.putawayWeight
                    // ||parseFloat(d.putawayDetail.planPutawayVolume)<addReal.putawayVolume
                    ){
                        _canPase=false;
                        $scope.shelvesAddModify._skuComment.push(d.skuNo);
                    }

                });
                if(_canTip){
                    // tooltip('计划上架数量大于暂存区库存，请重新输入');
                    return false;
                }

                return _canPase;

            },
            temporarilySave:function(){  //暂存
                var _canPase=this.checkOutSave();
                if(_canPase){
                    this.temporarilySavePost();
                }else{
                    $('#addModConfirm').modal('show');
                }
            },
            temporarilySavePost:function(){
                //暂存请求
                // 组装数据
                var list = [];
                angular.forEach($scope.shelvesAddModify.shelvesVo.listSavePutawayDetailVO,function(data,i){
                    var ptwDetailVO = objectAction.newCopy($scope.shelvesAddModify.shelvesVo.listSavePutawayDetailVO[i]);
                    list.push(ptwDetailVO);

                    for ( var j = 0 ; j < $scope.shelvesAddModify.asnVos.length ; j++ ) {
                        var asnId = ptwDetailVO.putawayDetail.asnId;
                        var asnVO = $scope.shelvesAddModify.asnVos[j];
                        if ( asnId == asnVO.asn.asnId ) {
                            ptwDetailVO.putawayDetail.owner = asnVO.asn.owner;
                        }
                    }
                    for ( var k = 0 ; k < ptwDetailVO.listPlanLocationVO.length ; k++ ) {
                        var planLoc = ptwDetailVO.listPlanLocationVO[k];
                        var newPtwLoc = objectAction.newCopy(planLoc);
                        ptwDetailVO.listSavePutawayLocationVO.push(newPtwLoc);
                    }
                });
                if ( $scope.shelvesAddModify.putawayVO != null && $scope.shelvesAddModify.putawayVO.putaway.putawayId != null ) {
                    // 更新
                    var ptwVO = $scope.shelvesAddModify.putawayVO;
                    ptwVO.listSavePutawayDetailVO = list;
                    ptwVO.putaway.note = $scope.shelvesAddModify.shelvesVo.putaway.note;

                    // 组装数据
                    httpServer.postData('/ptw/update',$scope.shelvesAddModify.putawayVO).then(function(res){
                        // console.log(res);
                        if ( res != 'error' ) {
                            tooltip("更新成功");
                            $scope.shelvesAddModify.backToIndex();
                        } else {

                        }
                    });
                } else {
                    // 新增
                    $scope.shelvesAddModify.putawayVO = new PutawayVO();
                    var ptwVO = $scope.shelvesAddModify.putawayVO;
                    ptwVO.listSavePutawayDetailVO = list;
                    ptwVO.putaway.note = $scope.shelvesAddModify.shelvesVo.putaway.note;
                    httpServer.postData('/ptw/save',$scope.shelvesAddModify.putawayVO).then(function(res){
                        // console.log(res);
                        if ( res != 'error' ) {
                            tooltip("保存成功");
                            $scope.shelvesAddModify.backToIndex();
                        } else {

                        }
                    });
                }
                $('#addModConfirm').modal('hide');
            },
            saveAndEffect:function(){   // 保存生效
                var _canPase=this.checkOutSave();
                if(_canPase){
                    httpServer.postData('/ptw/complete',$scope.putawayVO);
                    $('#addModConfirm').modal('hide');
                }else{
                    $('#addModConfirm').modal('show');
                }
            },
            back:function(){
                $('#back').modal('show');
            },
            backToIndex : function () {
                $scope.searchPtwAction.showAddOrModify=false;
                $scope.searchPtwAction.showIndex=true;
            }
        };


        //作业确认

        $scope.workMakeSure={
            changeWorkerData:{},
            selectedWorker:function(){
                //commit.commitToParent方法向上级传递参数 传递 你想发回来的数据
                // 第一个参数 为当前$scope 第二个参数为你想调用的弹框 第三个参数 为你想接收的数据名称
                commit.commitToParent($scope,'select_users_searchModel','shelvesWorker');
                //选择对应的项目 与selectedWorker发回的参数一致！
                commit.listening($scope,'shelvesWorker',function(event,data){
                    //这里可以绑定date
                    $scope.putawayVO.putaway.opPerson=data.entity.userId;
                    $scope.putawayVO.opPersonComment=data.entity.userName;
                });
            },
            selectedIndex:'0',
            putawayDetailVOSelect:function(item,$index){
                this.selectedIndex=$index;
            },
            selectedRealIndex:'0',
            putawayRealDetailVOSelect:function(index){
               this.selectedRealIndex=index;
            },
            addRealPutaway:function(){
               var _putawayLocationVO=new PutawayLocationVO();
               $scope.putawayVO.listPutawayDetailVO[$scope.workMakeSure.selectedIndex].listRealLocationVO.push(_putawayLocationVO);
            },
            removeRealPutaway:function(){
                $scope.putawayVO.listPutawayDetailVO[$scope.workMakeSure.selectedIndex].listRealLocationVO.splice($scope.workMakeSure.selectedRealIndex,1);
            },
            _skuComment:[], //存放不符合数量规格的货品名称 没有用到 在463行进行记录
            makeSurePost:function(){
                $scope.workMakeSure._skuComment=[];
                var _listPutawayDetailVO=$scope.putawayVO.listPutawayDetailVO;
               // var _listRealLocationVO=$scope.putawayVO.listPutawayDetailVO[$scope.workMakeSure.selectedIndex].listRealLocationVO;
                var _canPase=true;
               angular.forEach(_listPutawayDetailVO,function(d,i){
                   var addReal={
                       putawayQty:0,
                       putawayWeight:0,
                       putawayVolume:0
                   };
                   angular.forEach(_listPutawayDetailVO[i].listRealLocationVO,function(data){
                       addReal.putawayQty+=parseFloat(data.putawayLocation.putawayQty);
                       addReal.putawayWeight+=parseFloat(data.putawayLocation.putawayWeight);
                       addReal.putawayVolume+=parseFloat(data.putawayLocation.putawayVolume);
                   });

                   if(parseFloat(d.putawayDetail.planPutawayQty)<addReal.putawayQty
                       // ||parseFloat(d.putawayDetail.planPutawayWeight)<addReal.putawayWeight
                       // ||parseFloat(d.putawayDetail.planPutawayVolume)<addReal.putawayVolume
                   ){
                       _canPase=false;
                       $scope.workMakeSure._skuComment.push(d.skuComment);
                   }
               });
               if(_canPase){
                  this.mSPost();
               }else{
                   $('#putAwayConfirm').modal('show');
               }
            },
            mSPost:function(){
                var listPtwLoc = [];
                angular.forEach($scope.putawayVO.listPutawayDetailVO , function(data,i){
                    var ptwDetailVO =  $scope.putawayVO.listPutawayDetailVO[i];
                    for ( var j = 0 ; j < ptwDetailVO.listRealLocationVO.length ; j++ ) {
                        var realLoc = ptwDetailVO.listRealLocationVO[j].putawayLocation;
                        realLoc.putawayWeight = replaceAll(realLoc.putawayWeight);
                        realLoc.putawayVolume = replaceAll(realLoc.putawayVolume);
                        listPtwLoc.push(realLoc);
                    }
                    ptwDetailVO.listPlanLocationVO = [];
                });

                angular.forEach ($scope.putawayVO.listSavePutawayLocation,function(ptwLoc,i){
                    // if ( typeof ptwLoc.putawayWeight == 'string' ) {
                    //
                    // }123
                    ptwLoc.putawayWeight = replaceAll(ptwLoc.putawayWeight);
                    ptwLoc.putawayVolume = replaceAll(ptwLoc.putawayVolume);
                }) ;


                for( var j = 0 ; j < $scope.putawayVO.listPutawayDetailVO.length ; j++ ) {
                    angular.forEach ($scope.putawayVO.listPutawayDetailVO[j].listRealLocationVO,function(ptwLoc,i){
                        // if ( typeof ptwLoc.putawayWeight == 'string' ) {
                        //
                        ptwLoc = ptwLoc.putawayLocation;
                        ptwLoc.putawayWeight = replaceAll(ptwLoc.putawayWeight,",","");
                        ptwLoc.putawayVolume = replaceAll(ptwLoc.putawayVolume,",","");
                    }) ;
                }



                $scope.putawayVO.listSavePutawayLocation = listPtwLoc;
                httpServer.postData('/ptw/complete',$scope.putawayVO).then(function(res){
                    if ( res != "error" ) {
                        tooltip("保存成功");
                        $scope.searchPtwAction.makeSureTurnPage();
                    }
                });
                $('#putAwayConfirm').modal('hide');
            },
            changeWareLocation:function(index){
               commit.commitToParent($scope,'select_wareLocation_searchModel','shelvesWareLocation'+index);
               var on = commit.listening($scope,'shelvesWareLocation'+index,function(event,data){
                    //这里可以绑定date

                    $scope.putawayVO.listPutawayDetailVO[$scope.workMakeSure.selectedIndex].listRealLocationVO[index].locationComment=data.location.locationName;
                    $scope.putawayVO.listPutawayDetailVO[$scope.workMakeSure.selectedIndex].listRealLocationVO[index].putawayLocation.locationId=data.location.locationId;
                    on();
                });
               $scope.searchPtwAction.searchModel('select_wareLocation_searchModel')
            }
        };


        function replaceAll (str,reallyDo , replaceWith  ) {

            while ( str.indexOf(reallyDo)  != -1 ) {
                str = str.replace(reallyDo , replaceWith);
            }
            return str;
        }



        //首页数据
        function PutawayVO() {
            {
                this.putaway = {
                    "createTime": null,				// 创建时间
                    "updateTime": null,				// 修改时间
                    "createPerson": null,			// 创建人
                    "updatePerson": null,			// 修改人
                    "putawayId": null,				// 上架单id
                    "putawayNo": null,				// 上架单号
                    "putawayStatus": null,		// 上架单状态
                    "orgId": null,						// 企业id
                    "parentPutawayId": null,	// 父上架单id
                    "warehouseId": null,			// 仓库id
                    "opPerson": null,					// 作业人员
                    "opTime": null,						// 作业时间
                    "docType": null,					// 单据类型
                    "planQty": null,					// 计划上架数量
                    "planWeight": null,				// 计划上架重量
                    "planVolume": null,				// 计划上架体积
                    "realQty": null,					// 实际上架数量
                    "realWeight": null,				// 实际上架重量
                    "realVolume": null,				// 实际上架体积
                    "poNo": null,							// PO单号
                    "asnNo": null,// ASN单号
                    'note': null
                };
                this.listPutawayDetailVO = [];
                this.orderQty='',
                    this.listSavePutawayDetailVO = [];					// 【保存和更新上架单业务】中的上架单明细集合
                this.mapUpdatePutawayLocation = {};				// 【更新上架单业务】中记录页面上更新过的上架单操作明细id，key和value都是id
                this.listRemovePutawayDetail = [];					// 【更新上架单业务】中记录页面上删除过的上架单明细id
                this.listRemovePutawayLocation = [];				// 【更新上架单业务】中记录页面上删除过的上架单操作明细id
                this.listPutawayId = [];										// 上架单id数组
                this.ownerComment = null;										// 货主的中文名称
                this.warehouseComment = null;								// 仓库的中文名称
                this.parentNo = null;												// 父上架单的单号
                this.parentId = null;												// 父id
                this.docTypeComment = null;									// 单据类型的中文名称
                this.putawayStatusComment = null;						// 上架单状态的中文名称
                this.opPersonComment = null;									// 作业人员的中文名称
                this.createPersonComment = null;							// 创建人的中文名称
                this.updatePersonComment = null;							// 修改人的中文名称
                this.listSavePutawayLocation = [];					// 【保存和更新上架单业务】中的上架单明细集合
                this.sumQty = null;									// 总数量
            }
        }

        function PutawayDetail() {
            this.createPerson = null;						//	创建人id
            this.updatePerson = null;						//	修改人id
            this.putawayDetailId = null;				//	上架单明细id
            this.putawayId = null;							//	上架单id
            this.skuId = null;									//	货品id
            this.orgId = null;									//	企业id
            this.warehouseId = null;						//	仓库id
            this.packId = null;									//	包装id
            this.batchNo = null;								//	批次号
            this.measureUnit = null;						//	计量单位
            this.asnId = null;									//	Asn单id
            this.asnDetailId = null;						//	Asn单明细id
            this.realPutawayQty = null;					//	实际上架数量
            this.realPutawayWeight = null;			//	实际上架重量
            this.realPutawayVolume = null;			//	实际上架体积
            this.planPutawayQty = null;					//	计划上架数量
            this.planPutawayWeight = null;			//	计划上架重量
            this.planPutawayVolume = null;			//	计划上架体积
            this.parentPutawayDetailId = null;	//	父上架明细单id
            this.owner = null;									//	货主id
            this.locationId = null;							//	库位id
        }

        function PutawayDetailVO() {
            this.putawayDetail = new PutawayDetail();		//	上架单明细
            this.listSavePutawayLocationVO = [];				//	添加的上架单操作明细
            this.listDetailId = [];											//	明细id集合
            this.asnNo = null;														// 	对应的ASN单号
            this.poNo = null;															//	对应的PO单号
            this.skuComment = null;												//	货品名称
            this.skuNo='',
                this.specComment = null;											//	规格型号中文描述
            this.packComment = null;											//	包装中文描述
            this.asnDetailQty = null;											//	ASN单明细数量
            this.asnDetailWeight = null;									//	ASN单明细重量
            this.asnDetailVolume = null;									//	ASN单明细体积
            this.specModelComment=null;//ANDY
            this.listPlanLocationVO = [];								//	上架单的计划上架操作明细
            this.listRealLocationVO = [];								//	上架单的实际上架操作明细

        }

        // 上架单操作明细
        function PutawayLocation() {
            this.createTime = null;              // 创建时间
            this.updateTime = null;              // 修改时间
            this.createPerson = null;                 // 创建人
            this.updatePerson = null;                 // 修改人
            this.putawayLocationId = null;            // 上架单操作明细id
            this.locationId = null;                   //  库位id
            this.putawayDetailId = null;              //  上架单明细id
            this.putawayQty = null;                   //  上架数量
            this.putawayWeight = null;                //  上架重量
            this.putawayVolume = null;                //  上架体积
            this.putawayType = null;                  //  上架类型
            this.packId = null;                       //  包装id
            this.measureUnit = null;                  //  计量单位
            this.warehouseId = null;                  //  仓库id
            this.orgId = null;                        //  企业id
        }

        // 上架单操作明细VO
        function PutawayLocationVO() {
            this.putawayLocation = new PutawayLocation();     //     上架单操作明细
            this.locationComment = null;                   //     库位中文名称
            this.putawayId = null;                        //     上架单id
        }


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
        }

    }])
    .name;
/**
 * Created by yangl on 2017/3/6.
 */
