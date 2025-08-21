'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import HtmlEditor from '@/components/ui/HtmlEditor'

interface Post {
  id: string
  title: string
  content?: string
  authorName?: string
  authorEmail?: string
  isSecret: boolean
  isFeatured: boolean
  viewCount: number
  createdAt: string
  updatedAt: string
  board: {
    key: string
    title: string
  }
}

interface Comment {
  id: string
  content: string
  authorName: string
  isSecret: boolean
  isAdmin: boolean
  createdAt: string
  replies?: Comment[]
}

interface AdminAnswer {
  id: string
  content: string
  createdAt: string
  updatedAt: string
}

// 게시판별 설정 정보
const BOARD_CONFIGS: Record<string, any> = {
  real_time: {
    title: '실시간 해결문의',
    icon: '🚨',
    hasAnswer: true,
    userGenerated: true
  },
  review: {
    title: '솔루션 진행 후기',
    icon: '⭐',
    hasAnswer: false,
    userGenerated: true
  },
  notice: {
    title: '공지사항',
    icon: '📢',
    hasAnswer: false,
    userGenerated: false
  }
}

export default function AdminPostDetailPage() {
  const router = useRouter()
  const params = useParams()
  const boardKey = params.boardKey as string
  const postId = params.postId as string
  
  const config = BOARD_CONFIGS[boardKey] || {}
  
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [adminAnswer, setAdminAnswer] = useState<AdminAnswer | null>(null)
  const [loading, setLoading] = useState(true)
  const [answerContent, setAnswerContent] = useState('')
  const [showAnswerForm, setShowAnswerForm] = useState(false)
  const [savingAnswer, setSavingAnswer] = useState(false)

  // 관리자 인증 확인
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      router.push('/admin/login')
      return
    }
    
    // 토큰 유효성 검사
    try {
      const tokenData = JSON.parse(atob(adminToken.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      
      if (tokenData.exp && tokenData.exp < currentTime) {
        localStorage.removeItem('adminToken')
        router.push('/admin/login')
        return
      }
    } catch (error) {
      console.error('Invalid token format:', error)
      localStorage.removeItem('adminToken')
      router.push('/admin/login')
      return
    }
  }, [router])

  // 게시글 및 댓글 로드
  const loadPostData = async () => {
    try {
      setLoading(true)
      const adminToken = localStorage.getItem('adminToken')
      
      // 게시글 정보 로드
      const postResponse = await fetch(`/api/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })
      
      if (postResponse.ok) {
        const postData = await postResponse.json()
        setPost(postData)
      }

      // 댓글 목록 로드
      const commentsResponse = await fetch(`/api/posts/${postId}/comments`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })
      
      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json()
        setComments(commentsData)
      }

      // 실시간 문의인 경우 관리자 답변 로드
      if (config.hasAnswer) {
        const answerResponse = await fetch(`/api/posts/${postId}/answer`, {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        })
        
        if (answerResponse.ok) {
          const answerData = await answerResponse.json()
          if (answerData.hasAnswer) {
            setAdminAnswer(answerData.answer)
            setAnswerContent(answerData.answer.content)
          }
        }
      }
    } catch (error) {
      console.error('데이터 로딩 실패:', error)
      alert('데이터를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (postId && config) {
      loadPostData()
    }
  }, [postId, config])

  // 답변 저장
  const handleSaveAnswer = async () => {
    if (!answerContent.trim()) {
      alert('답변 내용을 입력해주세요.')
      return
    }

    setSavingAnswer(true)
    try {
      const adminToken = localStorage.getItem('adminToken')
      const response = await fetch(`/api/posts/${postId}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          content: answerContent
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        alert(data.message)
        setAdminAnswer(data.answer)
        setShowAnswerForm(false)
      } else {
        alert(data.message || '답변 저장에 실패했습니다.')
      }
    } catch (error) {
      console.error('답변 저장 실패:', error)
      alert('답변 저장 중 오류가 발생했습니다.')
    } finally {
      setSavingAnswer(false)
    }
  }

  // 답변 삭제
  const handleDeleteAnswer = async () => {
    if (!confirm('답변을 삭제하시겠습니까?')) return

    try {
      const adminToken = localStorage.getItem('adminToken')
      const response = await fetch(`/api/posts/${postId}/answer`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })

      const data = await response.json()
      
      if (response.ok) {
        alert(data.message)
        setAdminAnswer(null)
        setAnswerContent('')
      } else {
        alert(data.message || '답변 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('답변 삭제 실패:', error)
      alert('답변 삭제 중 오류가 발생했습니다.')
    }
  }

  // 댓글 삭제
  const handleDeleteComment = async (commentId: string, authorName: string) => {
    if (!confirm(`'${authorName}'님의 댓글을 삭제하시겠습니까?`)) return

    try {
      const adminToken = localStorage.getItem('adminToken')
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })

      const data = await response.json()
      
      if (response.ok) {
        alert(data.message)
        // 댓글 목록 새로고침
        loadPostData()
      } else {
        alert(data.message || '댓글 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('댓글 삭제 실패:', error)
      alert('댓글 삭제 중 오류가 발생했습니다.')
    }
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR')
  }

  if (!config.title) {
    return (
      <div className="admin-container">
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          존재하지 않는 게시판입니다.
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="admin-container">
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          게시글을 불러오는 중입니다...
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="admin-container">
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          게시글을 찾을 수 없습니다.
        </div>
      </div>
    )
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>
          <span className="board-icon">{config.icon}</span>
          {config.title} 상세
        </h1>
        <div className="admin-actions">
          <button 
            onClick={() => router.push(`/admin/posts/${boardKey}`)}
            className="btn-secondary"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>

      {/* 게시글 정보 */}
      <div className="post-detail-section">
        <h2>게시글 정보</h2>
        <div className="post-detail">
          <div className="detail-row">
            <label>제목:</label>
            <span>{post.title}</span>
          </div>
          {post.authorName && (
            <div className="detail-row">
              <label>작성자:</label>
              <span>{post.authorName}</span>
            </div>
          )}
          <div className="detail-row">
            <label>작성일:</label>
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <div className="detail-row">
            <label>조회수:</label>
            <span>{post.viewCount}</span>
          </div>
          <div className="detail-row">
            <label>내용:</label>
            <div className="content-area">
              <div dangerouslySetInnerHTML={{ __html: post.content || '내용이 없습니다.' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 관리자 답변 섹션 (실시간 문의만) */}
      {config.hasAnswer && (
        <div className="admin-answer-section">
          <div className="section-header">
            <h2>관리자 답변</h2>
            <div className="section-actions">
              {adminAnswer ? (
                <>
                  <button 
                    onClick={() => setShowAnswerForm(!showAnswerForm)}
                    className="btn-primary"
                  >
                    {showAnswerForm ? '취소' : '답변 수정'}
                  </button>
                  <button 
                    onClick={handleDeleteAnswer}
                    className="btn-danger"
                  >
                    답변 삭제
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setShowAnswerForm(!showAnswerForm)}
                  className="btn-primary"
                >
                  {showAnswerForm ? '취소' : '답변 작성'}
                </button>
              )}
            </div>
          </div>

          {adminAnswer && !showAnswerForm && (
            <div className="answer-display">
              <div className="answer-meta">
                <span>작성일: {formatDate(adminAnswer.createdAt)}</span>
                {adminAnswer.updatedAt !== adminAnswer.createdAt && (
                  <span>수정일: {formatDate(adminAnswer.updatedAt)}</span>
                )}
              </div>
              <div className="answer-content">
                <div dangerouslySetInnerHTML={{ __html: adminAnswer.content }} />
              </div>
            </div>
          )}

          {showAnswerForm && (
            <div className="answer-form">
              <div className="form-group">
                <label>답변 내용:</label>
                <HtmlEditor
                  value={answerContent}
                  onChange={setAnswerContent}
                  placeholder="답변 내용을 입력하세요..."
                  height={300}
                />
              </div>
              <div className="form-actions">
                <button 
                  onClick={handleSaveAnswer}
                  disabled={savingAnswer}
                  className="btn-primary"
                >
                  {savingAnswer ? '저장 중...' : (adminAnswer ? '답변 수정' : '답변 등록')}
                </button>
                <button 
                  onClick={() => setShowAnswerForm(false)}
                  className="btn-secondary"
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 댓글 관리 섹션 */}
      <div className="comments-section">
        <h2>댓글 관리 ({comments.length}개)</h2>
        
        {comments.length === 0 ? (
          <div className="no-comments">
            등록된 댓글이 없습니다.
          </div>
        ) : (
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <div className="comment-author">
                    <strong>{comment.authorName}</strong>
                    {comment.isAdmin && <span className="admin-badge">관리자</span>}
                    {comment.isSecret && <span className="secret-badge">비밀</span>}
                  </div>
                  <div className="comment-meta">
                    <span>{formatDate(comment.createdAt)}</span>
                    {!comment.isAdmin && (
                      <button 
                        onClick={() => handleDeleteComment(comment.id, comment.authorName)}
                        className="btn-delete-small"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>
                <div className="comment-content">
                  <div dangerouslySetInnerHTML={{ __html: comment.content }} />
                </div>
                
                {/* 대댓글 */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="replies">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="reply-item">
                        <div className="comment-header">
                          <div className="comment-author">
                            <strong>{reply.authorName}</strong>
                            {reply.isAdmin && <span className="admin-badge">관리자</span>}
                            {reply.isSecret && <span className="secret-badge">비밀</span>}
                          </div>
                          <div className="comment-meta">
                            <span>{formatDate(reply.createdAt)}</span>
                            {!reply.isAdmin && (
                              <button 
                                onClick={() => handleDeleteComment(reply.id, reply.authorName)}
                                className="btn-delete-small"
                              >
                                삭제
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="comment-content">
                          <div dangerouslySetInnerHTML={{ __html: reply.content }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }

        .admin-header h1 {
          color: #333;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .board-icon {
          font-size: 1.2em;
        }

        .admin-actions {
          display: flex;
          gap: 10px;
        }

        .post-detail-section,
        .admin-answer-section,
        .comments-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .post-detail-section h2,
        .admin-answer-section h2,
        .comments-section h2 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-header h2 {
          margin: 0;
        }

        .section-actions {
          display: flex;
          gap: 10px;
        }

        .post-detail {
          background: #fff;
          padding: 20px;
          border-radius: 4px;
        }

        .detail-row {
          display: flex;
          margin-bottom: 15px;
          align-items: flex-start;
        }

        .detail-row label {
          width: 100px;
          font-weight: bold;
          color: #555;
          flex-shrink: 0;
        }

        .detail-row span {
          flex: 1;
        }

        .content-area {
          flex: 1;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 4px;
          min-height: 100px;
        }

        .answer-display {
          background: #fff;
          padding: 20px;
          border-radius: 4px;
          border-left: 4px solid #007bff;
        }

        .answer-meta {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
          font-size: 14px;
          color: #666;
        }

        .answer-content {
          line-height: 1.6;
        }

        .answer-form {
          background: #fff;
          padding: 20px;
          border-radius: 4px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #333;
        }

        .form-actions {
          display: flex;
          gap: 10px;
        }

        .no-comments {
          text-align: center;
          padding: 40px 0;
          color: #666;
          background: #fff;
          border-radius: 4px;
        }

        .comments-list {
          background: #fff;
          border-radius: 4px;
          overflow: hidden;
        }

        .comment-item {
          padding: 20px;
          border-bottom: 1px solid #eee;
        }

        .comment-item:last-child {
          border-bottom: none;
        }

        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .comment-author {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .admin-badge {
          background: #007bff;
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
          font-weight: bold;
        }

        .secret-badge {
          background: #6c757d;
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
          font-weight: bold;
        }

        .comment-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #666;
        }

        .comment-content {
          line-height: 1.6;
          color: #333;
        }

        .replies {
          margin-top: 15px;
          padding-left: 20px;
          border-left: 2px solid #e9ecef;
        }

        .reply-item {
          padding: 15px 0;
          border-bottom: 1px solid #f1f3f4;
        }

        .reply-item:last-child {
          border-bottom: none;
        }

        /* Button Styles */
        .btn-primary, .btn-secondary, .btn-danger, .btn-delete-small {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0056b3;
        }

        .btn-primary:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background: #5a6268;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .btn-danger:hover {
          background: #c82333;
        }

        .btn-delete-small {
          background: #dc3545;
          color: white;
          padding: 4px 8px;
          font-size: 12px;
        }

        .btn-delete-small:hover {
          background: #c82333;
        }
      `}</style>
    </div>
  )
}
