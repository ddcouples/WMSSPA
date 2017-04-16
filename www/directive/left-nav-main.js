'use strict';

module.exports = angular.module('directive.leftNavMain', []).directive('leftNavMain', ['$location',function($location) {
    return {
        restrict: 'A',
        link: function(scope, elem, attr) {
            var $ele=$(elem);
            var $uls=$ele.find('li>ul.nav_subs');
            $uls.each(function(index,ele){
               if(index!=0){
                  $(ele).parent().hide();
              }
           });
            $ele.find('li.nav_main').click(function(){
               var height= $(this).offset().top;
                $ele.find('.nav-li-move-bg').css('top',height);
               $(this).next().slideToggle();
           });
            var transitionEvent = whichTransitionEvent();
            var $bg=$ele.find('.nav-a-move-bg');
            $ele.find('li>ul.nav_subs>li').click(function(){
                var $that=$(this);
                $ele.find('li>ul.nav_subs>li').removeClass('active');
                var height= $(this).offset().top;
                $bg.css('opacity',1);
                $bg.css('top',height).off()
                    .on(transitionEvent,function(){
                        $bg.css('opacity',0);
                        $that.addClass('active');
                })
            });

            var url=$location.url().slice(6).trim();
            angular.element('document').ready(function(){
                switch (url){
                    case 'loginLog':
                    case 'keyOperationLog':
                    case 'systemSetting':
                        $('#sysMgmt').trigger('click');
                        break;
                    case'usersMgmt':
                    case'rolesMgmt':
                        $('#authorityMgmt').trigger('click');
                        break;

                }
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
}]).name;