'use client'

import React, { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// TinyMCE Editor를 동적으로 로드 (클라이언트 사이드에서만)
const Editor = dynamic(
  () => import('@tinymce/tinymce-react').then((mod) => mod.Editor),
  { 
    ssr: false,
    loading: () => <div className="editor-loading">에디터 로딩 중...</div>
  }
)

interface HtmlEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: number
}

export default function HtmlEditor({ 
  value, 
  onChange, 
  placeholder = '내용을 입력하세요...',
  height = 400 
}: HtmlEditorProps) {
  const editorRef = useRef<{ getBody: () => HTMLElement; remove: () => void } | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    // 클라이언트 사이드에서만 다크모드 감지
    if (typeof window !== 'undefined') {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      setIsDarkMode(darkModeMediaQuery.matches)
      
      // 다크모드 변경 감지
      const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches)
      darkModeMediaQuery.addEventListener('change', handler)
      
      // ✅ 올바른 cleanup 함수 반환
      return () => darkModeMediaQuery.removeEventListener('change', handler)
    }
  }, [])

  // TinyMCE 인스턴스 강화된 안전 정리
  useEffect(() => {
    return () => {
      if (editorRef.current) {
        try {
          // TinyMCE 에디터가 활성 상태인지 확인
          if (editorRef.current.getBody && editorRef.current.getBody()) {
            editorRef.current.remove?.()
          }
        } catch (error) {
          // TinyMCE 인스턴스 정리 중 오류 무시 (이미 정리된 경우)
          console.debug('TinyMCE cleanup:', error)
        } finally {
          editorRef.current = null
        }
      }
    }
  }, [])

  // TinyMCE 이미지 업로드 핸들러 (25MB 제한)
  const handleImageUpload = async (blobInfo: any, progress: (percent: number) => void) => {
    return new Promise<string>(async (resolve, reject) => {
      try {
        setIsUploading(true)
        setUploadProgress(0)
        
        const file = blobInfo.blob() as File
        
        // 파일 크기 검증 (25MB = 26214400 bytes)
        const maxSize = 25 * 1024 * 1024 // 25MB
        if (file.size > maxSize) {
          setIsUploading(false)
          reject(`이미지 크기가 너무 큽니다. 최대 25MB까지 업로드 가능합니다. (현재: ${Math.round(file.size / 1024 / 1024)}MB)`)
          return
        }

        // 이미지 파일 형식 검증
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
          setIsUploading(false)
          reject(`지원하지 않는 파일 형식입니다. (JPG, PNG, GIF, WebP만 가능)`)
          return
        }

        // 업로드 진행률 시뮬레이션 (실제 진행률은 브라우저 제한으로 정확히 측정하기 어려움)
        const simulateProgress = () => {
          setUploadProgress(20)
          setTimeout(() => setUploadProgress(50), 100)
          setTimeout(() => setUploadProgress(80), 200)
        }
        simulateProgress()

        // FormData 생성
        const formData = new FormData()
        formData.append('file', file)
        formData.append('bucket', 'editor-images')

        // 업로드 API 호출
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const errorData = await response.json()
          setIsUploading(false)
          setUploadProgress(0)
          reject(errorData.error || '이미지 업로드에 실패했습니다.')
          return
        }

        const data = await response.json()
        
        // 업로드 완료
        setUploadProgress(100)
        setTimeout(() => {
          setIsUploading(false)
          setUploadProgress(0)
        }, 500)
        
        // TinyMCE 진행률 콜백 업데이트
        progress(100)
        
        // 성공 시 이미지 URL 반환
        resolve(data.url)
        
      } catch (error) {
        console.error('TinyMCE 이미지 업로드 오류:', error)
        setIsUploading(false)
        setUploadProgress(0)
        reject('이미지 업로드 중 오류가 발생했습니다.')
      }
    })
  }

  const handleEditorChange = (content: string) => {
    onChange(content)
  }

  return (
    <div className="html-editor-wrapper">
      {isUploading && (
        <div className="upload-progress-overlay">
          <div className="upload-progress-content">
            <div className="upload-spinner"></div>
            <div className="upload-text">
              이미지 업로드 중... ({uploadProgress}%)
            </div>
            <div className="upload-progress-bar">
              <div 
                className="upload-progress-fill" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
      
      <Editor
        apiKey="mn07nxpjfjkre7a774hy03aslh41n1aigsw8tlir8c5kjrym" // 무료 버전 사용
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={handleEditorChange}
        init={{
          height: height,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons'
          ],
          toolbar: 'undo redo | formatselect | ' +
            'bold italic underline strikethrough | forecolor backcolor | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | blockquote | ' +
            'link image media | table | emoticons | ' +
            'removeformat | code fullscreen | help',
          toolbar_mode: 'sliding',
          
          // 이미지 업로드 설정 (25MB 제한)
          images_upload_handler: handleImageUpload,
          images_upload_base_path: '',
          images_upload_credentials: false,
          images_file_types: 'jpg,jpeg,png,gif,webp',
          automatic_uploads: true,
          images_reuse_filename: false,
          
          // 파일 드래그&드롭 및 붙여넣기 설정
          paste_as_text: false,
          paste_webkit_styles: 'none',
          paste_merge_formats: true,
          smart_paste: true,
          
          // 이미지 관련 추가 설정
          image_advtab: true,
          image_title: true,
          image_description: false,
          image_dimensions: true,
          image_class_list: [
            {title: '기본', value: ''},
            {title: '반응형 이미지', value: 'img-responsive'},
            {title: '중앙 정렬', value: 'img-center'},
            {title: '좌측 정렬', value: 'img-left'}, 
            {title: '우측 정렬', value: 'img-right'}
          ],
          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
              font-size: 14px;
              line-height: 1.6;
              color: ${isDarkMode ? '#e0e0e0' : '#333'};
              background-color: ${isDarkMode ? '#2d2d2d' : '#fff'};
              padding: 10px;
            }
            p { margin: 0 0 10px 0; }
            h1, h2, h3, h4, h5, h6 { margin: 20px 0 10px 0; }
            
            /* 이미지 스타일링 */
            img { 
              max-width: 100%; 
              height: auto; 
              border-radius: 4px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              margin: 10px 0;
            }
            .img-responsive { max-width: 100%; height: auto; }
            .img-center { display: block; margin-left: auto; margin-right: auto; }
            .img-left { float: left; margin: 0 15px 10px 0; }
            .img-right { float: right; margin: 0 0 10px 15px; }
            
            /* 업로드 중 표시 */
            .mce-upload-placeholder {
              background: ${isDarkMode ? '#444' : '#f8f9fa'};
              border: 2px dashed ${isDarkMode ? '#666' : '#dee2e6'};
              border-radius: 4px;
              padding: 20px;
              text-align: center;
              color: ${isDarkMode ? '#aaa' : '#6c757d'};
              margin: 10px 0;
            }
          `,
          placeholder: placeholder,
          branding: false,
          promotion: false,
          statusbar: true,
          resize: true,
          skin: isDarkMode ? 'oxide-dark' : 'oxide',
          entity_encoding: 'raw',
          extended_valid_elements: 'script[src|type],iframe[src|width|height|frameborder|allowfullscreen],div[class|id|style]',
          verify_html: false,
          paste_data_images: true,
          object_resizing: true,
          link_default_target: '_blank',
          
        }}
      />
      
      <style jsx>{`
        .html-editor-wrapper {
          position: relative;
        }
        
        .upload-progress-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          border-radius: 4px;
          backdrop-filter: blur(2px);
        }
        
        .upload-progress-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          text-align: center;
          min-width: 200px;
        }
        
        .upload-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 10px auto;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .upload-text {
          color: #333;
          font-size: 14px;
          margin-bottom: 10px;
          font-weight: 500;
        }
        
        .upload-progress-bar {
          width: 100%;
          height: 6px;
          background: #e9ecef;
          border-radius: 3px;
          overflow: hidden;
        }
        
        .upload-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #007bff, #0056b3);
          border-radius: 3px;
          transition: width 0.3s ease;
          animation: progressShine 2s infinite;
        }
        
        @keyframes progressShine {
          0% { transform: translateX(-100%); opacity: 0.6; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0.6; }
        }
        
        @media (prefers-color-scheme: dark) {
          .upload-progress-overlay {
            background: rgba(45, 45, 45, 0.95);
          }
          
          .upload-progress-content {
            background: #2d2d2d;
            color: #e0e0e0;
          }
          
          .upload-text {
            color: #e0e0e0;
          }
          
          .upload-progress-bar {
            background: #444;
          }
        }
      `}</style>
    </div>
  )
} 