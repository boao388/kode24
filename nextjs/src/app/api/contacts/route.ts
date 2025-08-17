import { NextRequest, NextResponse } from 'next/server'
import { ContactFormData } from '@/types'

export async function GET() {
  try {
    // 실제로는 Prisma를 사용하여 데이터베이스에서 연락처 목록을 가져옴
    const contacts = [
      {
        id: '1',
        name: '홍길동',
        email: 'hong@example.com',
        phone: '010-1234-5678',
        subject: '몸캠피싱 피해 상담',
        message: '몸캠피싱 피해를 당했습니다. 도움이 필요합니다.',
        type: 'CONSULTATION',
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    return NextResponse.json({
      success: true,
      data: contacts
    })
  } catch (error) {
    console.error('연락처 조회 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: '연락처를 조회하는 중 오류가 발생했습니다.'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()

    // 필수 필드 검증
    if (!body.name || !body.message) {
      return NextResponse.json(
        {
          success: false,
          error: '이름과 메시지는 필수입니다.'
        },
        { status: 400 }
      )
    }

    // 실제로는 Prisma를 사용하여 데이터베이스에 저장
    const newContact = {
      id: Date.now().toString(),
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      subject: body.subject || null,
      message: body.message,
      type: body.type || 'INQUIRY',
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // 실제 구현에서는 여기서 Prisma를 사용하여 데이터베이스에 저장
    // const contact = await prisma.contact.create({
    //   data: {
    //     name: body.name,
    //     email: body.email,
    //     phone: body.phone,
    //     subject: body.subject,
    //     message: body.message,
    //     type: body.type || ContactType.INQUIRY,
    //     status: ContactStatus.PENDING
    //   }
    // })

    return NextResponse.json({
      success: true,
      data: newContact,
      message: '문의가 성공적으로 접수되었습니다.'
    })
  } catch (error) {
    console.error('연락처 저장 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: '문의를 저장하는 중 오류가 발생했습니다.'
      },
      { status: 500 }
    )
  }
} 