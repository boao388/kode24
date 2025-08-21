// import { GUI } from 'https://cdn.skypack.dev/dat.gui';

// const SULUTION = document.querySelector('.solution-area');
// const CARDS = document.querySelectorAll('.card');

// const CONFIG = {
//     proximity: 40,
//     spread: 80,
//     blur: 20,
//     gap: 32,
//     vertical: false,
//     opacity: 0 
// };


// const PROXIMITY = 10;

// const UPDATE = event => {
//   // get the angle based on the center point of the card and pointer position
//     for (const CARD of CARDS) {
//     // Check the card against the proximity and then start updating
//         const CARD_BOUNDS = CARD.getBoundingClientRect();
//         // Get distance between pointer and outerbounds of card
//         if (
//             (event === null || event === void 0 ? void 0 : event.x) > CARD_BOUNDS.left - CONFIG.proximity &&
//             (event === null || event === void 0 ? void 0 : event.x) < CARD_BOUNDS.left + CARD_BOUNDS.width + CONFIG.proximity &&
//             (event === null || event === void 0 ? void 0 : event.y) > CARD_BOUNDS.top - CONFIG.proximity &&
//             (event === null || event === void 0 ? void 0 : event.y) < CARD_BOUNDS.top + CARD_BOUNDS.height + CONFIG.proximity) {
//             // If within proximity set the active opacity
//             CARD.style.setProperty('--active', 1);
//         } else {
//             CARD.style.setProperty('--active', CONFIG.opacity);
//         }
        
//         const CARD_CENTER = [
//         CARD_BOUNDS.left + CARD_BOUNDS.width * 0.5,
//         CARD_BOUNDS.top + CARD_BOUNDS.height * 0.5];

//         let ANGLE = Math.atan2((event === null || event === void 0 ? void 0 : event.y) - CARD_CENTER[1], (event === null || event === void 0 ? void 0 : event.x) - CARD_CENTER[0]) * 180 / Math.PI;
//         ANGLE = ANGLE < 0 ? ANGLE + 360 : ANGLE;
//     CARD.style.setProperty('--start', ANGLE + 90);
//     }

// };

// document.body.addEventListener('pointermove', UPDATE);

// const RESTYLE = () => {
//     SULUTION.style.setProperty('--gap', CONFIG.gap);
//     SULUTION.style.setProperty('--blur', CONFIG.blur);
//     SULUTION.style.setProperty('--spread', CONFIG.spread);
//     SULUTION.style.setProperty('--direction', CONFIG.vertical ? 'column' : 'row');
// };

// const CTRL = new GUI({ width: 340 });

// CTRL.add(CONFIG, 'spread', 10, 180, 1).name('Spread (deg)').onChange(RESTYLE);
// CTRL.add(CONFIG, 'proximity', 10, 180, 1).name('Active Proximity (px)').onChange(RESTYLE);
// CTRL.add(CONFIG, 'gap', 10, 100, 1).name('Gap (px)').onChange(RESTYLE);
// CTRL.add(CONFIG, 'blur', 0, 50, 1).name('Blur (px)').onChange(RESTYLE);
// CTRL.add(CONFIG, 'opacity', 0, 1, 0.01).name('Inactive Opacity').onChange(RESTYLE);
// CTRL.add(CONFIG, 'vertical').name('Vertical Layout').onChange(RESTYLE);

// RESTYLE();
// UPDATE();


// DOM이 준비될 때까지 기다리는 함수
const waitForDOM = () => {
    return new Promise((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
      } else {
        resolve();
      }
    });
  };
  
  // DOM 요소들을 안전하게 가져오는 함수
  const getElements = () => {
    const SULUTION = document.querySelector('.solution-area');
    const CARDS = document.querySelectorAll('.card');
    
    if (!SULUTION) {
      console.warn('Solution area not found');
      return null;
    }
    
    return { SULUTION, CARDS };
  };
  
  const CONFIG = {
      proximity: 40,
      spread: 80,
      blur: 20,
      gap: 32,
      vertical: false,
      opacity: 0 
  };
  
  
  // 메인 초기화 함수
  const initLineEvent = async () => {
    await waitForDOM();
    
    const elements = getElements();
    if (!elements) {
      console.warn('Required elements not found, skipping line_event initialization');
      return;
    }
    
    const { SULUTION, CARDS } = elements;
  
    const UPDATE = event => {
      // get the angle based on the center point of the card and pointer position
      for (const CARD of CARDS) {
        // Check the card against the proximity and then start updating
        const CARD_BOUNDS = CARD.getBoundingClientRect();
        // Get distance between pointer and outerbounds of card
        if (
          (event?.x) > CARD_BOUNDS.left - CONFIG.proximity &&
          (event?.x) < CARD_BOUNDS.left + CARD_BOUNDS.width + CONFIG.proximity &&
          (event?.y) > CARD_BOUNDS.top - CONFIG.proximity &&
          (event?.y) < CARD_BOUNDS.top + CARD_BOUNDS.height + CONFIG.proximity) {
          // If within proximity set the active opacity
          CARD.style.setProperty('--active', 1);
        } else {
          CARD.style.setProperty('--active', CONFIG.opacity);
        }
        
        const CARD_CENTER = [
          CARD_BOUNDS.left + CARD_BOUNDS.width * 0.5,
          CARD_BOUNDS.top + CARD_BOUNDS.height * 0.5
        ];
  
        let ANGLE = Math.atan2((event?.y) - CARD_CENTER[1], (event?.x) - CARD_CENTER[0]) * 180 / Math.PI;
        ANGLE = ANGLE < 0 ? ANGLE + 360 : ANGLE;
        CARD.style.setProperty('--start', ANGLE + 90);
      }
    };
  
    const RESTYLE = () => {
      if (SULUTION) {
        SULUTION.style.setProperty('--gap', CONFIG.gap);
        SULUTION.style.setProperty('--blur', CONFIG.blur);
        SULUTION.style.setProperty('--spread', CONFIG.spread);
        SULUTION.style.setProperty('--direction', CONFIG.vertical ? 'column' : 'row');
      }
    };
  
    // 카드들의 초기 CSS 변수 설정
    const initializeCards = () => {
      CARDS.forEach(card => {
        card.style.setProperty('--active', CONFIG.opacity);
        card.style.setProperty('--start', '0');
      });
    };
  
    // 이벤트 리스너 등록
    document.body.addEventListener('pointermove', UPDATE);
  
    // GUI 컨트롤은 개발 환경에서만 사용하므로 제거
    // 기본 기능만 작동하도록 설정
    initializeCards();
    RESTYLE();
    UPDATE();
  };
  
  // 초기화 실행
  initLineEvent();