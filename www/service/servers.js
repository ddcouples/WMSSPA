/**
 * Created by yangl on 2017/2/22.
 */
'use strict';
module.exports = angular.module('app.httpServer', [])
    .factory('webroot',[function () {
        return 'http://127.0.0.1:8080/wms/console' //ip端口/wms/console/
    }])
    .factory('httpServer',['tooltip','$http','$q','loadingModalServer','webroot',function(tooltip,$http,$q,loadingModalServer,webroot) {
    var service = {};
    //请求数据  jis根地址
    service.getData = function(url){
        var d = $q.defer();
        loadingModalServer.show();
        $http.get(url)//读取数据的函数。
            .then(function(response) {
                setTimeout(function(){
                    loadingModalServer.hide();
                },800);
                d.resolve(response);
            },function(){
                setTimeout(function(){
                    loadingModalServer.hide();
                },800);
                d.reject("error");
            });
        return d.promise;
    };
    service.postData = function(url,data){
        var d = $q.defer();
        loadingModalServer.show();
        url=webroot+url;
        $http.post(url,data)//读取数据的函数。
            .then(function(response) {
                var data=response.data;
                if (data != "" && data != null && data.status ==1) {
                    setTimeout(function(){
                        loadingModalServer.hide();
                    },0);
                    if(data.result.list){
                        d.resolve(data.result.list);
                    }
                    if(data.result.obj){
                        d.resolve(data.result.obj);
                    }
                    d.resolve("ok");
                }else{
                    if(data.message){
                        tooltip(data.message);
                    }
                    d.resolve("ok");
                }
                setTimeout(function(){
                    loadingModalServer.hide();
                },800);
            },function(response){
                if (response.data&&response.data.message ) {
                    tooltip(response.data.message);
                } else {
                    tooltip('网络错误，请稍后再试！');
                }
                setTimeout(function(){
                    loadingModalServer.hide();
                },800);
                d.resolve("error");
            });
        return d.promise;
    };
    service.postDataCROS=function (url,data) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded,application/json;charset=UTF-8',
            },
            data: data
        }).then(function success(result) {
            //数据请求成功
            d.resolve(result);
        },function error(err) {
            //数据请求失败
            d.resolve(err);
        });
        return d.promise;
    };
    return service;
}])
    .factory('newHttpServer',['HttpMethod','httpServer','$q',function(HttpMethod,httpServer,$q) {
        var newHttpServer =function(url,data){
            var d = $q.defer();
          switch(HttpMethod){
              case 'GET':
                  httpServer.getData(url).then(function(response){
                      var data=response.data;
                      if (data != "" && data != null && data.status ==1) {
                          if (data.result.list) {
                              d.resolve(data.result.list);
                          }
                          if (data.result.obj) {
                              d.resolve(data.result.obj);
                          }
                          d.resolve("error");
                      }
                  });
                  break;
              case 'POST':
                  httpServer.postData(url,data).then(function(res){
                      d.resolve(res)
                  });
                  break;
              default :
                  alert('newHttpServer 这里出问题了')
                  break;
          }
            return d.promise;
        };
        return newHttpServer;
    }])
    .factory('store', function($http,$q) {//本地存储api
   var store=require('store');
   return {
       set:function(key,value){
           store.set(key,value)
       },
       get:function(key){
           return store.get(key);
       },
       remove:function(key){
           store.remove(key);
       },
       clearAll:function(){
           store.clearAll();
       },
       each:function(fn){
           store.each(fn);
       }
   }
}).factory("tooltip", function () {
    /**
 * 消息提示框
 * */
    /*提示框*/
    var tooltip = function (massage) {
        var shade = "<div  class='tooltip-content tooltip-cons'><div class='content'><div class='delete-content'><p style='margin:0;'> " + massage + " </p></div></div></div>";
        if($('div.tooltip-content.tooltip-cons').length>0){
           return;
        }
        $("body").append(shade);

        move(0, 0, ".tooltip-content");
        setTimeout(function () {
            move(1, 1, ".tooltip-content");
        }, 1600);
    };

    /*
     * move : 提示消息渐隐，渐现
     * 参数 ： type ， opacity ，elem
     * type : 类型，用于判断
     * opacity ： 透明度，如果elem显示 opacity　＝　0, elem隐藏 opacity = 1；
     * elem ： DOM元素
     * */
    function move(type, opacity, elem) {
        var timer = null;

        function _move() {
            if (type == 0) {
                opacity += 0.1;
                $(elem).css("opacity", opacity);
                timer = window.setTimeout(_move, 60);
                if (opacity >= 1) {
                    clearTimeout(timer);
                }
            } else {
                opacity = opacity - 0.1;
                $(elem).css("opacity", opacity);
                timer = window.setTimeout(_move, 60);
                if (opacity <= 0) {
                    $(elem).remove();
                    clearTimeout(timer);
                }
            }
        }
        _move();
    }
    return tooltip;
}).factory('queryString',function () {
    function toQueryPair(key, value) {
        if (typeof value == 'undefined'){
            return key;
        }
        return key + '=' + encodeURIComponent(value === null ? '' : String(value));
    }
    return function (obj) {
        var ret = [];
        for(var key in obj){
            key = encodeURIComponent(key);
            var values = obj[key];
            if(values && values.constructor == Array){//数组
                var queryValues = [];
                for (var i = 0, len = values.length, value; i < len; i++) {
                    value = values[i];
                    queryValues.push(toQueryPair(key, value));
                }
                ret = ret.concat(queryValues);
            }else{ //字符串
                ret.push(toQueryPair(key, values));
            }
        }
        return ret.join('&');
    }
}).factory("modifyById", ['tooltip','httpServer','$q','loadingModalServer',function (tooltip,httpServer,$q,loadingModalServer) {
    /**
     * 修改根据id 进行  返回 需要修改的数据 object
     * 如果没有传入id 弹出提示框
     * */
    /*提示框*/
    var modifyById = function (id,url,mes) {
        var d=$q.defer();
        if(id){
            loadingModalServer.show();
            var _d= httpServer.postData(url,id);
            _d.then(function(res){
                if(res=='error'){
                    setTimeout(function(){
                        loadingModalServer.hide();
                    },800);
                    tooltip('网络错误！请稍候重试！');
                    d.resolve('error');
                }else{
                    loadingModalServer.hide();
                    d.resolve(res);
                }
            })

        }else{
            tooltip(mes);
            d.resolve('errorId');
        }
        return d.promise;
    };
    return modifyById;
}]).factory("arrayAction", ['getData',function (getData) {
        /**
         *   数组的基本操作服务
         * 勾选输入框设置 添加当前选择的项数*/
        var arrayAction={};
         arrayAction.selectedById = function (item,_select,itemObj,array) {
            var _index=array.idArray.indexOf(item);
            if(_select){  //选择需要操作的id数组
                if(_index===-1){
                    array.idArray.push(item);
                    array.itemArray.push(itemObj);
                }
            }else{
                if(_index>=0){
                    array.idArray.splice(_index,1);
                    array.itemArray.splice(_index,1);
                }
            }
        };
        arrayAction.copyTo=function(source,target){
           if(!source instanceof Array){
               console.error('第一个参数不是数组')
           }
            if(!target instanceof Array){
                console.error('第二个参数不是数组')
            }
           angular.forEach(source,function(data,index){
               target.push(data);
           });
            return target;
        };
        arrayAction.copyToDouble=function(source,target,prop){
            if(!source instanceof Array){
                console.error('第一个参数不是数组');
                return;
            }
            if(!target instanceof Array){
                console.error('第二个参数不是数组');
                return;
            }
            if(!args instanceof String){
                console.error('第3个参数不是字符串');
                return;
            }
            var args=[];
            if(prop.indexOf('.')==-1){
                args.push(prop);
            }else{
                args=prop.split('.');
            }

            angular.forEach(source,function(d,i){
                var _item=getData(d,args);
                if(!_item instanceof Array){
                    console.error('第二次遍历的元素不是数组');
                    return;
                }

                angular.forEach(_item,function(data){
                    target.push(data);
                })
            });
            return target;
        };
        return arrayAction;
    }]).factory("objectAction", ['getData',function (getData) {
    /**
     *   对象的基本操作服务
     * 当前选择的项数*/
    var objectAction={};
    objectAction.newCopy = function (source) {
        var _tar={};
        angular.copy(source,_tar);
        return _tar;
    };
    objectAction.findProp=function(obj,prop){
        var args=[];
        if(prop.indexOf('.')==-1){
            args.push(prop);
        }else{
            args=prop.split('.');
        }
        var value=getData(obj,args);
        return value;
    };
    return objectAction;
}]).factory('getData',function(){
    var getData=function(obj,args){
        var _item;
        if(args.length==1){
            _item=obj[args[0]];
            return _item;
        }else{
            _item=obj[args[0]];
            args.shift();
            return getData(_item,args);
        }
    };

    return getData;
}).factory('scrollObj',function(){
    return {
        scrollTo:function(selector){
            var firstDivHeight = $(selector).outerHeight();  //这里需要自己定义需要到达的地方
            $('body, html').animate({
                "scrollTop" : firstDivHeight
            }, 500);
        }
    }
}).factory('commit',function(){
    return {
        /*
        * 像上传输数据*/

        listening:function(scope,lis,func){
            var _on= scope.$on(lis,func);
            return _on;
        },
        commitToParent:function(scope,modelName,value){
            scope.$emit(modelName,value);
            $('#'+modelName).modal('show');
        },
        /*
         * 像下传输数据*/
        commitToSon:function(scope,modelName,value){
            scope.$broadcast(modelName,value);
        }
    }
}).name;