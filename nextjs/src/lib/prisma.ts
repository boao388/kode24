import { PrismaClient } from '@prisma/client'

// Prisma 클라이언트 전역 타입 정의
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 성능 최적화된 Prisma 클라이언트 생성
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // 연결 풀링 최적화
  __internal: {
    engine: {
      // 연결 풀 크기 최적화 (Vercel 환경에 맞춤)
      connectionLimit: 5,
      // 연결 타임아웃 설정
      connectTimeout: 60000, // 60초
      // 쿼리 타임아웃 설정  
      queryTimeout: 30000, // 30초
      // 유휴 연결 타임아웃
      idleTimeout: 300000, // 5분
    },
  },
})

// 개발 환경에서만 전역 변수에 저장 (Hot Reload 시 재생성 방지)
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Prisma 연결 상태 확인 함수
export async function checkPrismaConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Prisma 데이터베이스 연결 성공')
    return true
  } catch (error) {
    console.error('❌ Prisma 데이터베이스 연결 실패:', error)
    return false
  }
}

// 연결 종료 함수 (애플리케이션 종료 시 사용)
export async function disconnectPrisma() {
  try {
    await prisma.$disconnect()
    console.log('✅ Prisma 연결 종료 완료')
  } catch (error) {
    console.error('❌ Prisma 연결 종료 실패:', error)
  }
}

// 트랜잭션 헬퍼 함수
export async function withTransaction<T>(
  fn: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(fn, {
    maxWait: 5000, // 5초 대기
    timeout: 30000, // 30초 타임아웃
    isolationLevel: 'ReadCommitted',
  })
}

// 배치 처리 헬퍼 함수
export async function batchProcess<T, R>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<R[]>
): Promise<R[]> {
  const results: R[] = []
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await processor(batch)
    results.push(...batchResults)
    
    // 배치 간 짧은 지연으로 DB 부하 분산
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 10))
    }
  }
  
  return results
}
