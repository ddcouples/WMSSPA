

module.exports = angular.module('app.confirmModel', [])
    .directive('confirmModel', function() {
        return {
            restrict: 'EA',
            scope:{
                title:'@',
                content:'@',
                ok:'&',
                okText:'@',
                cancelText:'@',
                no:'&',
                noText:'@'
            },
            replace:true,
            transclude:true,
            template:require('./confirmModel.html'),
            link: function(scope, ele, attr) {
               // $(ele).find('.modal-body').append($(scope.content));

            }
        };
    })
    .name;
/**
 * Created by yangl on 2017/3/10.
 */
/**
 * Created by yangl on 2017/3/27.
 */
