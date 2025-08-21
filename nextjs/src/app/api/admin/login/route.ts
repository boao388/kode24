import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'kode24-admin-secret'

// 관리자 로그인
export async function POST(request: NextRequest) {
  try {
    console.log('Admin login attempt started')
    const body = await request.json()
    console.log('Request body parsed:', { email: body.email, password: '[REDACTED]' })
    const { email, password } = body

    // 입력값 검증
    if (!email?.trim() || !password) {
      console.log('Validation failed: missing email or password')
      return NextResponse.json(
        { message: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 관리자 계정 조회
    console.log('Looking up admin with email:', email.trim())
    const admin = await prisma.admin.findUnique({
      where: { email: email.trim() },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        isActive: true
      }
    })

    console.log('Admin lookup result:', admin ? 'found' : 'not found')
    if (!admin) {
      console.log('Admin not found for email:', email.trim())
      return NextResponse.json(
        { message: '존재하지 않는 관리자 계정입니다.' },
        { status: 401 }
      )
    }

    if (!admin.isActive) {
      return NextResponse.json(
        { message: '비활성화된 계정입니다.' },
        { status: 401 }
      )
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, admin.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: '비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      )
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      {
        adminId: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // 응답 생성 (토큰을 응답에 포함)
    const response = NextResponse.json({
      message: '로그인 성공',
      token: token, // 클라이언트에서 localStorage에 저장할 토큰
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    })

    // 추가로 쿠키에도 토큰 설정 (옵션)
    response.cookies.set('admin-token', token, {
      httpOnly: false, // JavaScript에서 접근 가능하게 설정
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24시간
    })

    return response

  } catch (error) {
    console.error('관리자 로그인 실패:', error)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 