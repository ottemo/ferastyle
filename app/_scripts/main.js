$(document).ready(function () {
    /**
     * Modals
     */
    $(document).on('click', '.modal-footer a', function (event) {
        $('.modal').modal('hide');
    });

    // Mail chimp modal, close on submit btn click
    $(document).on('click', '#mc-embedded-subscribe', function () {
        $('.modal').modal('hide');
    });

    // Main menu
    if($(window).width() > 767){
        // Main menu for desctop and tablet

        $(document).on('mouseenter','.navbar-main > li',function() {
            $(this).addClass('open');
        });
        $(document).on('mouseleave','.navbar-main > li',function() {
            $(this).removeClass('open');
        });
    } else {
        // Mobile main menu
        $(document).on('touchend','.navbar-main > li i',function(event) {
            event.preventDefault();
            $(this).closest("li").siblings().removeClass('open');
            $(this).closest("li").toggleClass('open');
        });
    }

});
