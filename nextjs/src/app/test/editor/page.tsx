'use client'

import { useState } from 'react'
import HtmlEditor from '@/components/ui/HtmlEditor'

export default function EditorTestPage() {
  const [content, setContent] = useState('<h2>TinyMCE 이미지 업로드 테스트</h2><p>아래 방법들로 이미지 업로드를 테스트해보세요:</p><ul><li><strong>드래그&amp;드롭:</strong> 이미지를 에디터에 드래그하여 놓으세요</li><li><strong>클립보드 붙여넣기:</strong> 이미지를 복사한 후 에디터에서 Ctrl+V</li><li><strong>이미지 버튼:</strong> 툴바의 이미지 버튼 클릭</li><li><strong>파일 크기 테스트:</strong> 25MB 이상 파일로 크기 제한 테스트</li></ul>')
  const [testResults, setTestResults] = useState<string[]>([])

  const addTestResult = (result: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setTestResults(prev => [`${timestamp}: ${result}`, ...prev])
  }

  // 테스트용 파일 생성 함수들
  const createTestFile = (sizeInMB: number, type = 'image/jpeg') => {
    const size = sizeInMB * 1024 * 1024
    const content = new Array(size).fill('a').join('')
    return new File([content], `test-${sizeInMB}mb.jpg`, { type })
  }

  const testSmallImage = () => {
    const file = createTestFile(1) // 1MB
    addTestResult(`✅ 1MB 이미지 테스트 파일 생성 - 업로드 성공 예상`)
    // 실제 업로드는 에디터에서 직접 테스트
  }

  const testLargeImage = () => {
    const file = createTestFile(30) // 30MB
    addTestResult(`❌ 30MB 이미지 테스트 파일 생성 - 업로드 실패 예상 (크기 제한)`)
  }

  const testInvalidType = () => {
    const file = createTestFile(1, 'application/pdf')
    addTestResult(`❌ PDF 파일 테스트 - 업로드 실패 예상 (형식 제한)`)
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <style>{`
        .test-page {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .test-header {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          border-left: 4px solid #007bff;
        }
        .test-controls {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .test-button {
          background: #007bff;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }
        .test-button:hover {
          background: #0056b3;
        }
        .test-button.danger {
          background: #dc3545;
        }
        .test-button.danger:hover {
          background: #c82333;
        }
        .test-button.warning {
          background: #ffc107;
          color: #212529;
        }
        .test-button.warning:hover {
          background: #e0a800;
        }
        .editor-container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }
        .results-container {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          max-height: 300px;
          overflow-y: auto;
        }
        .result-item {
          padding: 8px;
          margin-bottom: 4px;
          background: white;
          border-radius: 4px;
          border-left: 3px solid #007bff;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 12px;
        }
        .test-instructions {
          background: #e7f3ff;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
        }
        .test-specs {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }
        .spec-card {
          background: white;
          padding: 15px;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border-left: 4px solid #28a745;
        }
        .spec-title {
          font-weight: bold;
          color: #495057;
          margin-bottom: 8px;
        }
        .spec-value {
          color: #28a745;
          font-weight: 500;
        }
      `}</style>

      <div className="test-page">
        <div className="test-header">
          <h1>🖼️ HtmlEditor 이미지 업로드 테스트</h1>
          <p>TinyMCE 에디터의 이미지 업로드 기능을 테스트하는 페이지입니다.</p>
        </div>

        <div className="test-specs">
          <div className="spec-card">
            <div className="spec-title">최대 파일 크기</div>
            <div className="spec-value">25MB</div>
          </div>
          <div className="spec-card">
            <div className="spec-title">지원 형식</div>
            <div className="spec-value">JPG, PNG, GIF, WebP</div>
          </div>
          <div className="spec-card">
            <div className="spec-title">업로드 방식</div>
            <div className="spec-value">드래그&드롭, 붙여넣기, 버튼</div>
          </div>
          <div className="spec-card">
            <div className="spec-title">저장 위치</div>
            <div className="spec-value">Supabase (editor-images 버킷)</div>
          </div>
        </div>

        <div className="test-instructions">
          <h3>📋 테스트 방법</h3>
          <ol>
            <li><strong>드래그&드롭 테스트:</strong> 이미지 파일을 아래 에디터 영역에 드래그하여 놓으세요</li>
            <li><strong>클립보드 테스트:</strong> 이미지를 복사한 후 에디터에서 Ctrl+V (또는 Cmd+V)</li>
            <li><strong>버튼 업로드 테스트:</strong> 에디터 툴바의 이미지 버튼을 클릭하여 파일 선택</li>
            <li><strong>크기 제한 테스트:</strong> 25MB 이상의 파일로 제한 테스트</li>
            <li><strong>형식 제한 테스트:</strong> 이미지가 아닌 파일(PDF 등)로 제한 테스트</li>
          </ol>
        </div>

        <div className="test-controls">
          <button className="test-button" onClick={testSmallImage}>
            ✅ 1MB 이미지 테스트
          </button>
          <button className="test-button warning" onClick={testLargeImage}>
            ⚠️ 30MB 크기 제한 테스트
          </button>
          <button className="test-button danger" onClick={testInvalidType}>
            ❌ 형식 제한 테스트
          </button>
          <button className="test-button" onClick={clearResults}>
            🗑️ 결과 지우기
          </button>
        </div>

        <div className="editor-container">
          <HtmlEditor
            value={content}
            onChange={setContent}
            height={500}
            placeholder="여기에 이미지를 드래그하거나 툴바의 이미지 버튼을 사용하세요..."
          />
        </div>

        {testResults.length > 0 && (
          <div className="results-container">
            <h3>🧪 테스트 결과</h3>
            {testResults.map((result, index) => (
              <div key={index} className="result-item">
                {result}
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          <h4>💡 확인 사항</h4>
          <ul>
            <li>업로드 중 진행률 표시가 나타나는지</li>
            <li>25MB 초과 파일에 대한 명확한 에러 메시지</li>
            <li>지원하지 않는 형식에 대한 에러 메시지</li>
            <li>업로드된 이미지가 에디터에 올바르게 삽입되는지</li>
            <li>이미지의 크기 조절 및 정렬 옵션 작동</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
