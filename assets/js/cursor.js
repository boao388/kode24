let isCursorActive = false;
let $bigBall, $smallBall, $hoverables;

function initCursor() {
    $bigBall = document.querySelector('.cursor__ball--big');
    $smallBall = document.querySelector('.cursor__ball--small');
    $hoverables = document.querySelectorAll('.hoverable');

    document.body.addEventListener('mousemove', onMouseMove);
    $hoverables.forEach(el => {
        el.addEventListener('mouseenter', onMouseHover);
        el.addEventListener('mouseleave', onMouseHoverOut);
    });
    isCursorActive = true;
}

function destroyCursor() {
    document.body.removeEventListener('mousemove', onMouseMove);
    if ($hoverables) {
        $hoverables.forEach(el => {
            el.removeEventListener('mouseenter', onMouseHover);
            el.removeEventListener('mouseleave', onMouseHoverOut);
        });
    }
    isCursorActive = false;
}

// 마우스 이동 처리
function onMouseMove(e) {
    TweenMax.to($bigBall, 0.4, {
        x: e.pageX - 15,
        y: e.pageY - 15
    });
    TweenMax.to($smallBall, 0.1, {
        x: e.pageX - 5,
        y: e.pageY - 7
    });
}

// hover 시 확대
function onMouseHover() {
    TweenMax.to($bigBall, 0.3, { scale: 4 });
}

// hover 해제 시 원래 크기
function onMouseHoverOut() {
    TweenMax.to($bigBall, 0.3, { scale: 1 });
}

// 처음 실행 시 화면 크기 체크
function checkCursorActivation() {
    if (window.innerWidth >= 1024) {
        if (!isCursorActive) initCursor();
    } else {
        if (isCursorActive) destroyCursor();
    }
}

window.addEventListener('resize', checkCursorActivation);
checkCursorActivation(); // 페이지 최초 로드 시 실행




/*const $bigBall = document.querySelector('.cursor__ball--big');
const $smallBall = document.querySelector('.cursor__ball--small');
const $hoverables = document.querySelectorAll('.hoverable');

// Listeners
document.body.addEventListener('mousemove', onMouseMove);
for (let i = 0; i < $hoverables.length; i++) {
    $hoverables[i].addEventListener('mouseenter', onMouseHover);
    $hoverables[i].addEventListener('mouseleave', onMouseHoverOut);
}

// Move the cursor
function onMouseMove(e) {
    TweenMax.to($bigBall, .4, {
        x: e.pageX - 15,
        y: e.pageY - 15
    });
    TweenMax.to($smallBall, .1, {
        x: e.pageX - 5,
        y: e.pageY - 7
    });
}

// Hover an element
function onMouseHover() {
    TweenMax.to($bigBall, .3, {
        scale: 4
    });
}
function onMouseHoverOut() {
    TweenMax.to($bigBall, .3, {
        scale: 1
    });
}*/