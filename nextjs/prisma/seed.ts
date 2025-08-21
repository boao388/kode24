import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('시드 데이터 생성을 시작합니다...')

  // 관리자 계정 생성
  console.log('관리자 계정 생성 중...')
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@kode24.co.kr' },
    update: {},
    create: {
      email: 'admin@kode24.co.kr',
      password: await bcrypt.hash('admin123!', 10),
      name: 'KODE24 관리자',
      role: 'SUPER_ADMIN'
    }
  })
  console.log('관리자 계정 생성 완료:', admin.email)

  // 게시판 생성
  const boards = [
    {
      key: 'kode_report',
      title: '코드24 보안리포트',
      description: 'KODE24에서 제공하는 보안 관련 리포트'
    },
    {
      key: 'app_report',
      title: '악성 앱 분석',
      description: '악성 앱 분석 결과 및 리포트'
    },
    {
      key: 'issue_report',
      title: '보안 이슈',
      description: '최신 보안 이슈 및 취약점 정보'
    },
    {
      key: 'notice',
      title: '공지사항',
      description: 'KODE24 공지사항'
    },
    {
      key: 'real_time',
      title: '실시간 해결문의',
      description: '긴급 상황 실시간 문의'
    },
    {
      key: 'review',
      title: '솔루션 진행 후기',
      description: '고객 후기 및 경험 공유'
    },
    {
      key: 'press',
      title: '보도자료',
      description: 'KODE24 관련 언론 보도'
    },
    {
      key: 'patent',
      title: '인증특허',
      description: '보유 기술 특허 및 인증서'
    }
  ]

  const createdBoards = []
  for (const boardData of boards) {
    const board = await prisma.board.upsert({
      where: { key: boardData.key },
      update: {},
      create: boardData
    })
    // @ts-ignore
    createdBoards.push(board)
  }

  // 샘플 게시글 생성
  const samplePosts = [
    {
      boardKey: 'kode_report',
      title: '2025년 1월 몸캠피싱 동향 및 대응 방안',
      content: `
        <h5>요약</h5>
        <p>2025년 1월 첫 2주 동안 몸캠피싱 피해 신고가 전월 대비 35% 증가했습니다. 특히 20-30대 남성을 대상으로 한 신종 수법이 확산되고 있어 각별한 주의가 필요합니다.</p>
        
        <h5>주요 동향</h5>
        <ul>
          <li>피해 증가율: +35% (전월 대비)</li>
          <li>주요 대상: 20-30대 남성</li>
          <li>평균 피해액: 150만원</li>
        </ul>
        
        <h5>신종 수법 분석</h5>
        <p>1. AI 딥페이크 활용: 범죄자들이 AI 기술을 악용하여 더욱 정교한 가짜 영상을 제작하고 있습니다.</p>
        <p>2. 소셜 엔지니어링 강화: SNS 정보를 사전에 수집하여 맞춤형 접근을 시도합니다.</p>
        <p>3. 다중 플랫폼 활용: 여러 플랫폼을 동시에 활용하여 도피 경로를 차단합니다.</p>
        
        <h5>대응 방안</h5>
        <p><strong>예방 수칙:</strong></p>
        <ul>
          <li>모르는 사람과의 영상통화 절대 금지</li>
          <li>개인정보 노출 최소화</li>
          <li>의심스러운 연락 즉시 차단</li>
          <li>주변인들에게 상황 공유</li>
        </ul>
        
        <p><strong>피해 발생 시:</strong></p>
        <ul>
          <li>범인의 요구에 절대 응하지 말 것</li>
          <li>증거자료 보전</li>
          <li>즉시 신고 (경찰, 금융감독원)</li>
          <li>피해를 당했다면 즉시 전문가에게 상담받으세요</li>
        </ul>
        
        <h5>긴급 연락처</h5>
        <ul>
          <li>24시간 상담전화: 1555-2501</li>
          <li>이메일: kode24@kode24.co.kr</li>
          <li>온라인 상담: 홈페이지 실시간 문의</li>
        </ul>
        
        <p>여러분의 안전한 인터넷 생활을 위해 KODE24가 항상 함께하겠습니다.</p>
      `,
      authorName: '관리자'
    },
    // 공지사항 - Featured 공지글 (pinned)
    {
      boardKey: 'notice',
      title: '7월 몸캠피싱 해결 무료지원 캠페인',
      content: `
        <h5>7월 몸캠피싱 해결 무료지원 캠페인 안내</h5>
        <p>안녕하세요, KODE24입니다.</p>
        <p>7월 한 달 동안 몸캠피싱 피해를 당하신 분들을 위한 <strong>무료 지원 캠페인</strong>을 진행합니다.</p>
        
        <h5>지원 내용</h5>
        <ul>
          <li><strong>초기 상담:</strong> 100% 무료</li>
          <li><strong>긴급 대응:</strong> 24시간 즉시 처리</li>
          <li><strong>법적 자문:</strong> 전문 변호사 상담</li>
          <li><strong>디지털 포렌식:</strong> 증거 수집 및 분석</li>
        </ul>
        
        <h5>신청 방법</h5>
        <p>📞 <strong>전화:</strong> 1555-2501 (24시간 상담)</p>
        <p>✉️ <strong>이메일:</strong> kode24@kode24.co.kr</p>
        <p>💬 <strong>실시간 상담:</strong> 홈페이지 실시간 문의</p>
        
        <p><strong>캠페인 기간:</strong> 2025년 7월 1일 ~ 7월 31일</p>
        <p>피해를 당하셨다면 혼자 고민하지 마시고 즉시 연락주세요.</p>
      `,
      authorName: 'KODE24',
      isFeatured: true
    },
    // 공지사항 - 일반 공지글
    {
      boardKey: 'notice',
      title: '코드24 보호장비 및 기술 안내',
      content: `
        <h5>KODE24 보호장비 및 기술 소개</h5>
        <p>KODE24에서 사용하는 최신 보안 기술과 장비를 소개합니다.</p>
        
        <h5>주요 기술</h5>
        <ul>
          <li><strong>AI 기반 위협 탐지:</strong> 실시간 악성코드 분석</li>
          <li><strong>디지털 포렌식:</strong> 고급 증거 수집 기술</li>
          <li><strong>딥웹 모니터링:</strong> 24시간 위협 추적</li>
          <li><strong>암호화 기술:</strong> 군사급 보안 솔루션</li>
        </ul>
        
        <h5>보호장비</h5>
        <ul>
          <li>고성능 서버 클러스터</li>
          <li>전용 보안 네트워크</li>
          <li>실시간 모니터링 시스템</li>
          <li>백업 및 복구 시스템</li>
        </ul>
        
        <p>궁금한 사항이 있으시면 언제든지 문의해주세요.</p>
      `,
      authorName: 'KODE24',
      isFeatured: false
    },
    // 공지사항 - 일반 공지글 2
    {
      boardKey: 'notice',
      title: 'KODE24 서비스 이용 안내',
      content: `
        <h5>KODE24 서비스 이용 안내</h5>
        <p>KODE24 서비스를 이용해주셔서 감사합니다.</p>
        
        <h5>서비스 시간</h5>
        <ul>
          <li><strong>상담 서비스:</strong> 24시간 365일</li>
          <li><strong>기술 지원:</strong> 평일 09:00 ~ 18:00</li>
          <li><strong>긴급 대응:</strong> 24시간 즉시 처리</li>
        </ul>
        
        <h5>연락처</h5>
        <ul>
          <li><strong>대표번호:</strong> 1555-2501</li>
          <li><strong>이메일:</strong> kode24@kode24.co.kr</li>
          <li><strong>카카오톡:</strong> KODE24 공식 채널</li>
        </ul>
        
        <p>더 나은 서비스 제공을 위해 항상 노력하겠습니다.</p>
      `,
      authorName: 'KODE24',
      isFeatured: false
    },
    // 실시간 해결문의 - 일반 게시글들
    {
      boardKey: 'real_time',
      title: '몸캠피싱 피해 긴급상담 요청',
      content: `
        <p>안녕하세요. 몸캠피싱 피해를 당한 것 같아 긴급히 상담을 요청드립니다.</p>
        <p>어제 밤 SNS를 통해 접근한 사람과 영상통화를 하게 되었는데, 의심스러운 행동을 보여서 연락을 끊었습니다.</p>
        <p>하지만 오늘 오전부터 협박성 메시지가 계속 오고 있어서 매우 불안한 상태입니다.</p>
        <p>빠른 조치가 필요할 것 같은데, 어떻게 해야 할까요?</p>
        <p>24시간 상담이 가능하다고 하니 답변 부탁드립니다.</p>
      `,
      authorName: '김철수',
      isSecret: false
    },
    {
      boardKey: 'real_time',
      title: '이윤호님의 빠른 상담 요청글입니다.',
      content: `
        <p>긴급히 상담이 필요합니다.</p>
        <p>몸캠피싱 관련하여 문의드립니다.</p>
        <p>빠른 답변 부탁드립니다.</p>
      `,
      authorName: '이윤호',
      isSecret: false
    },
    {
      boardKey: 'real_time',
      title: '박민수님의 상담 요청',
      content: `
        <p>몸캠피싱 관련 상담 요청드립니다.</p>
        <p>긴급한 사안이라 빠른 처리 부탁드립니다.</p>
      `,
      authorName: '박민수',
      isSecret: false
    },
    {
      boardKey: 'real_time',
      title: '정수현님의 긴급 문의',
      content: `
        <p>디지털 성범죄 관련 문의사항이 있습니다.</p>
        <p>전문가 상담이 필요한 상황입니다.</p>
      `,
      authorName: '정수현',
      isSecret: false
    },
    {
      boardKey: 'real_time',
      title: '최영진님의 상담 요청글입니다.',
      content: `
        <p>몸캠피싱 피해 관련 상담 요청드립니다.</p>
        <p>신속한 대응이 필요한 상황입니다.</p>
      `,
      authorName: '최영진',
      isSecret: false
    },
    // 실시간 해결문의 - 비밀글 (비밀번호: 1234)
    {
      boardKey: 'real_time',
      title: '이세현 님의 빠른 상담 요청 글입니다',
      content: `
        <p>상담요청입니다.</p>
        <p>개인적인 내용이 포함되어 있어 비밀글로 작성합니다.</p>
        <p>가능한 빨리 답변 부탁드립니다.</p>
      `,
      authorName: '이세현',
      isSecret: true,
      password: '1234'
    },
    // 실시간 해결문의 - 비밀글 (비밀번호: test123)
    {
      boardKey: 'real_time',
      title: '박영희 님의 개인상담 요청',
      content: `
        <p>개인정보가 포함된 민감한 사안으로 비밀글로 문의드립니다.</p>
        <p>몸캠피싱 관련하여 긴급상담이 필요합니다.</p>
        <p>신속한 처리 부탁드립니다.</p>
      `,
      authorName: '박영희',
      isSecret: true,
      password: 'test123'
    },
    // 보도자료 게시글들
    {
      boardKey: 'press',
      title: '몸캠피싱 해결전문기업 코드24, 중소벤처기업부 \'2025년 초기창업패키지\' 최종 선정',
      content: `
        <p>몸캠피싱 전문 해결 기업 코드24가 중소벤처기업부의 '2025년 초기창업패키지'에 최종 선정되었습니다.</p>
        <p>이번 선정으로 코드24는 창업 초기 기업에 대한 체계적인 지원을 받게 되어, 더욱 전문적인 서비스를 제공할 수 있게 되었습니다.</p>
      `,
      authorName: 'KODE24',
      linkUrl: 'https://www.dailysecu.com/news/articleView.html?idxno=166144',
      imageUrl: '/assets/images/sub/img_press01.png',
      publishedAt: '2025-05-16'
    },
    {
      boardKey: 'press',
      title: '\'코드24\', 2024 재창업 데모데이 우수 기업 선정',
      content: `
        <p>코드24가 2024 재창업 데모데이에서 우수 기업으로 선정되었습니다.</p>
        <p>혁신적인 몸캠피싱 해결 솔루션으로 심사위원들의 높은 평가를 받았습니다.</p>
      `,
      authorName: 'KODE24',
      linkUrl: 'https://www.epnc.co.kr/news/articleView.html?idxno=308655',
      imageUrl: '/assets/images/sub/img_press02.png',
      publishedAt: '2025-05-16'
    },
    {
      boardKey: 'press',
      title: '코드24, 몸캠피싱·딥페이크 영상 해결 처리속도 10배 A.I. 가속장비 도입',
      content: `
        <p>코드24가 AI 가속장비를 도입하여 몸캠피싱 및 딥페이크 영상 해결 처리속도를 10배 향상시켰습니다.</p>
        <p>이로써 더욱 신속한 피해 대응이 가능해졌습니다.</p>
      `,
      authorName: 'KODE24',
      linkUrl: 'https://www.newsculture.press/news/articleView.html?idxno=555536',
      imageUrl: '/assets/images/sub/img_press03.png',
      publishedAt: '2025-05-16'
    },
    {
      boardKey: 'press',
      title: '코드24, 몸캠피싱 피해 유포방지 9월 무상 지원 서비스 24시간 운영',
      content: `
        <p>코드24가 9월 한 달간 몸캠피싱 피해 유포방지 무상 지원 서비스를 24시간 운영한다고 발표했습니다.</p>
        <p>피해자들의 빠른 회복을 위한 사회적 책임을 다하고자 합니다.</p>
      `,
      authorName: 'KODE24',
      linkUrl: 'http://www.livesnews.com/news/article.html?no=42717',
      imageUrl: '/assets/images/sub/img_press04.png',
      publishedAt: '2025-05-16'
    },
    {
      boardKey: 'press',
      title: '\'서울대 딥페이크\' 공범 징역 5년... 판사도 "역겨운 내용"',
      content: `
        <p>서울대 딥페이크 사건의 공범이 징역 5년을 선고받았습니다.</p>
        <p>판사는 "역겨운 내용"이라며 강한 처벌 의지를 보였습니다.</p>
      `,
      authorName: 'KODE24',
      linkUrl: 'https://v.daum.net/v/20240828114201397',
      imageUrl: '/assets/images/sub/img_press05.png',
      publishedAt: '2025-05-16'
    },
    {
      boardKey: 'press',
      title: '몸캠피싱 대응 전문기업 \'코드24\', 긴급해결 TFT팀 구축',
      content: `
        <p>코드24가 몸캠피싱 사건에 대한 신속한 대응을 위해 긴급해결 TFT팀을 구축했습니다.</p>
        <p>24시간 대기조를 운영하여 피해자들의 긴급 상황에 즉시 대응합니다.</p>
      `,
      authorName: 'KODE24',
      linkUrl: 'https://www.woodkorea.co.kr/news/articleView.html?idxno=80837',
      imageUrl: '/assets/images/sub/img_press06.png',
      publishedAt: '2025-05-16'
    },
    {
      boardKey: 'press',
      title: '몸캠피씽(몸또) 해결 전문 코드24, 무료 지원으로 사회적 기여 확대',
      content: `
        <p>코드24가 몸캠피싱 피해자들을 위한 무료 지원을 확대하여 사회적 기여를 늘리고 있습니다.</p>
        <p>경제적 부담 없이 전문적인 도움을 받을 수 있도록 지원하고 있습니다.</p>
      `,
      authorName: 'KODE24',
      linkUrl: 'https://www.gpkorea.com/news/articleView.html?idxno=118221',
      imageUrl: '/assets/images/sub/img_none_frame.png',
      publishedAt: '2025-05-16'
    },
    {
      boardKey: 'press',
      title: '코드24(KODE24), 몸캠피싱 무료 해결 서비스 지원',
      content: `
        <p>코드24가 몸캠피싱 피해자들을 위한 무료 해결 서비스를 지원한다고 발표했습니다.</p>
        <p>전문적인 기술과 노하우로 피해 복구에 최선을 다하고 있습니다.</p>
      `,
      authorName: 'KODE24',
      linkUrl: 'https://www.gpkorea.com/news/articleView.html?idxno=118084',
      imageUrl: '/assets/images/sub/img_none_frame.png',
      publishedAt: '2025-05-16'
    },
    {
      boardKey: 'press',
      title: '몸캠피싱 전문해결 기업 코드24, 사회공헌 활동 지속 확대',
      content: `
        <p>코드24가 몸캠피싱 문제 해결을 위한 사회공헌 활동을 지속적으로 확대하고 있습니다.</p>
        <p>전문 기술을 바탕으로 한 사회적 책임을 다하기 위해 노력하고 있습니다.</p>
      `,
      authorName: 'KODE24',
      linkUrl: 'http://www.ikunkang.com/news/articleView.html?idxno=40473',
      imageUrl: '/assets/images/sub/img_press07.png',
      publishedAt: '2025-05-16'
    },
    {
      boardKey: 'press',
      title: '코드24, 몸캠피싱 해결 전문 기업으로 업계 선두 입지 강화',
      content: `
        <p>코드24가 몸캠피싱 해결 전문 기업으로서 업계 선두 입지를 더욱 강화하고 있습니다.</p>
        <p>지속적인 기술 개발과 서비스 개선으로 고객 만족도를 높이고 있습니다.</p>
      `,
      authorName: 'KODE24',
      linkUrl: 'https://www.joseilbo.com/news/htmls/2024/11/20241113523058.html',
      imageUrl: '/assets/images/sub/img_press08.png',
      publishedAt: '2025-05-16'
    },
    // 인증특허 게시글들
    {
      boardKey: 'patent',
      title: '몸캠피싱 탐지 및 차단 시스템 특허',
      content: `
        <p><strong>특허번호:</strong> 10-2024-0123456</p>
        <p><strong>특허명:</strong> 딥러닝 기반 몸캠피싱 탐지 및 자동 차단 시스템</p>
        <p><strong>출원일:</strong> 2024.03.15</p>
        <p><strong>등록일:</strong> 2024.11.20</p>
        <br>
        <p><strong>특허 요약:</strong></p>
        <p>본 발명은 AI 기술을 활용하여 몸캠피싱 콘텐츠를 실시간으로 탐지하고 자동으로 차단하는 시스템에 관한 것입니다.</p>
        <p>딥러닝 알고리즘을 통해 영상 패턴을 분석하고, 99.7%의 정확도로 몸캠피싱 콘텐츠를 식별합니다.</p>
      `,
      authorName: 'KODE24',
      linkUrl: 'https://patents.go.kr/patent/view?application_number=1020240123456',
      imageUrl: '/assets/images/sub/img_patent01.png',
      publishedAt: '2024-11-20'
    },
    {
      boardKey: 'patent',
      title: '디지털 증거 수집 및 분석 시스템',
      content: `
        <p><strong>특허번호:</strong> 10-2024-0234567</p>
        <p><strong>특허명:</strong> 사이버 범죄 디지털 증거 수집 및 포렌식 분석 시스템</p>
        <p><strong>출원일:</strong> 2024.06.10</p>
        <p><strong>등록일:</strong> 2024.12.05</p>
        <br>
        <p><strong>특허 요약:</strong></p>
        <p>사이버 범죄 수사를 위한 디지털 증거 수집, 보전, 분석 시스템입니다.</p>
        <p>블록체인 기술을 활용하여 증거의 무결성을 보장하고, 법정에서 인정받을 수 있는 형태로 증거를 수집합니다.</p>
      `,
      authorName: 'KODE24',
      linkUrl: 'https://patents.go.kr/patent/view?application_number=1020240234567',
      imageUrl: '/assets/images/sub/img_patent02.png',
      publishedAt: '2024-12-05'
    },
    // 솔루션 진행 후기 게시글들
    {
      boardKey: 'review',
      title: '정말 힘들 뻔 했는데',
      content: `
        <p>피싱범이 유포한다고 협박할 때 검색해서 들어왔는데 24시간이고 상담원분께서 친절하게 말씀해 주셔서 마음이 놓이고 안정됐습니다.</p>
        <p>이제 거의 한 달째가 돼가는데 협박범한테서 연락도 없고 주변 지인들한테 연락도 안 오고 있습니다 감사합니다!</p>
      `,
      authorName: '익명',
      isSecret: false
    },
    {
      boardKey: 'review',
      title: '빠른 대응에 감사드립니다',
      content: `
        <p>몸캠피싱 당해서 정말 절망적이었는데, KODE24에서 24시간 내에 바로 대응해주셔서 정말 감사했습니다.</p>
        <p>전문적인 솔루션으로 문제를 해결해주시고, 사후관리까지 꼼꼼하게 해주셔서 안심이 됩니다.</p>
        <p>혹시 비슷한 피해를 당하신 분들이 있다면 망설이지 마시고 연락해보세요.</p>
      `,
      authorName: '김민준',
      isSecret: false
    },
    {
      boardKey: 'review',
      title: '전문적인 해결 솔루션',
      content: `
        <p>처음에는 반신반의했지만, 정말 전문적인 기술로 문제를 해결해주셨습니다.</p>
        <p>AI 기반 솔루션이라고 하시는데, 정말 효과적이었어요.</p>
        <p>이제는 안심하고 일상생활을 할 수 있게 되었습니다. 정말 감사합니다.</p>
      `,
      authorName: '이서연',
      isSecret: false
    },
    {
      boardKey: 'review',
      title: '1년 사후관리 서비스 최고',
      content: `
        <p>해결 후에도 1년간 사후관리를 해주신다고 하니 정말 안심이 됩니다.</p>
        <p>중간중간 안부도 물어봐주시고, 혹시 문제가 생기면 언제든 연락하라고 하셔서 마음이 놓여요.</p>
        <p>이런 세심한 서비스는 처음 받아봅니다.</p>
      `,
      authorName: '박지훈',
      isSecret: false
    },
    {
      boardKey: 'review',
      title: '24시간 상담 정말 도움됐어요',
      content: `
        <p>새벽에 갑자기 협박 메시지가 와서 정말 당황했는데, 24시간 상담 서비스 덕분에 바로 도움을 받을 수 있었습니다.</p>
        <p>상담원분이 차근차근 설명해주시고, 즉시 대응 방안을 알려주셔서 정말 감사했습니다.</p>
        <p>지금은 모든 게 해결되어서 평온한 일상을 보내고 있습니다.</p>
      `,
      authorName: '최수빈',
      isSecret: false
    },
    {
      boardKey: 'review',
      title: '딥페이크 대응 솔루션 완벽해요',
      content: `
        <p>딥페이크로 만들어진 가짜 영상 때문에 정말 고민이 많았는데, KODE24의 AI 솔루션으로 완벽하게 해결됐습니다.</p>
        <p>기술적으로 정말 놀라웠고, 결과도 만족스러웠습니다.</p>
        <p>전문가들이 정말 많은 연구를 하신 것 같아요. 추천합니다!</p>
      `,
      authorName: '정민호',
      isSecret: false
    }
  ]

  for (const postData of samplePosts) {
    // @ts-ignore
    const board = createdBoards.find(b => b.key === postData.boardKey)
    // @ts-ignore
    if (board) {
      const postCreateData: any = {
        title: postData.title,
        content: postData.content,
        authorName: postData.authorName,
        boardId: board.id,
        status: 'PUBLISHED',
        isPublished: true,
        publishedAt: postData.publishedAt ? new Date(postData.publishedAt) : new Date(),
        isSecret: postData.isSecret || false,
        isFeatured: postData.isFeatured || false,
        linkUrl: postData.linkUrl,
        imageUrl: postData.imageUrl
      }

      // 비밀글인 경우 비밀번호 해시화하여 추가
      if (postData.isSecret && postData.password) {
        postCreateData.password = await bcrypt.hash(postData.password, 10)
      }

      await prisma.post.create({
        data: postCreateData
      })
    }
  }

  // FAQ 데이터 생성
  const faqs = [
    {
      question: '몸캠피싱을 당했을 때 가장 먼저 해야 할 일은 무엇인가요?',
      answer: '침착하게 대응하는 것이 가장 중요합니다. 절대 범인의 요구에 응하지 마시고, 즉시 전문기관에 신고하세요. KODE24에서는 24시간 긴급 상담을 제공합니다.',
      category: '피해대응',
      sortOrder: 1
    },
    {
      question: 'KODE24의 서비스 이용 비용은 얼마인가요?',
      answer: '초기 상담은 무료로 진행되며, 사건의 복잡도와 해결 범위에 따라 비용이 결정됩니다. 정확한 비용은 상담 후 안내드립니다.',
      category: '서비스',
      sortOrder: 2
    },
    {
      question: '해결까지 보통 얼마나 걸리나요?',
      answer: '사건의 성격과 복잡도에 따라 다르지만, 일반적으로 24시간 내 초기 대응이 이루어지며, 완전한 해결까지는 평균 3-7일 소요됩니다.',
      category: '처리기간',
      sortOrder: 3
    },
    {
      question: '가해자에게 돈을 보내준다며 시간을 끄는 중입니다.',
      answer: '<p>보통 첫 유포는 가해자와 대화를 하는 와중에 유포가 되는 경우가 대다수입니다.<br>가해자에게 돈을 보내주겠다고 시간을 끈다면, 오히려 가해자를 자극하게 되서 되려 유포 가능성이 매우 높아집니다.<br>더 나아가 돈을 구하겠다고 하고 돈을 못 주거나 가해자의 연락을 일방적으로 끊거나 하여 더욱 자극하게 된다면,<br>이는 n차 유포로까지 이어질 가능성도 있기 때문에 가해자에게 돈을 준다며 시간을 끄는 행동은 삼가하는 게 좋습니다.</p>',
      category: '피해대응',
      sortOrder: 10
    },
    {
      question: 'KODE24 상담 서비스는 어떻게 이용하나요?',
      answer: '<p>KODE24 상담 서비스는 다음과 같이 이용하실 수 있습니다:</p><ul><li><strong>전화 상담:</strong> 1555-2501 (24시간 운영)</li><li><strong>온라인 상담:</strong> 홈페이지 실시간 문의</li><li><strong>이메일 상담:</strong> kode24@kode24.co.kr</li><li><strong>방문 상담:</strong> 사전 예약 필요</li></ul><p>모든 상담은 무료로 진행되며, 개인정보는 철저히 보호됩니다.</p>',
      category: '서비스이용',
      sortOrder: 5
    },
    {
      question: '몸캠피싱 예방법이 있나요?',
      answer: '<p>몸캠피싱을 예방하는 방법은 다음과 같습니다:</p><ul><li><strong>모르는 사람과 영상통화 금지:</strong> 절대 낯선 사람과 영상통화하지 마세요</li><li><strong>개인정보 보호:</strong> SNS에 개인정보를 과도하게 노출하지 마세요</li><li><strong>의심스러운 링크 차단:</strong> 출처가 불분명한 링크는 클릭하지 마세요</li><li><strong>앱 다운로드 주의:</strong> 공식 앱스토어가 아닌 곳에서 앱을 다운로드하지 마세요</li></ul>',
      category: '예방법',
      sortOrder: 4
    },
    {
      question: '피해 신고는 어디에 하나요?',
      answer: '<p>몸캠피싱 피해 신고는 다음 기관에서 할 수 있습니다:</p><ul><li><strong>경찰청 사이버범죄신고:</strong> cyber.go.kr</li><li><strong>사이버테러대응센터:</strong> 118</li><li><strong>금융감독원:</strong> 1332</li><li><strong>KODE24 긴급신고:</strong> 1555-2501</li></ul><p>빠른 대응을 위해서는 KODE24에 먼저 연락하시는 것을 권장합니다.</p>',
      category: '신고절차',
      sortOrder: 6
    },
    {
      question: '가족이나 지인에게 알리고 싶지 않은데 도움을 받을 수 있나요?',
      answer: '<p>네, 물론입니다. KODE24는 완전한 비밀보장을 원칙으로 합니다.</p><ul><li><strong>개인정보 보호:</strong> 모든 상담 내용은 철저히 비밀보장됩니다</li><li><strong>익명 상담 가능:</strong> 실명 없이도 상담 받으실 수 있습니다</li><li><strong>가족 통지 없음:</strong> 본인 동의 없이는 가족에게 통지하지 않습니다</li></ul><p>안심하시고 전문가의 도움을 받으시기 바랍니다.</p>',
      category: '개인정보보호',
      sortOrder: 7
    }
  ]

  for (const faqData of faqs) {
    await prisma.fAQ.create({
      data: {
        question: faqData.question,
        answer: faqData.answer,
        category: faqData.category,
        sortOrder: faqData.sortOrder
      }
    })
  }

  // SNS 채널 데이터 생성
  console.log('SNS 채널 데이터를 생성 중입니다...')
  
  const snsChannels = [
    {
      name: 'KODE24 YouTube 채널',
      description: '최신 사이버 보안 정보와 몸캠피싱 대응법을 동영상으로 제공합니다',
      imageUrl: '/assets/images/sub/img_yotube.png',
      linkUrl: 'https://www.youtube.com/@%EC%BD%94%EB%93%9C24',
      platform: 'youtube',
      isActive: true,
      sortOrder: 1
    },
    {
      name: 'KODE24 네이버 블로그',
      description: '사이버 범죄 사례와 예방법에 대한 자세한 정보를 블로그로 제공합니다',
      imageUrl: '/assets/images/sub/img_blog.png',
      linkUrl: 'https://blog.naver.com/numerous13288',
      platform: 'blog',
      isActive: true,
      sortOrder: 2
    }
  ]

  for (const snsData of snsChannels) {
    await prisma.snsChannel.create({
      data: snsData
    })
  }

  console.log('시드 데이터 생성이 완료되었습니다!')
  console.log(`생성된 게시판: ${createdBoards.length}개`)
  console.log(`생성된 게시글: ${samplePosts.length}개`)
  console.log(`생성된 FAQ: ${faqs.length}개`)
  console.log(`생성된 SNS 채널: ${snsChannels.length}개`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 