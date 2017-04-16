
require('./home.scss');
$(function(){
    $('button.proofSeal_btn').tap(function(e){
        console.log( $(this).text());
        e.cancelBubble=true;
        e.stopPropagation();
    })
});