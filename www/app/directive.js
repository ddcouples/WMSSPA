'use strict';
module.exports = angular.module('app.directives', [
    require('../directive/directives.js'),
    require('../directive/historyMessage/historyMessage.js'),
    require('../directive/page/page.js'),
    require('../directive/functionSelection/functionSelection.js'),
    require('../directive/backToTop/backToTop.js'), //返回顶部指令
    require('../directive/backToBottom/backToBottom.js'), //返回底部指令
    require('../directive/searchModal/searchModal.js'),
    require('../directive/footer/footer.js'),
    require('../directive/panel/panel.js'),
    require('../directive/asnDetail/asnDetail.js'),
    require('../directive/deliveryDetail/deliveryDetail.js'),
    require('../directive/confirmModel/confirmModel.js') //加载确定指令
]).name;
