'use strict';
require('./functionSelection.scss');
module.exports = angular.module('directive.functionSelection', []).directive('functionSelection',['newHttpServer',function(newHttpServer) {
    return {
        restrict: 'EA',
        scope:{
            url:'@',
            originDatas:'='
        },
        template: require('./functionSelection.html'),
        link: function(scope, elem, attr) {
            // newHttpServer(scope.url).then(function(res){
            //     scope.originDatas=res;
            // });
            scope.changeActions={
                mainsChange:function(index,item){
                    // console.log(item.selectStatus);
                    if(item.selectStatus){
                        angular.forEach(item.list,function(data,index){
                            data.selectStatus=true;
                            angular.forEach(data.list,function(data,index){
                                data.selectStatus=true;
                            })
                        });
                    }else{
                        angular.forEach(item.list,function(data,index){
                            data.selectStatus=false;
                            angular.forEach(data.list,function(data,index){
                                data.selectStatus=false;
                            })
                        });
                    }
                },
                mainChildChange:function(index,item,parentItem){
                    if(item.selectStatus){
                        angular.forEach(item.list,function(data,index){
                            data.selectStatus=true;
                        });
                        parentItem.selectStatus=true;
                    }else{
                        angular.forEach(item.list,function(data,index){
                            data.selectStatus=false;
                        });
                        var isAllNoSelected=true;  //c查找所有的子项目 如果都是false 则 他的父项目就是
                        angular.forEach(parentItem.list,function(data,index){
                            if(data.selectStatus){
                                isAllNoSelected=false;
                            }
                        });
                        if(isAllNoSelected){
                            parentItem.selectStatus=false;
                        }
                    }
                },
                ChildFunsChange:function(index,item,parentItem,paItem){
                    if(item.selectStatus){
                        parentItem.selectStatus=true;
                        paItem.selectStatus=true;
                    }else{
                        angular.forEach(item.list,function(data,index){
                            data.selectStatus=false;
                        });
                        var isAllNoSelected=true;  //c查找所有的子项目 如果都是false 则 他的父项目就是
                        angular.forEach(parentItem.list,function(data,index){
                            if(data.selectStatus){
                                isAllNoSelected=false;
                            }
                        });
                        if(isAllNoSelected){
                            parentItem.selectStatus=false;
                        }
                        var isAllNoSelectedParent=true;  //c查找所有的子项目 如果都是false 则 他的父项目就是
                        angular.forEach(paItem.list,function(data,index){
                            if(data.selectStatus){
                                isAllNoSelectedParent=false;
                            }
                        });
                        if(isAllNoSelectedParent){
                            paItem.selectStatus=false;
                        }
                    }
                }
            }
        }
    };
}]).name;
/**
 * Created by yangl on 2017/3/25.
 */
