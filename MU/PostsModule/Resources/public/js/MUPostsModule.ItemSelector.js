'use strict';

var mUPostsModule = {};

mUPostsModule.itemSelector = {};
mUPostsModule.itemSelector.items = {};
mUPostsModule.itemSelector.baseId = 0;
mUPostsModule.itemSelector.selectedId = 0;

mUPostsModule.itemSelector.onLoad = function (baseId, selectedId) {
    mUPostsModule.itemSelector.baseId = baseId;
    mUPostsModule.itemSelector.selectedId = selectedId;

    // required as a changed object type requires a new instance of the item selector plugin
    jQuery('#mUPostsModuleObjectType').change(mUPostsModule.itemSelector.onParamChanged);

    jQuery('#' + baseId + '_catidMain').change(mUPostsModule.itemSelector.onParamChanged);
    jQuery('#' + baseId + '_catidsMain').change(mUPostsModule.itemSelector.onParamChanged);
    jQuery('#' + baseId + 'Id').change(mUPostsModule.itemSelector.onItemChanged);
    jQuery('#' + baseId + 'Sort').change(mUPostsModule.itemSelector.onParamChanged);
    jQuery('#' + baseId + 'SortDir').change(mUPostsModule.itemSelector.onParamChanged);
    jQuery('#mUPostsModuleSearchGo').click(mUPostsModule.itemSelector.onParamChanged);
    jQuery('#mUPostsModuleSearchGo').keypress(mUPostsModule.itemSelector.onParamChanged);

    mUPostsModule.itemSelector.getItemList();
};

mUPostsModule.itemSelector.onParamChanged = function () {
    jQuery('#ajaxIndicator').removeClass('hidden');

    mUPostsModule.itemSelector.getItemList();
};

mUPostsModule.itemSelector.getItemList = function () {
    var baseId;
    var params;

    baseId = mUPostsModule.itemSelector.baseId;
    params = {
        ot: baseId,
        sort: jQuery('#' + baseId + 'Sort').val(),
        sortdir: jQuery('#' + baseId + 'SortDir').val(),
        q: jQuery('#' + baseId + 'SearchTerm').val()
    }
    if (jQuery('#' + baseId + '_catidMain').length > 0) {
        params[catidMain] = jQuery('#' + baseId + '_catidMain').val();
    } else if (jQuery('#' + baseId + '_catidsMain').length > 0) {
        params[catidsMain] = jQuery('#' + baseId + '_catidsMain').val();
    }

    jQuery.getJSON(Routing.generate('mupostsmodule_ajax_getitemlistfinder'), params, function (data) {
        var baseId;

        baseId = mUPostsModule.itemSelector.baseId;
        mUPostsModule.itemSelector.items[baseId] = data;
        jQuery('#ajaxIndicator').addClass('hidden');
        mUPostsModule.itemSelector.updateItemDropdownEntries();
        mUPostsModule.itemSelector.updatePreview();
    });
};

mUPostsModule.itemSelector.updateItemDropdownEntries = function () {
    var baseId, itemSelector, items, i, item;

    baseId = mUPostsModule.itemSelector.baseId;
    itemSelector = jQuery('#' + baseId + 'Id');
    itemSelector.length = 0;

    items = mUPostsModule.itemSelector.items[baseId];
    for (i = 0; i < items.length; ++i) {
        item = items[i];
        itemSelector.get(0).options[i] = new Option(item.title, item.id, false);
    }

    if (mUPostsModule.itemSelector.selectedId > 0) {
        jQuery('#' + baseId + 'Id').val(mUPostsModule.itemSelector.selectedId);
    }
};

mUPostsModule.itemSelector.updatePreview = function () {
    var baseId, items, selectedElement, i;

    baseId = mUPostsModule.itemSelector.baseId;
    items = mUPostsModule.itemSelector.items[baseId];

    jQuery('#' + baseId + 'PreviewContainer').addClass('hidden');

    if (items.length === 0) {
        return;
    }

    selectedElement = items[0];
    if (mUPostsModule.itemSelector.selectedId > 0) {
        for (var i = 0; i < items.length; ++i) {
            if (items[i].id == mUPostsModule.itemSelector.selectedId) {
                selectedElement = items[i];
                break;
            }
        }
    }

    if (null !== selectedElement) {
        jQuery('#' + baseId + 'PreviewContainer')
            .html(window.atob(selectedElement.previewInfo))
            .removeClass('hidden');
    }
};

mUPostsModule.itemSelector.onItemChanged = function () {
    var baseId, itemSelector, preview;

    baseId = mUPostsModule.itemSelector.baseId;
    itemSelector = jQuery('#' + baseId + 'Id').get(0);
    preview = window.atob(mUPostsModule.itemSelector.items[baseId][itemSelector.selectedIndex].previewInfo);

    jQuery('#' + baseId + 'PreviewContainer').html(preview);
    mUPostsModule.itemSelector.selectedId = jQuery('#' + baseId + 'Id').val();
};

jQuery(document).ready(function () {
    var infoElem;

    infoElem = jQuery('#itemSelectorInfo');
    if (infoElem.length == 0) {
        return;
    }

    mUPostsModule.itemSelector.onLoad(infoElem.data('base-id'), infoElem.data('selected-id'));
});
