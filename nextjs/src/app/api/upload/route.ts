import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucket = formData.get('bucket') as string || 'sns-images'

    // 파일 존재 여부 확인
    if (!file) {
      return NextResponse.json(
        { error: '업로드할 파일을 선택해주세요.' },
        { status: 400 }
      )
    }

    // 파일 크기 검증 (25MB = 26214400 bytes)
    const maxSize = 25 * 1024 * 1024 // 25MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          error: `파일 크기가 너무 큽니다. 최대 25MB까지 업로드 가능합니다. (현재: ${Math.round(file.size / 1024 / 1024)}MB)`,
          fileSize: file.size,
          maxSize: maxSize,
          fileName: file.name
        },
        { status: 413 }
      )
    }

    // 파일 형식 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          error: `지원하지 않는 파일 형식입니다. (${file.type})`,
          allowedTypes: allowedTypes,
          fileName: file.name
        },
        { status: 400 }
      )
    }

    // 파일명 검증 (보안)
    if (file.name.length > 255) {
      return NextResponse.json(
        { error: '파일명이 너무 깁니다. (최대 255자)' },
        { status: 400 }
      )
    }

    // 위험한 확장자 체크
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.js', '.vbs']
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    if (dangerousExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: '보안상 업로드가 불가능한 파일 형식입니다.' },
        { status: 400 }
      )
    }

    console.log(`📤 파일 업로드 시작: ${file.name} (${Math.round(file.size / 1024)}KB) → ${bucket}`)

    // Supabase에 이미지 업로드
    const { url, error } = await uploadImage(file, bucket)

    if (error) {
      console.error('🚨 Supabase 업로드 에러:', error)
      return NextResponse.json(
        { 
          error: error.includes('413') 
            ? '파일 크기가 서버 제한을 초과했습니다.'
            : error.includes('401') 
            ? '업로드 권한이 없습니다.'
            : '이미지 업로드에 실패했습니다.',
          details: error
        },
        { status: 500 }
      )
    }

    console.log(`✅ 파일 업로드 완료: ${file.name} → ${url}`)

    return NextResponse.json({
      url,
      message: '파일이 성공적으로 업로드되었습니다.',
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type,
        bucket: bucket
      }
    })

  } catch (error) {
    console.error('💥 업로드 API 에러:', error)
    
    // 구체적인 에러 타입별 처리
    if (error instanceof Error) {
      if (error.message.includes('413') || error.message.includes('PayloadTooLargeError')) {
        return NextResponse.json(
          { error: '업로드 요청이 너무 큽니다. 파일 크기를 확인해주세요.' },
          { status: 413 }
        )
      }
      
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: '업로드 시간이 초과되었습니다. 네트워크 상태를 확인해주세요.' },
          { status: 408 }
        )
      }
    }

    return NextResponse.json(
      { 
        error: '파일 업로드 중 오류가 발생했습니다.',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 