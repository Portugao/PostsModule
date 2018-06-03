CKEDITOR.plugins.add('mupostsmodule', {
    requires: 'popup',
    init: function (editor) {
        editor.addCommand('insertMUPostsModule', {
            exec: function (editor) {
                MUPostsModuleFinderOpenPopup(editor, 'ckeditor');
            }
        });
        editor.ui.addButton('mupostsmodule', {
            label: 'Posts',
            command: 'insertMUPostsModule',
            icon: this.path.replace('scribite/CKEditor/mupostsmodule', 'images') + 'admin.png'
        });
    }
});
