// jumbotron
setTimeout(function(){
    $('.jumbotron').addClass('show');
}, 500);

// tab 관련
$(document).on('click','.tab-menu > ul > li > a', function(e){
    $('.tab-menu > ul > li a').parent().removeClass('active');
    $('.tab-content > .tab-pane').removeClass('active');
    $(this).parent().addClass('active');
    $($(this).attr('href')).addClass('active');
    e.preventDefault();
});
$(document).on('click','.awards-tab > ul > li > a', function(e){
    $('.awards-tab > ul > li a').parent().removeClass('active');
    $('.awards-content > .awards-pane').removeClass('active');
    $(this).parent().addClass('active');
    $($(this).attr('href')).addClass('active');
    e.preventDefault();
});
$(document).on('click','.certificate-tab > ul > li > a', function(e){
    $('.certificate-tab > ul > li a').parent().removeClass('active');
    $('.certificate-content > .certificate-pane').removeClass('active');
    $(this).parent().addClass('active');
    $($(this).attr('href')).addClass('active');
    e.preventDefault();
});

// partner list
var partnersSwiper1 = new Swiper(".partners-swiper", {
    slidesPerView: "auto",
    loop: true,
    observeParents: true,
    observe: true,
    speed: 5000,
    touchRatio: 0,
    autoplay: {
      delay: 0,
      disableOnInteraction: false
    },
});

$(window).on('scroll', function() {
    $('.effect').each(function(index, elem) {
        if ($(window).scrollTop() > $(elem).offset().top - ($(window).height() / 2)) {
            $(elem).addClass('show');
        }
    });
});