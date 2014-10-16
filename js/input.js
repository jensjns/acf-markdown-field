(function($){

    function initialize_field( $el ) {

        //$el.doStuff();
        var editorId = $el.find('[data-acf-markdown-editor]').attr('id');
        var options = window[editorId];
        options.clientSideStorage = false;
        var editor = new EpicEditor(options).load();

        if( options['syntaxHighlight'] ) {
            var previewer = editor.getElement('previewer');
            $(previewer.body).append('<link rel="stylesheet" type="text/css" href="' + options.syntaxTheme + '">');

            editor.on('preview', function(){
                $(previewer.body).find('pre code').each(function(i, block) {
                    hljs.highlightBlock(block, false);
                });
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
