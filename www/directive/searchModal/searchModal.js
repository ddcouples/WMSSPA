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
                $(ele).find('.modal-dialog').addClass('modal-lg');
           }else if(attr.sm&&attr.sm==='true'){
               $(ele).find('.modal-dialog').addClass('modal-sm');
           }
        }
    };
}).name;
/**
 * Created by yangl on 2017/3/3.
 */
