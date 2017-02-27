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
}).factory('Server', function($http,$q) {
   return 'ddd'
}).name;