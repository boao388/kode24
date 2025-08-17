(function($){
            
    // header 관련
    $(document).on('mouseenter', '#gnb > ul > li > a', function(){
        $('#gnb > ul > li').removeClass('active');
        $(this).parent().addClass('active');
    });
    $(document).on('mouseleave', '#gnb > ul', function(){
        $('#gnb > ul > li').removeClass('active');
    });

    // nav 관련
    $(document).on('click', '.btn-nav', function(){
        $('body').toggleClass('nav-opened');
    });
    
    // popup 관련
    $(document).on('click', '.btn-inquiry', function(e){
        $('.modal-backdrop').addClass('active');
        $($(this).attr('href')).addClass('active');
        e.preventDefault();
    });
    $(document).on('click', '.btn-modal-close', function(e){
        $('.modal-backdrop').removeClass('active');
        $('.modal-pop').removeClass('active');
        e.preventDefault();
    });
    
    $(document).on('click', '.btn-today, .pop-close', function(){
        $(this).parents('.popup').hide();
    });

})(jQuery);