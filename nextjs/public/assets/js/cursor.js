// cursor.js - 원본 퍼블리싱과 동일한 기능으로 Next.js에 맞게 구현
(function() {
    'use strict';
    
    function initCursor() {
        const $bigBall = document.querySelector('.cursor__ball--big');
        const $smallBall = document.querySelector('.cursor__ball--small');
        const $hoverables = document.querySelectorAll('.hoverable');
        
        if (!$bigBall || !$smallBall) {
            console.log('Cursor elements not found');
            return;
        }
        
        console.log('Cursor initialized with', $hoverables.length, 'hoverable elements');

        // Move the cursor
        function onMouseMove(e) {
            if (typeof TweenMax !== 'undefined') {
                TweenMax.to($bigBall, .4, {
                    x: e.pageX - 15,
                    y: e.pageY - 15
                });
                TweenMax.to($smallBall, .1, {
                    x: e.pageX - 5,
                    y: e.pageY - 7
                });
            }
        }

        // Hover an element
        function onMouseHover() {
            if (typeof TweenMax !== 'undefined') {
                TweenMax.to($bigBall, .3, {
                    scale: 4
                });
            }
        }
        
        function onMouseHoverOut() {
            if (typeof TweenMax !== 'undefined') {
                TweenMax.to($bigBall, .3, {
                    scale: 1
                });
            }
        }

        // Listeners - 원본과 동일한 방식
        document.body.addEventListener('mousemove', onMouseMove);
        for (let i = 0; i < $hoverables.length; i++) {
            $hoverables[i].addEventListener('mouseenter', onMouseHover);
            $hoverables[i].addEventListener('mouseleave', onMouseHoverOut);
        }
    }

    // DOM이 준비된 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCursor);
    } else if (document.readyState === 'interactive' || document.readyState === 'complete') {
        // TweenMax 로딩을 기다린 후 실행
        setTimeout(initCursor, 100);
    }
})();