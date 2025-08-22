'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface PopupData {
  id: string
  title: string
  imageUrl: string
  linkUrl?: string
  sortOrder: number
}

interface PopupComponentProps {
  popup: PopupData
  onClose: (popupId: string, hideToday?: boolean) => void
}

function PopupComponent({ popup, onClose }: PopupComponentProps) {
  const handleImageClick = () => {
    if (popup.linkUrl) {
      window.open(popup.linkUrl, '_blank')
    }
  }

  const handleTodayClose = () => {
    onClose(popup.id, true)
  }

  const handleClose = () => {
    onClose(popup.id, false)
  }

  return (
    <div className={`popup popup-${popup.sortOrder}`}>
      <a 
        href={popup.linkUrl || '#'} 
        className="hoverable"
        onClick={popup.linkUrl ? undefined : (e) => e.preventDefault()}
      >
        <figure>
          <Image
            src={popup.imageUrl}
            alt={popup.title}
            width={400}
            height={300}
            style={{ width: '100%', height: 'auto' }}
          />
        </figure>
      </a>
      <div className="btn-area">
        <span className="btn-today hoverable" onClick={handleTodayClose}>
          오늘 하루보지 않기
        </span>
        <a href="#" className="pop-close hoverable" onClick={(e) => {
          e.preventDefault()
          handleClose()
        }}>
          닫기
        </a>
      </div>
    </div>
  )
}

export default function MainPopup() {
  const [popups, setPopups] = useState<PopupData[]>([])
  const [visiblePopups, setVisiblePopups] = useState<PopupData[]>([])
  const [loading, setLoading] = useState(true)

  // 쿠키 관련 유틸리티 함수들
  const setCookie = (name: string, value: string, days: number = 1) => {
    const expires = new Date()
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
  }

  const getCookie = (name: string): string | null => {
    const nameEQ = name + "="
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }

  const isPopupHiddenToday = (popupId: string): boolean => {
    const hiddenPopups = getCookie('hiddenPopups')
    if (!hiddenPopups) return false
    
    try {
      const hiddenList = JSON.parse(hiddenPopups)
      const today = new Date().toDateString()
      return hiddenList[popupId] === today
    } catch {
      return false
    }
  }

  // 활성 팝업 목록 조회
  const loadActivePopups = async () => {
    try {
      const response = await fetch('/api/popups/active')
      
      if (!response.ok) {
        throw new Error('팝업 목록 조회에 실패했습니다.')
      }

      const data = await response.json()
      const activePopups = data.popups || []
      
      // 오늘 숨김 처리되지 않은 팝업만 필터링
      const visiblePopups = activePopups.filter((popup: PopupData) => 
        !isPopupHiddenToday(popup.id)
      )

      setPopups(activePopups)
      setVisiblePopups(visiblePopups)
    } catch (error) {
      console.error('팝업 목록 조회 실패:', error)
      setPopups([])
      setVisiblePopups([])
    } finally {
      setLoading(false)
    }
  }

  // 팝업 닫기 처리
  const handlePopupClose = (popupId: string, hideToday: boolean = false) => {
    if (hideToday) {
      // "오늘 하루 보지 않기" 처리
      const hiddenPopups = getCookie('hiddenPopups')
      let hiddenList: Record<string, string> = {}
      
      if (hiddenPopups) {
        try {
          hiddenList = JSON.parse(hiddenPopups)
        } catch {
          hiddenList = {}
        }
      }
      
      const today = new Date().toDateString()
      hiddenList[popupId] = today
      setCookie('hiddenPopups', JSON.stringify(hiddenList), 1)
    }

    // 현재 표시 중인 팝업에서 제거
    setVisiblePopups(prev => prev.filter(popup => popup.id !== popupId))
  }

  useEffect(() => {
    loadActivePopups()
  }, [])

  // 로딩 중이거나 표시할 팝업이 없으면 아무것도 렌더링하지 않음
  if (loading || visiblePopups.length === 0) {
    return null
  }

  return (
    <>
      {visiblePopups.map((popup) => (
        <PopupComponent
          key={popup.id}
          popup={popup}
          onClose={handlePopupClose}
        />
      ))}
    </>
  )
}
