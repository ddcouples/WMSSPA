'use strict';

require('./backToTop.scss');
module.exports = angular.module('directive.backToTop', []).directive('backToTop', function() {
    return {
        restrict: 'EA',
        replace:'true',
        template:require('./backToTop.html'),
        scope:{
            source:'='
        },
        link: function (scope, element, attr) {
            var e = $(element);
            if($(document).scrollTop() == 0) {
                // e.fadeOut(200);
                e.removeClass('current')
            }

            $(window).scroll(function () {                 //滚动时触发
                if ($(document).scrollTop() > 100) {
                    //flag = true;
                    // e.fadeIn(300);
                    e.addClass('current')
                }    //获取滚动条到顶部的垂直高度,到相对顶部800px高度显示
                else {
                    //flag = false;
                    // e.fadeOut(200);
                    e.removeClass('current')
                }
            });
            /*点击回到顶部*/
            e.click(function () {
                $('html, body').animate({                 //添加animate动画效果
                    scrollTop: 0
                }, 1000);
            });
            var transitionEvent = whichTransitionEvent();
            transitionEvent && e.bind(transitionEvent, function() {
                e.removeClass('up');
                e.bind('mouseenter',function(){
                    if(/current/.test(e.attr("class"))){
                        e.addClass('up');
                    }

                });
            });

            /* From Modernizr */
            function whichTransitionEvent(){
                var t;
                var el = document.createElement('fakeelement');
                var transitions = {
                    'transition':'transitionend',
                    'OTransition':'oTransitionEnd',
                    'MozTransition':'transitionend',
                    'WebkitTransition':'webkitTransitionEnd',
                    'MsTransition':'msTransitionEnd'
                }

                for(t in transitions){
                    if( el.style[t] !== undefined ){
                        return transitions[t];
                    }
                }
            }

        }
    };
}).name;
