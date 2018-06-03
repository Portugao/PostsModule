'use strict';

var currentMUPostsModuleEditor = null;
var currentMUPostsModuleInput = null;

/**
 * Returns the attributes used for the popup window. 
 * @return {String}
 */
function getMUPostsModulePopupAttributes() {
    var pWidth, pHeight;

    pWidth = screen.width * 0.75;
    pHeight = screen.height * 0.66;

    return 'width=' + pWidth + ',height=' + pHeight + ',location=no,menubar=no,toolbar=no,dependent=yes,minimizable=no,modal=yes,alwaysRaised=yes,resizable=yes,scrollbars=yes';
}

/**
 * Open a popup window with the finder triggered by an editor button.
 */
function MUPostsModuleFinderOpenPopup(editor, editorName) {
    var popupUrl;

    // Save editor for access in selector window
    currentMUPostsModuleEditor = editor;

    popupUrl = Routing.generate('mupostsmodule_external_finder', { objectType: 'content', editor: editorName });

    if (editorName == 'ckeditor') {
        editor.popup(popupUrl, /*width*/ '80%', /*height*/ '70%', getMUPostsModulePopupAttributes());
    } else {
        window.open(popupUrl, '_blank', getMUPostsModulePopupAttributes());
    }
}


var mUPostsModule = {};

mUPostsModule.finder = {};

mUPostsModule.finder.onLoad = function (baseId, selectedId) {
    if (jQuery('#mUPostsModuleSelectorForm').length < 1) {
        return;
    }
    jQuery('select').not("[id$='pasteAs']").change(mUPostsModule.finder.onParamChanged);
    
    jQuery('.btn-default').click(mUPostsModule.finder.handleCancel);

    var selectedItems = jQuery('#mupostsmoduleItemContainer a');
    selectedItems.bind('click keypress', function (event) {
        event.preventDefault();
        mUPostsModule.finder.selectItem(jQuery(this).data('itemid'));
    });
};

mUPostsModule.finder.onParamChanged = function () {
    jQuery('#mUPostsModuleSelectorForm').submit();
};

mUPostsModule.finder.handleCancel = function (event) {
    var editor;

    event.preventDefault();
    editor = jQuery("[id$='editor']").first().val();
    if ('ckeditor' === editor) {
        mUPostsClosePopup();
    } else if ('quill' === editor) {
        mUPostsClosePopup();
    } else if ('summernote' === editor) {
        mUPostsClosePopup();
    } else if ('tinymce' === editor) {
        mUPostsClosePopup();
    } else {
        alert('Close Editor: ' + editor);
    }
};


function mUPostsGetPasteSnippet(mode, itemId) {
    var quoteFinder;
    var itemPath;
    var itemUrl;
    var itemTitle;
    var itemDescription;
    var pasteMode;

    quoteFinder = new RegExp('"', 'g');
    itemPath = jQuery('#path' + itemId).val().replace(quoteFinder, '');
    itemUrl = jQuery('#url' + itemId).val().replace(quoteFinder, '');
    itemTitle = jQuery('#title' + itemId).val().replace(quoteFinder, '').trim();
    itemDescription = jQuery('#desc' + itemId).val().replace(quoteFinder, '').trim();
    pasteMode = jQuery("[id$='pasteAs']").first().val();

    // item ID
    if (pasteMode === '3') {
        return '' + itemId;
    }

    // relative link to detail page
    if (pasteMode === '1') {
        return mode === 'url' ? itemPath : '<a href="' + itemPath + '" title="' + itemDescription + '">' + itemTitle + '</a>';
    }
    // absolute url to detail page
    if (pasteMode === '2') {
        return mode === 'url' ? itemUrl : '<a href="' + itemUrl + '" title="' + itemDescription + '">' + itemTitle + '</a>';
    }

    return '';
}


// User clicks on "select item" button
mUPostsModule.finder.selectItem = function (itemId) {
    var editor, html;

    html = mUPostsGetPasteSnippet('html', itemId);
    editor = jQuery("[id$='editor']").first().val();
    if ('ckeditor' === editor) {
        if (null !== window.opener.currentMUPostsModuleEditor) {
            window.opener.currentMUPostsModuleEditor.insertHtml(html);
        }
    } else if ('quill' === editor) {
        if (null !== window.opener.currentMUPostsModuleEditor) {
            window.opener.currentMUPostsModuleEditor.clipboard.dangerouslyPasteHTML(window.opener.currentMUPostsModuleEditor.getLength(), html);
        }
    } else if ('summernote' === editor) {
        if (null !== window.opener.currentMUPostsModuleEditor) {
            html = jQuery(html).get(0);
            window.opener.currentMUPostsModuleEditor.invoke('insertNode', html);
        }
    } else if ('tinymce' === editor) {
        window.opener.currentMUPostsModuleEditor.insertContent(html);
    } else {
        alert('Insert into Editor: ' + editor);
    }
    mUPostsClosePopup();
};

function mUPostsClosePopup() {
    window.opener.focus();
    window.close();
}

jQuery(document).ready(function () {
    mUPostsModule.finder.onLoad();
});
