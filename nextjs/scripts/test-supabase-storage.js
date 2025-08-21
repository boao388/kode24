const { createClient } = require('@supabase/supabase-js')

// 환경변수에서 Supabase 설정 가져오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다.')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function testSupabaseStorage() {
  console.log('🔍 Supabase Storage 연결 테스트 시작...\n')

  try {
    // 1. 버켓 목록 조회
    console.log('1️⃣ 버켓 목록 조회...')
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets()
    
    if (listError) {
      console.error('❌ 버켓 목록 조회 실패:', listError.message)
      return
    }

    console.log('✅ 현재 버켓 목록:')
    buckets?.forEach(bucket => {
      console.log(`   - ${bucket.name} (${bucket.public ? 'Public' : 'Private'})`)
    })

    // 2. sns-images 버켓 확인
    const bucketName = 'sns-images'
    const bucketExists = buckets?.some(b => b.name === bucketName)
    
    console.log(`\n2️⃣ '${bucketName}' 버켓 확인...`)
    
    if (bucketExists) {
      console.log(`✅ '${bucketName}' 버켓이 이미 존재합니다.`)
    } else {
      console.log(`⚠️ '${bucketName}' 버켓이 존재하지 않습니다. 생성 시도...`)
      
      // 3. 버켓 생성
      const { data: createData, error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      })

      if (createError) {
        console.error(`❌ '${bucketName}' 버켓 생성 실패:`, createError.message)
        
        // 권한 문제인 경우 안내
        if (createError.message.includes('permission') || createError.message.includes('unauthorized')) {
          console.log('\n💡 해결 방법:')
          console.log('1. Supabase 대시보드(https://supabase.com/dashboard)에 로그인')
          console.log('2. 프로젝트 선택')
          console.log('3. 좌측 메뉴에서 "Storage" 클릭')
          console.log('4. "Create bucket" 버튼 클릭')
          console.log(`5. Bucket name에 "${bucketName}" 입력`)
          console.log('6. "Public bucket" 체크박스 선택')
          console.log('7. "Create bucket" 클릭')
        }
        return
      }

      console.log(`✅ '${bucketName}' 버켓 생성 완료!`)
    }

    // 4. 최종 확인
    console.log('\n3️⃣ 최종 버켓 목록 확인...')
    const { data: finalBuckets, error: finalError } = await supabaseAdmin.storage.listBuckets()
    
    if (finalError) {
      console.error('❌ 최종 확인 실패:', finalError.message)
      return
    }

    console.log('✅ 최종 버켓 목록:')
    finalBuckets?.forEach(bucket => {
      const status = bucket.name === bucketName ? '🎯' : '  '
      console.log(`${status} - ${bucket.name} (${bucket.public ? 'Public' : 'Private'})`)
    })

    console.log('\n🎉 Supabase Storage 설정 완료!')
    console.log('이제 이미지 업로드가 정상적으로 작동할 것입니다.')

  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error.message)
    console.log('\n💡 문제 해결:')
    console.log('1. .env 파일의 Supabase 설정 확인')
    console.log('2. 네트워크 연결 상태 확인')
    console.log('3. Supabase 프로젝트 상태 확인')
  }
}

// 스크립트 실행
testSupabaseStorage()
