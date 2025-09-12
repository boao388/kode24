import { createClient, SupabaseClient } from '@supabase/supabase-js'

// 환경변수에서 값을 가져옴
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project-ref.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key'

// 성능 최적화된 Supabase 클라이언트 옵션
const supabaseOptions = {
  auth: {
    // 자동 토큰 새로고침 활성화
    autoRefreshToken: true,
    // 토큰 저장 방식 최적화
    persistSession: true,
    // 세션 감지 최적화
    detectSessionInUrl: false,
  },
  // 연결 최적화
  db: {
    schema: 'public',
  },
  // 실시간 기능 비활성화 (성능 향상)
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  // 글로벌 설정
  global: {
    headers: {
      'x-application-name': 'kode24-nextjs',
    },
  },
}

// 클라이언트용 Supabase 클라이언트 (최적화된 설정)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseOptions)

// 서버용 Supabase 클라이언트 (서비스 키 사용, 최적화된 설정)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  ...supabaseOptions,
  auth: {
    autoRefreshToken: false, // 서버 사이드에서는 토큰 새로고침 불필요
    persistSession: false,   // 서버 사이드에서는 세션 저장 불필요
    detectSessionInUrl: false,
  },
})

// 연결 풀링을 위한 클라이언트 인스턴스 캐싱
const clientCache = new Map<string, SupabaseClient>()

// 최적화된 클라이언트 팩토리 함수
export function getOptimizedSupabaseClient(isAdmin: boolean = false): SupabaseClient {
  const cacheKey = isAdmin ? 'admin' : 'client'
  
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey)!
  }
  
  const client = isAdmin ? supabaseAdmin : supabase
  clientCache.set(cacheKey, client)
  
  return client
}

// 버켓 존재 확인 및 생성 함수
async function ensureBucketExists(bucket: string): Promise<boolean> {
  try {
    // 버켓 목록 조회
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets()
    
    if (listError) {
      console.error('버켓 목록 조회 에러:', listError)
      return false
    }

    // 버켓이 이미 존재하는지 확인
    const bucketExists = buckets?.some(b => b.name === bucket)
    
    if (bucketExists) {
      return true
    }

    // 버켓이 없으면 생성
    const { data, error: createError } = await supabaseAdmin.storage.createBucket(bucket, {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    })

    if (createError) {
      console.error('버켓 생성 에러:', createError)
      return false
    }

    console.log(`버켓 '${bucket}' 생성 완료`)
    return true
  } catch (error) {
    console.error('버켓 확인/생성 에러:', error)
    return false
  }
}

// 이미지 업로드 함수
export async function uploadImage(file: File, bucket: string = 'sns-images'): Promise<{ url: string | null; error: string | null }> {
  try {
    // 파일 확장자 체크
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return { url: null, error: '지원되지 않는 파일 형식입니다. (jpg, png, gif, webp만 가능)' }
    }

    // 파일 크기 체크 (5MB 제한)
    const maxSize = 25 * 1024 * 1024 // 25MB
    if (file.size > maxSize) {
      return { url: null, error: '파일 크기가 25MB를 초과합니다.' }
    }

    // 버켓 존재 확인 및 생성
    const bucketReady = await ensureBucketExists(bucket)
    if (!bucketReady) {
      return { url: null, error: 'Storage 버켓 설정에 실패했습니다.' }
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
      
      // 버켓 not found 에러인 경우 더 자세한 안내
      if (error.message.includes('Bucket not found')) {
        return { url: null, error: 'Storage 버켓이 존재하지 않습니다. Supabase 대시보드에서 버켓을 생성해주세요.' }
      }
      
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