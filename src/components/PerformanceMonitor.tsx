'use client'

import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  loadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return

    const measurePerformance = () => {
      if (typeof window === 'undefined' || !('performance' in window)) return

      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const paintEntries = performance.getEntriesByType('paint')
      
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart
      const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
      
      // Get Web Vitals if available
      const getLCP = () => {
        return new Promise<number>((resolve) => {
          if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
              const entries = list.getEntries()
              const lastEntry = entries[entries.length - 1]
              resolve(lastEntry.startTime)
            })
            observer.observe({ entryTypes: ['largest-contentful-paint'] })
            setTimeout(() => resolve(0), 5000) // Fallback timeout
          } else {
            resolve(0)
          }
        })
      }

      const getCLS = () => {
        return new Promise<number>((resolve) => {
          if ('PerformanceObserver' in window) {
            let clsValue = 0
            const observer = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if (!(entry as any).hadRecentInput) {
                  clsValue += (entry as any).value
                }
              }
              resolve(clsValue)
            })
            observer.observe({ entryTypes: ['layout-shift'] })
            setTimeout(() => resolve(clsValue), 5000) // Fallback timeout
          } else {
            resolve(0)
          }
        })
      }

      const getFID = () => {
        return new Promise<number>((resolve) => {
          if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
              const entries = list.getEntries()
              const firstInput = entries[0]
              resolve(firstInput ? (firstInput as any).processingStart - firstInput.startTime : 0)
            })
            observer.observe({ entryTypes: ['first-input'] })
            setTimeout(() => resolve(0), 5000) // Fallback timeout
          } else {
            resolve(0)
          }
        })
      }

      Promise.all([getLCP(), getCLS(), getFID()]).then(([lcp, cls, fid]) => {
        setMetrics({
          loadTime,
          firstContentfulPaint,
          largestContentfulPaint: lcp,
          cumulativeLayoutShift: cls,
          firstInputDelay: fid
        })
        setIsVisible(true)
      })
    }

    // Measure after page load
    if (document.readyState === 'complete') {
      measurePerformance()
    } else {
      window.addEventListener('load', measurePerformance)
    }

    return () => {
      window.removeEventListener('load', measurePerformance)
    }
  }, [])

  if (!isVisible || !metrics) return null

  const getScoreColor = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return 'text-green-600'
    if (value <= thresholds[1]) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreText = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return 'Good'
    if (value <= thresholds[1]) return 'Needs Improvement'
    return 'Poor'
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-xs z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">Performance</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600">Load Time:</span>
          <span className={getScoreColor(metrics.loadTime, [1000, 3000])}>
            {metrics.loadTime.toFixed(0)}ms
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">FCP:</span>
          <span className={getScoreColor(metrics.firstContentfulPaint, [1800, 3000])}>
            {metrics.firstContentfulPaint.toFixed(0)}ms
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">LCP:</span>
          <span className={getScoreColor(metrics.largestContentfulPaint, [2500, 4000])}>
            {metrics.largestContentfulPaint.toFixed(0)}ms
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">CLS:</span>
          <span className={getScoreColor(metrics.cumulativeLayoutShift, [0.1, 0.25])}>
            {metrics.cumulativeLayoutShift.toFixed(3)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">FID:</span>
          <span className={getScoreColor(metrics.firstInputDelay, [100, 300])}>
            {metrics.firstInputDelay.toFixed(0)}ms
          </span>
        </div>
      </div>
    </div>
  )
}
