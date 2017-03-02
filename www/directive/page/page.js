/**
 * 项目分页-公用
 * @param
 * @param
 * @return
 * @since 1.0.0
 * 2016年8月17日-下午13:39:30
 */
require('./page.css');
module.exports = angular.module('directive.page', []).directive('page', ['$http','webroot','queryString','tooltip',function ($http, webroot, queryString, tooltip) {
    return {
        template: '<div class="page-main" ng-show="pageData.length >= 0">' +
                      '<ul class="page-num">' +
                        ' <li ng-class="{disabled: pageConfig.currentPage == 0}" ng-click="getPage(0);">首页</li>' +
                         '<li ng-click="getPagePrev();" ng-class="{disabled: pageConfig.currentPage == 0}">‹</li>' +
                         '<li ng-class="{active: item == (pageConfig.currentPage + 1)}" ng-click="getPage(item - 1)" ng-repeat="item in pageList track by $index">{{item}}</li>' +
                         '<li ng-class="{disabled: pageConfig.currentPage == pageConfig.totalPage - 1}" ng-click="nextPagePrev();">›</li>' +
                         '<li ng-click="getPage(pageConfig.totalPage - 1);" ng-class="{disabled: pageConfig.currentPage == pageConfig.totalPage - 1}">尾页</li>' +
                      '</ul>' +
                      '<div class="input-group">' +
                          '<input class="form-control" ng-blur="setPageSize($event,2)" ng-keyup="setPageSize($event,1)" ng-model="pageConfig.pageSize" type="text">' +
                          '<div class="input-group-btn open">' +
                               '<button ng-click="vm.visible = !vm.visible" class="btn btn-info dropdown-toggle">' +
                               '<span class="caret"></span></button>' + '<ul ng-show="vm.visible" class="dropdown-menu dropdown-menu-left">' +
        '<li ng-click="selectPageSize(item);" ng-repeat="item in pageConfig.pageSizeData"><a>{{item}} 条/页</a></li>' +
        '</ul>' +
        '</div>' +
                       '</div>' +
                       '<div class="page-last">' +
                            '到 <input ng-blur="getPage(currentPage - 1);" ng-model="currentPage" type="text"> 页' +
                             ' <button ng-click="getPage(currentPage - 1);" type="button" class="btn btn-info">确定</button> &nbsp;&nbsp;' +
                            '共{{pageConfig.currentPage + 1}}/{{pageConfig.totalPage}}页' +
                        '</div>{{vm.selectPageSize}}' +
                      '</div>'
        ,
        replace: false,
        restrict: "AE",
        link: function (scope, element, attrs) {
            scope.vm = {
                'visible':false
            };
            scope.logic={};
            scope.pageConfig = {
                total: "", //总记录数
                pageSize: 8,//每页显示条数
                currentPage: 0, //当前页码
                totalPage: "", //页数
                pageCount: "",//总页数
                pageLength: 10, //分页显示的长度
                pageSizeData:[10,20,40,60,80,100], //选择每页显示条数数据
                url:'',
                headerType:'application/json'
            };
            if (scope.pageConfig.pageLength) {
                scope.pageConfig.pageLength = scope.pageConfig.pageLength;
            } else {
                scope.pageConfig.pageLength = 16;
            }

            scope.pageModel = { //分页查询model
                currentPage:scope.pageConfig.currentPage,
                pageSize:scope.pageConfig.pageSize
            };

            //计算分页数
            function totalPage() {
                scope.pageList = [];
                scope.pageConfig.totalPage = Math.ceil(scope.pageConfig.total / scope.pageConfig.pageSize); //计算总页数
                if (scope.pageConfig.totalPage <= scope.pageConfig.pageLength) { // 判断总页数如果小于等于分页的长度，若小于则直接显示
                    for (var i = 1; i <= scope.pageConfig.totalPage; i++) {
                        scope.pageList.push(i);
                    }
                } else {
                    // 计算中心偏移量
                    var offset = (scope.pageConfig.pageLength) / 2;
                    if (scope.pageConfig.currentPage <= offset) { //如果当前页数小于等于偏移量
                        for (var i = 1; i <= scope.pageConfig.pageLength; i++) {
                            scope.pageList.push(i);
                        }
                    } else if (scope.pageConfig.currentPage > scope.pageConfig.totalPage - offset) { //如果当前页数大于总页数减去偏移量
                        for (var i = scope.pageConfig.pageLength; i >= 1; i--) {
                            scope.pageList.push((scope.pageConfig.totalPage + 1) - i);
                        }
                    } else { //否则
                        for (var i = offset; i >= 2; i--) {
                            scope.pageList.push((scope.pageConfig.currentPage + 1) - i);
                        }
                        scope.pageList.push(scope.pageConfig.currentPage);
                        for (var i = 1; i <= offset; i++) {
                            scope.pageList.push(scope.pageConfig.currentPage + i);
                        }
                    }
                }
            }

            //设置每页显示条数
            scope.setPageSize = function (e,type) {
                e = e || event;
                if(e.keyCode == 13 || type == 2){
                    scope.pageConfig.currentPage = 0;
                    scope.pageModel.currentPage = 0;
                    scope.currentPage = 1;
                    var res = /^[0-9]+[0-9]*]*$/;
                    if(!res.test(scope.pageConfig.pageSize)){ //不是数字
                        tooltip('每页显示条数必须是数字！');
                        return false;
                    }else if(scope.pageConfig.pageSize == '' || scope.pageConfig.pageSize == null){
                        tooltip('每页显示条数不能为空！');
                        return false;
                    }else if(scope.pageConfig.pageSize > 200){
                        tooltip('每页最多显示200条！');
                        return false;
                    }
                    scope.pageModel.pageSize = scope.pageConfig.pageSize;
                    scope.getPageByJson();
                }

            };

            //选择每页显示多少条数据
            scope.selectPageSize = function (count) {
                scope.pageConfig.currentPage = 0;
                scope.pageModel.currentPage = 0;
                scope.currentPage = 1;
                scope.pageConfig.pageSize = count;
                scope.pageModel.pageSize = count;
                scope.vm.visible = false;
                scope.getPageByJson();
            };

            //获取分页数据
            // scope.pageData = [];
            scope.getPageByJson = function (url) {
                if(url != '' && url != null){
                    scope.pageConfig.url = url;
                    scope.pageConfig.currentPage = 0;
                    scope.pageModel.currentPage = 0;
                }

                $http({
                    method: 'POST',
                    // url: webroot + scope.pageConfig.url,
                    url:  scope.pageConfig.url,
                    data: scope.pageConfig.headerType == 'application/x-www-form-urlencoded' ? queryString(scope.pageModel) : scope.pageModel,
                    headers: {
                        'Content-Type': scope.pageConfig.headerType
                    }
                }).then(function (res) {
                    if (data != "" && data != null && data.status == 0) {
                        if((data.result.list != [] && data.result.list != null) && data.result.list.length <= 0 && scope.pageModel.currentPage > 0){
                            scope.pageConfig.currentPage--;
                            scope.pageModel.currentPage--;
                            scope.getPageByJson();
                            return;
                        }
                        scope.pageData = res.data.result.list;
                        scope.pageConfig.total = res.data.result.totalCount; //获取总记录数
                        totalPage(); //计算分页数
                    } else {
                        scope.pageData = [];
                        scope.pageConfig.totalPage = 0;
                        tooltip(data.message);
                    }
                });
                scope.logic.checked = false;
            };
            //url：非空表示新的查询，页码定位到第0页，
            //url：空值表示保持现有条件查询，页码保持现状不清0
            scope.getPageByString = function (url) {
                scope.pageConfig.headerType = 'application/x-www-form-urlencoded';
                scope.getPageByJson(url);
            };

            //点击分页加载数据
            scope.getPage = function (currentPage) {
                if (currentPage == scope.pageConfig.currentPage) { //如果index等于当前页，不执行任何操作
                    return false;
                }

                if (currentPage < 0) {
                    tooltip("页码不合法，请输入正确的页码！");
                    return false;
                } else {
                    var res = /^[0-9]+[0-9]*]*$/;
                    if (!res.test(currentPage)) {
                        tooltip("页码不合法，请输入正确的页码！");
                        return false;
                    }
                }

                if (currentPage > scope.pageConfig.totalPage - 1) {
                    currentPage = scope.pageConfig.totalPage - 1;
                    scope.currentPage = scope.pageConfig.totalPage;
                }
                scope.pageConfig.currentPage = currentPage;
                scope.pageModel.currentPage = currentPage;
                scope.getPageByJson();//获取分页数据
            };

            //上一页
            scope.getPagePrev = function () {
                scope.pageConfig.currentPage = scope.pageConfig.currentPage - 1; //当前页数减一
                if (scope.pageConfig.currentPage < 0) { //如果当前页数小于0
                    scope.pageConfig.currentPage = 0; //当前页数等于0
                    return false;
                }
                scope.pageModel.currentPage = scope.pageConfig.currentPage;
                scope.getPageByJson();//获取分页数据
            };

            //下一页
            scope.nextPagePrev = function () {
                scope.pageConfig.currentPage = scope.pageConfig.currentPage + 1; //当前页数加一
                if (scope.pageConfig.currentPage > scope.pageConfig.totalPage - 1) { //如果当前页数大于等于总页数
                    scope.pageConfig.currentPage = scope.pageConfig.totalPage - 1; //当前页数等于总页数
                    return false;
                }
                scope.pageModel.currentPage = scope.pageConfig.currentPage;
                scope.getPageByJson();//获取分页数据
            }

            angular.element(document).click(function(e){
                if(e.target.className != 'btn btn-info dropdown-toggle'){
                    setTimeout(function(){
                        scope.vm.visible = false;
                        scope.$digest();
                    }, 30);
                }
            })
        }
    }
}]).name;


