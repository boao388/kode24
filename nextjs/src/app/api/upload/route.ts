import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucket = formData.get('bucket') as string || 'sns-images'

    if (!file) {
      return NextResponse.json(
        { error: '업로드할 파일을 선택해주세요.' },
        { status: 400 }
      )
    }

    // Supabase에 이미지 업로드
    const { url, error } = await uploadImage(file, bucket)

    if (error) {
      return NextResponse.json(
        { error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      url,
      message: '파일이 성공적으로 업로드되었습니다.'
    })

  } catch (error) {
    console.error('업로드 API 에러:', error)
    return NextResponse.json(
      { error: '파일 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 