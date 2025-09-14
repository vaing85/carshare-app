'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import LazyImage from './LazyImage'

interface CarouselItem {
  id: string
  src: string
  alt: string
  title?: string
  subtitle?: string
}

interface MobileCarouselProps {
  items: CarouselItem[]
  className?: string
  showDots?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
}

export default function MobileCarousel({ 
  items, 
  className = '',
  showDots = true,
  autoPlay = false,
  autoPlayInterval = 5000
}: MobileCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoPlay && items.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length)
      }, autoPlayInterval)
      return () => clearInterval(interval)
    }
  }, [autoPlay, autoPlayInterval, items.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setCurrentX(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    setCurrentX(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    
    const diff = startX - currentX
    const threshold = 50

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToNext()
      } else {
        goToPrevious()
      }
    }
  }

  if (items.length === 0) return null

  return (
    <div className={`relative ${className}`}>
      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="relative overflow-hidden rounded-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {items.map((item, index) => (
            <div key={item.id} className="w-full flex-shrink-0">
              <LazyImage
                src={item.src}
                alt={item.alt}
                width={400}
                height={300}
                className="w-full h-48 md:h-64 object-cover"
              />
              {(item.title || item.subtitle) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  {item.title && (
                    <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                  )}
                  {item.subtitle && (
                    <p className="text-white/80 text-sm">{item.subtitle}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && items.length > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-blue-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
