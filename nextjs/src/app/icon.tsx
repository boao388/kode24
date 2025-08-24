import { ImageResponse } from 'next/og'
 
// 이미지 메타데이터 설정
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
// 아이콘 컴포넌트
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'linear-gradient(90deg, #7757FF 0%, #5A42D4 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '4px',
        }}
      >
        K
      </div>
    ),
    {
      ...size,
    }
  )
}
