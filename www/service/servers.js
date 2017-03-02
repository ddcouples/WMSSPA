/**
 * Created by yangl on 2017/2/22.
 */
'use strict';
module.exports = angular.module('app.httpServer', []).factory('httpServer', function($http,$q) {
    var service = {};

    //请求数据
    service.getData = function(url){
        var d = $q.defer();
        $http.get(url)//读取数据的函数。
            .success(function(response) {
                d.resolve(response);
            })
            .error(function(){
                d.reject("error");
            });
        return d.promise;
    };
    service.postData = function(url,data,config){
        var d = $q.defer();
        $http.post(url,data)//读取数据的函数。
            .then(function(response) {
                d.resolve(response);
            },function(){
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
    }
    return service;
}).factory('store', function($http,$q) {//本地存储api
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
}).factory('webroot',function () {
    return 'http://localhost:63342'
}).factory("tooltip", function () {
    /**
 * 消息提示框
 * */
    /*提示框*/
    var tooltip = function (massage) {
        var shade = "<div class='tooltip-content tooltip-cons'><div class='content'><div class='delete-content'><p style='margin:0;'> " + massage + " </p></div></div></div>";
        $("body").append(shade);
        move(0, 0, ".tooltip-content");
        setTimeout(function () {
            move(1, 1, ".tooltip-content");
        }, 3000);
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
}).name;