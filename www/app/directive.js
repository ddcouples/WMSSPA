'use strict';
module.exports = angular.module('app.directives', [
    require('../directive/directives.js'),
    require('../directive/historyMessage/historyMessage.js'),
    require('../directive/page/page.js')
]).name;
