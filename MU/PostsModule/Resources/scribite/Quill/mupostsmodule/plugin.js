var mupostsmodule = function(quill, options) {
    setTimeout(function() {
        var button;

        button = jQuery('button[value=mupostsmodule]');

        button
            .css('background', 'url(' + Zikula.Config.baseURL + Zikula.Config.baseURI + '/web/modules/muposts/images/admin.png) no-repeat center center transparent')
            .css('background-size', '16px 16px')
            .attr('title', 'Posts')
        ;

        button.click(function() {
            MUPostsModuleFinderOpenPopup(quill, 'quill');
        });
    }, 1000);
};
