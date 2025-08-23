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

  const handleEditorChange = (content: string) => {
    onChange(content)
  }

  return (
    <div className="html-editor-wrapper">
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
          link_default_target: '_blank'
        }}
      />
    </div>
  )
} 