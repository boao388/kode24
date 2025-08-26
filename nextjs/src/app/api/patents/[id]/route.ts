import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Post를 Patent View용으로 변환하는 헬퍼 함수
interface PostForPatent {
  id: string
  title: string
  content: string | null
  excerpt: string | null
  imageUrl: string | null
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  viewCount: number
  authorName: string
  isPublished: boolean
  category?: { key: string } | null
  board: { title: string, key: string }
}

// 한국시간 날짜 포맷팅 함수 (patent_list와 동일)
const formatToKST = (date: Date): string => {
  const kstOffset = 9 * 60 // KST는 UTC+9
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000)
  const kstTime = new Date(utc + (kstOffset * 60000))
  return kstTime.toISOString().split('T')[0]
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // patent 게시판 ID 조회
    const patentBoard = await prisma.board.findUnique({
      where: { key: 'patent' }
    })

    if (!patentBoard) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Patent board not found' 
        },
        { status: 404 }
      )
    }

    // 게시글 상세 조회 (조회수 증가 포함)
    const post = await prisma.post.findFirst({
      where: {
        id: id,
        boardId: patentBoard.id,
        isPublished: true,
        status: 'PUBLISHED'
      },
      include: {
        board: {
          select: { title: true, key: true }
        },
        category: {
          select: { name: true, key: true }
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Patent not found' 
        },
        { status: 404 }
      )
    }

    // 조회수 증가
    await prisma.post.update({
      where: { id: id },
      data: { viewCount: { increment: 1 } }
    })

    // Patent 형식으로 변환하여 반환 (report_view와 유사한 형식)
    const patentData = {
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      authorName: post.authorName,
      imageUrl: post.imageUrl || '/assets/images/sub/img_patent01.png',
      date: post.publishedAt ? formatToKST(post.publishedAt) : formatToKST(post.createdAt),
      category: post.category?.key || 'certification',
      viewCount: post.viewCount + 1, // 증가된 조회수
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      publishedAt: post.publishedAt,
      board: post.board
    }

    return NextResponse.json({
      success: true,
      data: patentData,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // 인증특허 수정은 관리자 API(/api/admin/posts/[id])에서 처리하도록 안내
    return NextResponse.json({
      success: true,
      message: 'Patent updates should be done through admin API (/api/admin/posts/' + id + ')'
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
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
