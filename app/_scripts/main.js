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
    if($(window).width() > 1024){
        // Main menu for desctop and tablet

        $(document).on('mouseenter','.navbar-main li',function() {
            $(this).addClass('open');
        });
        $(document).on('mouseleave','.navbar-main li',function() {
            $(this).removeClass('open');
        });
    }
    if($(window).width() < 1025) {
        // Tablet and Mobile main menu
        $(document).on('touchend','.navbar-main li i',function(event) {
            event.preventDefault();
            event.stopPropagation();
            $(this).closest("li").siblings().removeClass('open');
            $(this).closest("li").toggleClass('open');
        });

    }
    if($(window).width() < 1025 && $(window).width() > 767) {
        // Tablet main menu
        $(document).on('touchend','.navbar-main li a',function(event) {
            setTimeout(function(){
                $(".dropdown-submenu").removeClass('open');
                $(".dropdown-nav").removeClass("open");
            }, 200);

        });
    }

    // Sticky header
    var scrollStart = 40;
    $(document).on('scroll', function () {
        var scroll = $("body").scrollTop();
        if (scroll > scrollStart) {
            $('.top-header').addClass("scroll");
        }
        else {
            $('.top-header').removeClass("scroll");
        }
    });

    // adult size charts modal for "product-info" cms page
    $(document).on('click','#myBtn',function(event){
        $('#popup_adult_chart').modal('show');
    });

    // youth size charts modal for "product-info" cms page
    $(document).on('click','#yourchar',function(event){
        $('#popup_youth_chart').modal('show');
    });

    // size charts modal for "product-info" cms page
    $(document).on('click', '#option-chart', function(e) {
        $('#modal_adult_chart').modal('show');
    });
});
