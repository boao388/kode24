import { NextRequest, NextResponse } from 'next/server'
import { Patent } from '@/types'

// 더미 데이터 (실제로는 데이터베이스에서 가져옴)
const dummyPatents: Patent[] = [
  {
    id: '1',
    title: '재도전 참여패키지 참여선정기업',
    description: '재도전 참여패키지 참여선정기업 관련 인증서입니다.',
    imageUrl: '/assets/images/sub/img_patent01.png',
    date: '2025-05-16',
    category: 'certification',
    isActive: true,
    sortOrder: 1,
    createdAt: new Date('2025-05-16'),
    updatedAt: new Date('2025-05-16')
  },
  {
    id: '2',
    title: '몸캠피싱 24시 해결 코드24',
    description: '몸캠피싱 24시 해결 서비스 관련 특허입니다.',
    imageUrl: '/assets/images/sub/img_patent02.png',
    date: '2025-05-16',
    category: 'patent',
    isActive: true,
    sortOrder: 2,
    createdAt: new Date('2025-05-16'),
    updatedAt: new Date('2025-05-16')
  }
]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const patent = dummyPatents.find(p => p.id === id)
    
    if (!patent) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Patent not found' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: patent,
      message: 'Patent retrieved successfully'
    })
  } catch (error) {
    console.error('Error fetching patent:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch patent' 
      },
      { status: 500 }
    )
  }
}

// PUT - 인증특허 수정 (관리자 전용)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    const patentIndex = dummyPatents.findIndex(p => p.id === id)
    
    if (patentIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Patent not found' 
        },
        { status: 404 }
      )
    }

    // 업데이트 (실제로는 데이터베이스에서 수정)
    const updatedPatent: Patent = {
      ...dummyPatents[patentIndex],
      ...body,
      updatedAt: new Date()
    }

    dummyPatents[patentIndex] = updatedPatent

    return NextResponse.json({
      success: true,
      data: updatedPatent,
      message: 'Patent updated successfully'
    })
  } catch (error) {
    console.error('Error updating patent:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update patent' 
      },
      { status: 500 }
    )
  }
}

// DELETE - 인증특허 삭제 (관리자 전용)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const patentIndex = dummyPatents.findIndex(p => p.id === id)
    
    if (patentIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Patent not found' 
        },
        { status: 404 }
      )
    }

    // 삭제 (실제로는 데이터베이스에서 삭제)
    dummyPatents.splice(patentIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Patent deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting patent:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete patent' 
      },
      { status: 500 }
    )
  }
}
