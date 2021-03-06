'use strict';
 require('../../node_modules/font-awesome/css/font-awesome.min.css');
require('../../node_modules/bootstrap/dist/css/bootstrap.css');
//  require('bootstrap');
require('bootstrap-loader');
 // var $=require('jquery');
 // window.jQuery=$;
 // var jQuery=$;
// require('../../node_modules/bootstrap/dist/js/bootstrap.js');
require('../css/style.css');
require('../css/bootstrap-datetimepicker.css');
require('../lib/bootstrap-datetimepicker.js');
require('../lib/bootstrap-datetimepicker.zh-CN.js');
var tabs=require('angular-ui-bootstrap/src/tabs');

angular.module('app', [
        require('angular-ui-router'),
        require('angular-animate'),
        // require('angular-ui-bootstrap'),
        tabs,
        require('angular-ui-bootstrap/src/tooltip'),
        require('oclazyload'),
        require('./routing.js'),
        require('./directive.js'),
        require('./service.js')
    ])
    .config(['$urlRouterProvider','$locationProvider',function($urlRouterProvider, $locationProvider) {
         $urlRouterProvider.otherwise("/login");
         // $locationProvider.html5Mode(true);
    }]).value('HttpMethod','POST');