'use strict';

require('./backToBottom.scss');
module.exports = angular.module('directive.backToBottom', []).directive('backToBottom', function() {
    return {
        restrict: 'EA',
        replace:'true',
        template:require('./backToBottom.html'),
        scope:{

        },
        link: function (scope, element, attr) {
            var e = $(element);


            $(window).scroll(function () {
                if($(document).scrollTop()>20){
                    e.addClass('current');
                }
                //滚动时触发
                var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                if(document.documentElement.scrollHeight == document.documentElement.clientHeight + scrollTop ) {
                    e.removeClass('current')
                 }
            });
            /*点击回到顶部*/
            e.click(function () {
                var dh= $(document).outerHeight(true);

                $('html,body').animate({                 //添加animate动画效果
                    scrollTop:dh
                }, 2000);
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
