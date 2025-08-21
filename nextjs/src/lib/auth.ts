import jwt from 'jsonwebtoken'

// 클라이언트 사이드에서 관리자 토큰 확인
export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('adminToken')
}

// 클라이언트 사이드에서 관리자 인증 상태 확인
export function isAdminAuthenticated(): boolean {
  const token = getAdminToken()
  if (!token) return false
  
  try {
    const decoded = jwt.decode(token) as any
    if (!decoded || !decoded.exp) return false
    
    // 토큰이 만료되었는지 확인
    const currentTime = Math.floor(Date.now() / 1000)
    return decoded.exp > currentTime
  } catch (error) {
    return false
  }
}

// 서버 사이드에서 관리자 토큰 검증
export function verifyAdminToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret')
    return decoded as any
  } catch (error) {
    return null
  }
}

// Authorization 헤더에서 토큰 추출
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}

// 관리자 권한으로 API 요청 시 사용할 헤더 생성
export function createAuthHeaders(): HeadersInit {
  const token = getAdminToken()
  if (!token) return {}
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
} 