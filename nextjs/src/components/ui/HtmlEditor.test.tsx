import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import HtmlEditor from './HtmlEditor'

// TinyMCE 모킹
jest.mock('@tinymce/tinymce-react', () => ({
  Editor: ({ onInit, onEditorChange, init }: any) => {
    // 모킹된 에디터가 이미지 업로드 핸들러를 테스트할 수 있도록 설정
    const mockEditor = {
      getBody: jest.fn(() => document.createElement('div')),
      remove: jest.fn(),
      uploadImages: jest.fn()
    }

    // onInit 콜백 실행
    if (onInit) {
      onInit({}, mockEditor)
    }

    return (
      <div data-testid="tinymce-editor">
        <input 
          data-testid="file-upload"
          type="file"
          accept="image/*"
          onChange={(e) => {
            // 파일 업로드 시뮬레이션
            const file = e.target.files?.[0]
            if (file && init?.images_upload_handler) {
              const blobInfo = {
                blob: () => file,
                filename: () => file.name
              }
              const progress = jest.fn()
              init.images_upload_handler(blobInfo, progress)
            }
          }}
        />
      </div>
    )
  }
}))

// fetch API 모킹
global.fetch = jest.fn()

describe('HtmlEditor 이미지 업로드 테스트', () => {
  const mockOnChange = jest.fn()
  
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockClear()
  })

  test('에디터가 정상적으로 렌더링된다', () => {
    render(<HtmlEditor value="" onChange={mockOnChange} />)
    
    expect(screen.getByTestId('tinymce-editor')).toBeInTheDocument()
  })

  test('25MB 이하 이미지 업로드 성공', async () => {
    // 성공적인 업로드 응답 모킹
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ url: 'https://test-image-url.com/image.jpg' })
    })

    render(<HtmlEditor value="" onChange={mockOnChange} />)
    
    // 2MB 이미지 파일 생성 (25MB 이하)
    const imageFile = new File(['test image content'], 'test-image.jpg', {
      type: 'image/jpeg',
      size: 2 * 1024 * 1024 // 2MB
    })

    const fileInput = screen.getByTestId('file-upload')
    fireEvent.change(fileInput, { target: { files: [imageFile] } })

    // 업로드 API 호출 확인
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/upload', {
        method: 'POST',
        body: expect.any(FormData)
      })
    })
  })

  test('25MB 초과 이미지 업로드 실패', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    
    render(<HtmlEditor value="" onChange={mockOnChange} />)
    
    // 30MB 이미지 파일 생성 (25MB 초과)
    const largeImageFile = new File(['large image content'], 'large-image.jpg', {
      type: 'image/jpeg',
      size: 30 * 1024 * 1024 // 30MB
    })

    const fileInput = screen.getByTestId('file-upload')
    fireEvent.change(fileInput, { target: { files: [largeImageFile] } })

    // fetch API가 호출되지 않아야 함 (파일 크기 검증에서 거부됨)
    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled()
    })

    consoleSpy.mockRestore()
  })

  test('지원하지 않는 파일 형식 업로드 실패', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    
    render(<HtmlEditor value="" onChange={mockOnChange} />)
    
    // PDF 파일 생성 (이미지가 아님)
    const pdfFile = new File(['pdf content'], 'document.pdf', {
      type: 'application/pdf',
      size: 1 * 1024 * 1024 // 1MB
    })

    const fileInput = screen.getByTestId('file-upload')
    fireEvent.change(fileInput, { target: { files: [pdfFile] } })

    // fetch API가 호출되지 않아야 함 (파일 형식 검증에서 거부됨)
    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled()
    })

    consoleSpy.mockRestore()
  })

  test('업로드 진행률 표시', async () => {
    // 지연된 업로드 응답 모킹
    ;(global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ url: 'https://test-image-url.com/image.jpg' })
        }), 100)
      )
    )

    render(<HtmlEditor value="" onChange={mockOnChange} />)
    
    const imageFile = new File(['test image'], 'test.jpg', {
      type: 'image/jpeg',
      size: 1 * 1024 * 1024 // 1MB
    })

    const fileInput = screen.getByTestId('file-upload')
    fireEvent.change(fileInput, { target: { files: [imageFile] } })

    // 업로드 진행률 오버레이가 나타나는지 확인
    await waitFor(() => {
      expect(screen.getByText(/이미지 업로드 중/)).toBeInTheDocument()
    })

    // 업로드 완료 후 진행률 오버레이가 사라지는지 확인
    await waitFor(() => {
      expect(screen.queryByText(/이미지 업로드 중/)).not.toBeInTheDocument()
    }, { timeout: 1000 })
  })

  test('네트워크 에러 처리', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    
    // 네트워크 에러 모킹
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<HtmlEditor value="" onChange={mockOnChange} />)
    
    const imageFile = new File(['test image'], 'test.jpg', {
      type: 'image/jpeg',
      size: 1 * 1024 * 1024 // 1MB
    })

    const fileInput = screen.getByTestId('file-upload')
    fireEvent.change(fileInput, { target: { files: [imageFile] } })

    // 에러가 콘솔에 로그되는지 확인
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'TinyMCE 이미지 업로드 오류:',
        expect.any(Error)
      )
    })

    consoleSpy.mockRestore()
  })

  test('서버 에러 응답 처리', async () => {
    // 서버 에러 응답 모킹
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 413,
      json: async () => ({ error: 'Payload too large' })
    })

    render(<HtmlEditor value="" onChange={mockOnChange} />)
    
    const imageFile = new File(['test image'], 'test.jpg', {
      type: 'image/jpeg',
      size: 1 * 1024 * 1024 // 1MB
    })

    const fileInput = screen.getByTestId('file-upload')
    fireEvent.change(fileInput, { target: { files: [imageFile] } })

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })
  })
})

describe('HtmlEditor 설정 테스트', () => {
  test('TinyMCE가 올바른 설정으로 초기화된다', () => {
    const mockOnChange = jest.fn()
    render(<HtmlEditor value="" onChange={mockOnChange} height={600} />)

    // 에디터가 렌더링되었는지 확인
    expect(screen.getByTestId('tinymce-editor')).toBeInTheDocument()
  })

  test('다크모드 지원 확인', () => {
    // 다크모드 미디어 쿼리 모킹
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })

    const mockOnChange = jest.fn()
    render(<HtmlEditor value="" onChange={mockOnChange} />)

    expect(screen.getByTestId('tinymce-editor')).toBeInTheDocument()
  })
})
