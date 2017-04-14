require('./loadingModalServer.css');
var model=require('./loadingModalServer.html');
$("body").append(model);
module.exports = angular.module('app.loadingModalServer', []).factory('loadingModalServer', function($http,$q) {

    return {
        show:function(){
            $("#loadingModal").modal('show');
        },
        hide:function(){
            $('#loadingModal').modal('hide');
            //$('#loadingModal').remove();
        }
    };
}).name
/**
 * Created by yangl on 2017/3/10.
 */
