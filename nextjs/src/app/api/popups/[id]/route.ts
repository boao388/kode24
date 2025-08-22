import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractTokenFromHeader, verifyAdminToken } from '@/lib/auth'

// 특정 팝업 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    const isAdmin = token && verifyAdminToken(token)

    if (!isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const popup = await prisma.popup.findUnique({
      where: { id }
    })

    if (!popup) {
      return NextResponse.json({ message: '팝업을 찾을 수 없습니다.' }, { status: 404 })
    }

    return NextResponse.json({ popup })
  } catch (error) {
    console.error('팝업 조회 실패:', error)
    return NextResponse.json(
      { message: '팝업 조회에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// 팝업 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    const isAdmin = token && verifyAdminToken(token)

    if (!isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { title, imageUrl, linkUrl, isActive, sortOrder, startDate, endDate } = await request.json()

    const existingPopup = await prisma.popup.findUnique({
      where: { id }
    })

    if (!existingPopup) {
      return NextResponse.json({ message: '팝업을 찾을 수 없습니다.' }, { status: 404 })
    }

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

    // 활성화 상태 변경 시 최대 3개 제한 체크
    if (isActive && !existingPopup.isActive) {
      const activePopupsCount = await prisma.popup.count({
        where: { 
          isActive: true,
          id: { not: id } // 현재 팝업 제외
        }
      })

      if (activePopupsCount >= 3) {
        return NextResponse.json(
          { message: '활성 팝업은 최대 3개까지만 등록할 수 있습니다.' },
          { status: 400 }
        )
      }
    }

    // 순서 중복 체크 (자기 자신 제외)
    if (sortOrder && sortOrder !== existingPopup.sortOrder) {
      const existingOrderPopup = await prisma.popup.findFirst({
        where: { 
          sortOrder: parseInt(sortOrder),
          isActive: true,
          id: { not: id }
        }
      })

      if (existingOrderPopup) {
        return NextResponse.json(
          { message: `순서 ${sortOrder}는 이미 사용 중입니다.` },
          { status: 400 }
        )
      }
    }

    const popup = await prisma.popup.update({
      where: { id },
      data: {
        title: title.trim(),
        imageUrl: imageUrl.trim(),
        linkUrl: linkUrl?.trim() || null,
        isActive: isActive ?? existingPopup.isActive,
        sortOrder: sortOrder ? parseInt(sortOrder) : existingPopup.sortOrder,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      }
    })

    return NextResponse.json({
      message: '팝업이 수정되었습니다.',
      popup
    })
  } catch (error) {
    console.error('팝업 수정 실패:', error)
    return NextResponse.json(
      { message: '팝업 수정에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// 팝업 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    const isAdmin = token && verifyAdminToken(token)

    if (!isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const existingPopup = await prisma.popup.findUnique({
      where: { id }
    })

    if (!existingPopup) {
      return NextResponse.json({ message: '팝업을 찾을 수 없습니다.' }, { status: 404 })
    }

    await prisma.popup.delete({
      where: { id }
    })

    return NextResponse.json({ message: '팝업이 삭제되었습니다.' })
  } catch (error) {
    console.error('팝업 삭제 실패:', error)
    return NextResponse.json(
      { message: '팝업 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}
