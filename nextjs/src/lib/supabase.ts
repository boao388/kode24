import { createClient } from '@supabase/supabase-js'

// 환경변수에서 값을 가져옴 (예시)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project-ref.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key'

// 클라이언트용 Supabase 클라이언트
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 서버용 Supabase 클라이언트 (서비스 키 사용)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// 이미지 업로드 함수
export async function uploadImage(file: File, bucket: string = 'sns-images'): Promise<{ url: string | null; error: string | null }> {
  try {
    // 파일 확장자 체크
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return { url: null, error: '지원되지 않는 파일 형식입니다. (jpg, png, gif, webp만 가능)' }
    }

    // 파일 크기 체크 (5MB 제한)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return { url: null, error: '파일 크기가 5MB를 초과합니다.' }
    }

    // 파일명 생성 (타임스탬프 + 랜덤 문자열)
    const timestamp = new Date().getTime()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExt = file.name.split('.').pop()
    const fileName = `${timestamp}_${randomString}.${fileExt}`

    // Supabase Storage에 업로드
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Supabase 업로드 에러:', error)
      return { url: null, error: '파일 업로드에 실패했습니다.' }
    }

    // 퍼블릭 URL 생성
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return { url: publicUrlData.publicUrl, error: null }
  } catch (error) {
    console.error('이미지 업로드 에러:', error)
    return { url: null, error: '파일 업로드 중 오류가 발생했습니다.' }
  }
}

// 이미지 삭제 함수
export async function deleteImage(url: string, bucket: string = 'sns-images'): Promise<{ success: boolean; error: string | null }> {
  try {
    // URL에서 파일명 추출
    const fileName = url.split('/').pop()
    if (!fileName) {
      return { success: false, error: '잘못된 파일 URL입니다.' }
    }

    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([fileName])

    if (error) {
      console.error('Supabase 삭제 에러:', error)
      return { success: false, error: '파일 삭제에 실패했습니다.' }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('이미지 삭제 에러:', error)
    return { success: false, error: '파일 삭제 중 오류가 발생했습니다.' }
  }
} 