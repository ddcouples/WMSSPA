'use strict';
module.exports = angular.module('app.directives', [
    require('../directive/directives.js'),
    require('../directive/historyMessage/historyMessage.js'),
    require('../directive/page/page.js'),
    require('../directive/searchModal/searchModal.js'),
    require('../directive/footer/footer.js'),
    require('../directive/panel/panel.js'),
    require('../directive/asnDetail/asnDetail.js'),
    require('../directive/putawayListDetail/putawayListDetail.js'),
    require('../directive/deliveryDetail/deliveryDetail.js'),
    require('../directive/pickingDetail/pickingDetail.js'),
    require('../directive/waveCountDetail/waveCountDetail.js')
]).name;
