// text length counter
$(document).ready(function(){
    var maxLength = 100;
    $('.text-length').on('input', function(){
        var text = $(this).val();
        var length = text.length;

        if(length > maxLength){
            $(this).val(text.substring(0, maxLength));
            length = maxLength;
        }

        $('.char-count').text(length);

        if(length >= maxLength){
            $('.txt-counter').addClass('over');
        } else {
            $('.txt-counter').removeClass('over');
        }
    });
});

// page header 관련
setTimeout(function(){
    $('.page-header').addClass('show');
}, 500);

// 순차적 효과
$(window).on('scroll', function() {
    $('.solutions, .overview, .effect').each(function(index, elem) {
        if ($(window).scrollTop() > $(elem).offset().top - ($(window).height() / 2)) {
            $(elem).addClass('show');
        }
    });
});

// respond 관련
$(document).on('mouseenter', '.respond > ol > li', function(){
    $('.respond > ol > li').removeClass('active');
    $(this).addClass('active');
});

// qna
$(document).on('click', '.btn-qna', function(){
    var $btn = $(this);
    var $answer = $btn.closest('li').find('.answer');

    if ($answer.is(':visible')) {
        // 열려 있으면 닫기
        $answer.slideUp();
        $btn.parent().removeClass('active');
    } else {
        // 다른 답변 모두 닫기
        $('.answer').slideUp();
        $('.btn-qna').parent().removeClass('active');
        $answer.slideDown();
        $btn.parent().addClass('active');
    }
});

function typed() {
    TypeHangul.type('.typed', {
        intervalType: 80,
        humanize: .5,
    });
}

typed();