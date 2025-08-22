import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 활성 팝업 목록 조회 (사용자용)
export async function GET(request: NextRequest) {
  try {
    const now = new Date()

    const popups = await prisma.popup.findMany({
      where: {
        isActive: true,
        OR: [
          // 시작일과 종료일이 모두 null인 경우 (항상 표시)
          {
            AND: [
              { startDate: null },
              { endDate: null }
            ]
          },
          // 시작일만 설정된 경우 (시작일 이후부터 표시)
          {
            AND: [
              { startDate: { lte: now } },
              { endDate: null }
            ]
          },
          // 종료일만 설정된 경우 (종료일 이전까지 표시)
          {
            AND: [
              { startDate: null },
              { endDate: { gte: now } }
            ]
          },
          // 시작일과 종료일이 모두 설정된 경우 (기간 내 표시)
          {
            AND: [
              { startDate: { lte: now } },
              { endDate: { gte: now } }
            ]
          }
        ]
      },
      orderBy: {
        sortOrder: 'asc'
      },
      take: 3, // 최대 3개만 조회
      select: {
        id: true,
        title: true,
        imageUrl: true,
        linkUrl: true,
        sortOrder: true
      }
    })

    return NextResponse.json({ popups })
  } catch (error) {
    console.error('활성 팝업 목록 조회 실패:', error)
    return NextResponse.json(
      { message: '팝업 목록 조회에 실패했습니다.' },
      { status: 500 }
    )
  }
}
