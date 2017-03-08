'use strict';
/* html内容
 *
 * */

module.exports = angular.module('directive.panel', []).directive('panel', function() {
    return {
        restrict: 'EA',
        replace:true,
        transclude:true,
        template: require('./panel.html'),
        link: function(scope, ele, attr) {
            var $title=$(ele).find('.panel-title');
            if(attr.title){
                $title.find('span').text(attr.title)
            }
            var $i=$title.find('i.fa');
            $(ele).find('.panel-title').click(function(){
                $(ele).find('.collapse').collapse('toggle');

                if($i.hasClass('fa-hand-paper-o')){
                    $i.removeClass('fa-hand-paper-o').addClass('fa-hand-rock-o');
                }else{
                    $i.removeClass('fa-hand-rock-o').addClass('fa-hand-paper-o');
                }
            })

            if(attr.className){
                $(ele).find('.panel.panel-default').removeClass('panel-default').addClass(attr.className);
            }

        }
    };
}).name;
/**
 * Created by yangl on 2017/3/3.
 */
/**
 * Created by yangl on 2017/3/8.
 */
