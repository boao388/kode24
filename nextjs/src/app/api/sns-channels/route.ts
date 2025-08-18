import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// SNS 채널 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')

    const whereClause: any = {}
    if (isActive !== null && isActive !== undefined) {
      whereClause.isActive = isActive === 'true'
    }

    const snsChannels = await prisma.snsChannel.findMany({
      where: whereClause,
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({
      snsChannels,
      count: snsChannels.length
    })

  } catch (error) {
    console.error('SNS 채널 조회 에러:', error)
    return NextResponse.json(
      { error: 'SNS 채널을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// SNS 채널 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, imageUrl, linkUrl, platform, isActive, sortOrder } = body

    // 필수 필드 검증
    if (!name || !imageUrl || !linkUrl || !platform) {
      return NextResponse.json(
        { error: '필수 필드를 모두 입력해주세요. (이름, 이미지, 링크, 플랫폼)' },
        { status: 400 }
      )
    }

    // URL 형식 검증
    try {
      new URL(linkUrl)
    } catch {
      return NextResponse.json(
        { error: '올바른 링크 URL을 입력해주세요.' },
        { status: 400 }
      )
    }

    // SNS 채널 생성
    const snsChannel = await prisma.snsChannel.create({
      data: {
        name,
        description: description || null,
        imageUrl,
        linkUrl,
        platform,
        isActive: isActive ?? true,
        sortOrder: sortOrder ?? 0
      }
    })

    return NextResponse.json({
      snsChannel,
      message: 'SNS 채널이 성공적으로 생성되었습니다.'
    }, { status: 201 })

  } catch (error) {
    console.error('SNS 채널 생성 에러:', error)
    return NextResponse.json(
      { error: 'SNS 채널 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
} 