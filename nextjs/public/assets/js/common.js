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
    
    // popup 관련 - btn-inquiry 이벤트 제거 (카카오톡 직접 연결로 변경됨)
    $(document).on('click', '.btn-modal-close', function(e){
        $('.modal-backdrop').removeClass('active');
        $('.modal-pop').removeClass('active');
        e.preventDefault();
    });
    
    $(document).on('click', '.btn-today, .pop-close', function(){
        $(this).parents('.popup').hide();
    });
    
    // 모바일 메뉴 링크 클릭 시 메뉴 닫기
    $(document).on('click', '#nav a', function() {
        $('body').removeClass('nav-opened');
    });

})(jQuery);