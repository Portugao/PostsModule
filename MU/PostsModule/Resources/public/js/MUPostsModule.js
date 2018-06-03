'use strict';

function mUPostsCapitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.substring(1);
}

/**
 * Initialise the quick navigation form in list views.
 */
function mUPostsInitQuickNavigation() {
    var quickNavForm;
    var objectType;

    if (jQuery('.mupostsmodule-quicknav').length < 1) {
        return;
    }

    quickNavForm = jQuery('.mupostsmodule-quicknav').first();
    objectType = quickNavForm.attr('id').replace('mUPostsModule', '').replace('QuickNavForm', '');

    quickNavForm.find('select').change(function (event) {
        quickNavForm.submit();
    });

    var fieldPrefix = 'mupostsmodule_' + objectType.toLowerCase() + 'quicknav_';
    // we can hide the submit button if we have no visible quick search field
    if (jQuery('#' + fieldPrefix + 'q').length < 1 || jQuery('#' + fieldPrefix + 'q').parent().parent().hasClass('hidden')) {
        jQuery('#' + fieldPrefix + 'updateview').addClass('hidden');
    }
}

/**
 * Simulates a simple alert using bootstrap.
 */
function mUPostsSimpleAlert(anchorElement, title, content, alertId, cssClass) {
    var alertBox;

    alertBox = ' \
        <div id="' + alertId + '" class="alert alert-' + cssClass + ' fade"> \
          <button type="button" class="close" data-dismiss="alert">&times;</button> \
          <h4>' + title + '</h4> \
          <p>' + content + '</p> \
        </div>';

    // insert alert before the given anchor element
    anchorElement.before(alertBox);

    jQuery('#' + alertId).delay(200).addClass('in').fadeOut(4000, function () {
        jQuery(this).remove();
    });
}

/**
 * Initialises the mass toggle functionality for admin view pages.
 */
function mUPostsInitMassToggle() {
    if (jQuery('.muposts-mass-toggle').length > 0) {
        jQuery('.muposts-mass-toggle').unbind('click').click(function (event) {
            jQuery('.muposts-toggle-checkbox').prop('checked', jQuery(this).prop('checked'));
        });
    }
}

/**
 * Creates a dropdown menu for the item actions.
 */
function mUPostsInitItemActions(context) {
    jQuery('ul.list-inline > li > a > i.tooltips').tooltip();
}

jQuery(document).ready(function () {
    var isViewPage;
    var isDisplayPage;

    isViewPage = jQuery('.mupostsmodule-view').length > 0;
    isDisplayPage = jQuery('.mupostsmodule-display').length > 0;

    if (isViewPage) {
        mUPostsInitQuickNavigation();
        mUPostsInitMassToggle();
        mUPostsInitItemActions('view');
    } else if (isDisplayPage) {
        mUPostsInitItemActions('display');
    }
});
