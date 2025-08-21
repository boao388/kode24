import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteImage } from '@/lib/supabase'

// 개별 SNS 채널 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const snsChannel = await prisma.snsChannel.findUnique({
      where: { id }
    })

    if (!snsChannel) {
      return NextResponse.json(
        { error: 'SNS 채널을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ snsChannel })

  } catch (error) {
    console.error('SNS 채널 조회 에러:', error)
    return NextResponse.json(
      { error: 'SNS 채널을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// SNS 채널 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { name, description, imageUrl, linkUrl, platform, isActive, sortOrder } = body

    const { id } = await params
    
    // 기존 SNS 채널 확인
    const existingSnsChannel = await prisma.snsChannel.findUnique({
      where: { id }
    })

    if (!existingSnsChannel) {
      return NextResponse.json(
        { error: 'SNS 채널을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

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

    // SNS 채널 수정
    const updatedSnsChannel = await prisma.snsChannel.update({
      where: { id },
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
      snsChannel: updatedSnsChannel,
      message: 'SNS 채널이 성공적으로 수정되었습니다.'
    })

  } catch (error) {
    console.error('SNS 채널 수정 에러:', error)
    return NextResponse.json(
      { error: 'SNS 채널 수정에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// SNS 채널 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // 기존 SNS 채널 확인
    const existingSnsChannel = await prisma.snsChannel.findUnique({
      where: { id }
    })

    if (!existingSnsChannel) {
      return NextResponse.json(
        { error: 'SNS 채널을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 이미지가 Supabase 스토리지에 있으면 삭제
    if (existingSnsChannel.imageUrl && existingSnsChannel.imageUrl.includes('supabase')) {
      await deleteImage(existingSnsChannel.imageUrl)
    }

    // SNS 채널 삭제
    await prisma.snsChannel.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'SNS 채널이 성공적으로 삭제되었습니다.'
    })

  } catch (error) {
    console.error('SNS 채널 삭제 에러:', error)
    return NextResponse.json(
      { error: 'SNS 채널 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
} 