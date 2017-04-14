'use strict';

require('./historyMessage.scss');
//sources 用于绑定数据  selectList用于查询select下拉框的内容 把value的志变成 select的value
module.exports = angular.module('directive.historyMessage', [])
    .directive('historyMessage', function() {
    return {
        restrict: 'EA',
        template: require('./historyMessage.html'),
        scope:{
            sources:'=',
            selectHistory:'='
        },
        link: function(scope, elem, attr) {
            var $ele=$(elem);


            scope.$watchCollection('sources',function(value){
                if(scope.sources instanceof Array && scope.sources.length<=0) return;

               angular.forEach(scope.sources,function(data,index){
                  scope.sources[index].showAllText=true;
               })
                $ele.ready(function(){
                    $ele.find('.history-message-items').each(function(index,value){
                        if($(value).find('span').width()>$(value).width()*.8){
                            scope.sources[index].showAllText=false;
                        }
                    })
                })

            });
            scope.showList=false;
            $ele.find('.receive-form-input').click(function(){
                if(scope.sources instanceof Array && scope.sources.length>0) {
                    scope.showList = !scope.showList;
                    scope.$apply();
                }
                $ele.find('.history-message-items').each(function(index,value){
                    if($(value).find('span').width()>$(value).width()*.8){
                      scope.sources[index].showAllText=false;
                      scope.$apply();
                    }
                })

            });
            function addText(_t){
                if(_t.length>6) {
                    return (_t.slice(0, 6) + '...');
                }else{
                    return _t;
                }
            }

            scope.showListText=function(obj){
                var _text='';
                readObj(obj);
                return _text.slice(1);
                function readObj(obj){
                    for(var i in obj){
                        if(typeof obj[i]=="object"){
                            readObj(obj[i]);
                        }else{
                            if(obj[i]!=''&&obj[i]!='0'&&obj[i]!='请选择'&&i!='key'&&i!='showAllText'){
                                _text= _text+"+"+addText(obj[i]);

                            }
                        }
                    }
                }
            }
            scope.showListTitle=function(obj){
                var _text='';
                readObj(obj,"ori");

                return _text.slice(1);
                function readObj(obj){
                    for(var i in obj){
                        if(typeof obj[i]=="object"){
                            readObj(obj[i]);
                        }else{
                            if(obj[i]!=''&&obj[i]!='0'&&obj[i]!='请选择'&&i!='key'&&i!='showAllText'){
                                    _text= _text+"+"+(obj[i])
                            }
                        }
                    }
                }
            }

            scope.selectHistoryClick=function(s){

                angular.copy(s,scope.selectHistory);
            }


        }
    };
}).name;
