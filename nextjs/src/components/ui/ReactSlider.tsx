'use client'

import { useEffect, useState, useRef } from 'react'

interface SliderProps {
  items: React.ReactNode[]
  className?: string
  slidesToShow?: number
  autoplay?: boolean
  autoplaySpeed?: number
  vertical?: boolean
}

export default function ReactSlider({
  items,
  className = '',
  slidesToShow = 3,
  autoplay = true,
  autoplaySpeed = 4000,
  vertical = false
}: SliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // 자동 재생 로직
  useEffect(() => {
    if (!autoplay || isHovered || items.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = Math.max(0, items.length - slidesToShow)
        return prevIndex >= maxIndex ? 0 : prevIndex + 1
      })
    }, autoplaySpeed)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [autoplay, autoplaySpeed, isHovered, items.length, slidesToShow])

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  if (items.length === 0) {
    return <div className={className}>로딩 중...</div>
  }

  const containerStyle = vertical
    ? {
        display: 'flex',
        flexDirection: 'column' as const,
        height: '100%',
        overflow: 'hidden',
      }
    : {
        display: 'flex',
        overflow: 'hidden',
      }

  const slideStyle = vertical
    ? {
        transform: `translateY(-${(currentIndex * 100) / slidesToShow}%)`,
        transition: 'transform 0.5s ease',
        display: 'flex',
        flexDirection: 'column' as const,
      }
    : {
        transform: `translateX(-${(currentIndex * 100) / slidesToShow}%)`,
        transition: 'transform 0.5s ease',
        display: 'flex',
      }

  return (
    <div
      className={className}
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={slideStyle}>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              flex: vertical ? `0 0 ${100 / slidesToShow}%` : `0 0 ${100 / slidesToShow}%`,
              minWidth: vertical ? 'auto' : `${100 / slidesToShow}%`,
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

