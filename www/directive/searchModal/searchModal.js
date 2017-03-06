'use strict';
/* html内容
* <search-modal title="测试model" sm="true" id="myModal">


 </search-modal>
*
* js调用 $("#myModal").modal('show');
* */

module.exports = angular.module('directive.searchModal', []).directive('searchModal', function() {
    return {
        restrict: 'EA',
        // scope:{
        //
        // },
        replace:true,
        transclude:true,
        template: require('./searchModal.html'),
        link: function(scope, ele, attr) {
            if(attr.title){
                $(ele).find('#diyModalLabel').text(attr.title);
            }else {
                $(ele).find('.modal-header').remove();
            }
           if(attr.lg&&attr.lg==='true'){
               scope.lg=true;
               scope.sm=false
           }else if(attr.sm&&attr.sm==='true'){
                scope.lg=false;
                scope.sm=true
           }else{
               scope.lg=false;
               scope.sm=false
           }
        }
    };
}).name;
/**
 * Created by yangl on 2017/3/3.
 */
