import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractTokenFromHeader, verifyAdminToken } from '@/lib/auth'

// 팝업 목록 조회 (관리자용)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    const isAdmin = token && verifyAdminToken(token)

    if (!isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const popups = await prisma.popup.findMany({
      orderBy: {
        sortOrder: 'asc'
      }
    })

    return NextResponse.json({ popups })
  } catch (error) {
    console.error('팝업 목록 조회 실패:', error)
    return NextResponse.json(
      { message: '팝업 목록 조회에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// 팝업 생성
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    const isAdmin = token && verifyAdminToken(token)

    if (!isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { title, imageUrl, linkUrl, isActive, sortOrder, startDate, endDate } = await request.json()

    if (!title?.trim()) {
      return NextResponse.json(
        { message: '팝업 제목을 입력해주세요.' },
        { status: 400 }
      )
    }

    if (!imageUrl?.trim()) {
      return NextResponse.json(
        { message: '팝업 이미지를 업로드해주세요.' },
        { status: 400 }
      )
    }

    // 최대 3개 제한 체크
    const activePopupsCount = await prisma.popup.count({
      where: { isActive: true }
    })

    if (isActive && activePopupsCount >= 3) {
      return NextResponse.json(
        { message: '활성 팝업은 최대 3개까지만 등록할 수 있습니다.' },
        { status: 400 }
      )
    }

    // 순서 중복 체크
    if (sortOrder) {
      const existingPopup = await prisma.popup.findFirst({
        where: { 
          sortOrder: parseInt(sortOrder),
          isActive: true
        }
      })

      if (existingPopup) {
        return NextResponse.json(
          { message: `순서 ${sortOrder}는 이미 사용 중입니다.` },
          { status: 400 }
        )
      }
    }

    const popup = await prisma.popup.create({
      data: {
        title: title.trim(),
        imageUrl: imageUrl.trim(),
        linkUrl: linkUrl?.trim() || null,
        isActive: isActive ?? true,
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      }
    })

    return NextResponse.json({
      message: '팝업이 생성되었습니다.',
      popup
    }, { status: 201 })
  } catch (error) {
    console.error('팝업 생성 실패:', error)
    return NextResponse.json(
      { message: '팝업 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}
