(function($){

    function initialize_field( $el ) {

        //$el.doStuff();
        var editorId = $el.find('[data-acf-markdown-editor]').attr('id');
        var options = window[editorId];
        options.clientSideStorage = false;
        var editor = new EpicEditor(options).load();
        var add_media_button = $el.find('.wp-media-buttons');

        if( options['syntaxHighlight'] ) {
            var previewer = editor.getElement('previewer');
            $(previewer.body).append('<link rel="stylesheet" type="text/css" href="' + options.syntaxTheme + '">');

            editor.on('preview', function(){
                $(previewer.body).find('pre code').each(function(i, block) {
                    hljs.highlightBlock(block, false);
                });
            });
        }

        if( add_media_button ) {
            handle_media_button(add_media_button, $el.find('.wp-media-input'), function(props, attachment){
                var container, txtToAdd;
                container = $el.find("[data-acf-markdown-editor] iframe").contents().find("iframe#epiceditor-editor-frame").contents().find("body").get(0);
                txtToAdd = "![" + attachment.alt + "](" + attachment.sizes[props.size].url + ")";
                return insertAtCaret(container, txtToAdd);
            });
        }

        /*if( parseInt(options.tabFunction) ) {
            var spaces = parseInt(options.tabFunction);

            $(editor.getElement('editor').body).on('keydown', function(e) {
                // check if this is the tab-key
                if( e.keyCode == 9 ) {
                    e.preventDefault();
                    //new Array(spaces+1).join(' ');
                }
            });
        }*/

    }

    function handle_media_button( $el, $inputEl, cb ) {
        if ( typeof wp !== 'undefined' && wp.media && wp.media.editor) {
            $el.on('click', function(e) {
                e.preventDefault();
                var button = $(this);
                wp.media.editor.send.attachment = cb;
                wp.media.editor.open(button);
                return false;
            });
        }
    }

    function insertAtCaret(element, text) {
        var frag, node, nodeToInsert, range, selection, _window;
        _window = element.ownerDocument.defaultView;
        selection = _window.getSelection();

        if (selection.rangeCount) {
            range = selection.getRangeAt();
            range.deleteContents();
            node = document.createTextNode(text);
            frag = document.createDocumentFragment();
            nodeToInsert = frag.appendChild(node);
            return range.insertNode(frag);
        }
        else {
            return $(element).append(text);
        }
    }


    if( typeof acf.add_action !== 'undefined' ) {

        /*
        *  ready append (ACF5)
        *
        *  These are 2 events which are fired during the page load
        *  ready = on page load similar to $(document).ready()
        *  append = on new DOM elements appended via repeater field
        *
        *  @type    event
        *  @date    20/07/13
        *
        *  @param   $el (jQuery selection) the jQuery element which contains the ACF fields
        *  @return  n/a
        */

        acf.add_action('ready append', function( $el ){

            // search $el for fields of type 'markdown'
            acf.get_fields({ type : 'markdown'}, $el).each(function(){

                initialize_field( $(this) );

            });

        });


    } else {


        /*
        *  acf/setup_fields (ACF4)
        *
        *  This event is triggered when ACF adds any new elements to the DOM.
        *
        *  @type    function
        *  @since   1.0.0
        *  @date    01/01/12
        *
        *  @param   event       e: an event object. This can be ignored
        *  @param   Element     postbox: An element which contains the new HTML
        *
        *  @return  n/a
        */

        $(document).live('acf/setup_fields', function(e, postbox){

            $(postbox).find('.field[data-field_type="markdown"]').each(function(){

                initialize_field( $(this) );

            });

        });


    }


})(jQuery);
