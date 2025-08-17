import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('시드 데이터 생성을 시작합니다...')

  // 관리자 계정 생성
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
          <li>의심스러운 링크 클릭 금지</li>
          <li>정기적인 개인정보 보안 점검</li>
        </ul>
        
        <p><strong>피해 발생 시 대응:</strong></p>
        <ul>
          <li>즉시 112 신고 및 사이버수사대 신고</li>
          <li>모든 대화 내용과 증거 보전</li>
          <li>금전 요구에 절대 응하지 말 것</li>
          <li>전문기관(KODE24 등) 상담 요청</li>
        </ul>
      `,
      authorName: 'KODE24 보안팀'
    },
    {
      boardKey: 'app_report',
      title: '악성 앱 분석 결과보고서 - Whale.apk',
      content: `
        <h5>분석 개요</h5>
        <p>파일명: Whale.apk</p>
        <p>크기: 12.3MB</p>
        <p>분석일: 2025.01.15</p>
        <p>위험도: 높음</p>
        
        <h5>발견된 악성 행위</h5>
        <ul>
          <li>개인정보 무단 수집</li>
          <li>루팅 권한 획득 시도</li>
          <li>SMS 메시지 가로채기</li>
          <li>카메라/마이크 무단 접근</li>
        </ul>
        
        <h5>대응 방안</h5>
        <p>해당 앱이 설치된 경우 즉시 삭제하고, 개인정보 변경을 권장합니다.</p>
      `,
      authorName: 'KODE24 분석팀'
    },
    {
      boardKey: 'notice',
      title: '몸캠피싱 피해 예방을 위한 중요 안내사항',
      content: `
        <p>안녕하세요, KODE24입니다.</p>
        <p>최근 몸캠피싱 범죄가 증가하고 있어 피해 예방을 위한 중요한 안내사항을 공지드립니다.</p>
        
        <h5>주요 예방 수칙</h5>
        <ul>
          <li>모르는 사람과의 화상통화는 절대 하지 마세요</li>
          <li>개인정보나 신체 노출이 포함된 영상은 촬영하지 마세요</li>
          <li>의심스러운 링크나 파일은 클릭하지 마세요</li>
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
    }
  ]

  for (const postData of samplePosts) {
    const board = createdBoards.find(b => b.key === postData.boardKey)
    if (board) {
      await prisma.post.create({
        data: {
          title: postData.title,
          content: postData.content,
          authorName: postData.authorName,
          boardId: board.id,
          status: 'PUBLISHED',
          isPublished: true,
          publishedAt: new Date()
        }
      })
    }
  }

  // FAQ 데이터 생성
  const faqs = [
    {
      question: '몸캠피싱을 당했을 때 가장 먼저 해야 할 일은 무엇인가요?',
      answer: '침착하게 대응하는 것이 가장 중요합니다. 절대 범인의 요구에 응하지 마시고, 즉시 전문기관에 신고하세요. KODE24에서는 24시간 긴급 상담을 제공합니다.',
      category: '피해대응'
    },
    {
      question: 'KODE24의 서비스 이용 비용은 얼마인가요?',
      answer: '초기 상담은 무료로 진행되며, 사건의 복잡도와 해결 범위에 따라 비용이 결정됩니다. 정확한 비용은 상담 후 안내드립니다.',
      category: '서비스'
    },
    {
      question: '해결까지 보통 얼마나 걸리나요?',
      answer: '사건의 성격과 복잡도에 따라 다르지만, 일반적으로 24시간 내 초기 대응이 이루어지며, 완전한 해결까지는 평균 3-7일 소요됩니다.',
      category: '처리기간'
    }
  ]

  for (const faqData of faqs) {
    await prisma.fAQ.create({
      data: faqData
    })
  }

  console.log('시드 데이터 생성이 완료되었습니다!')
  console.log(`생성된 게시판: ${createdBoards.length}개`)
  console.log(`생성된 게시글: ${samplePosts.length}개`)
  console.log(`생성된 FAQ: ${faqs.length}개`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 