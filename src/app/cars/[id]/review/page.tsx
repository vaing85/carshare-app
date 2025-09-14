'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Star, ArrowLeft, Send } from 'lucide-react'
import { useNotifications } from '@/contexts/NotificationContext'
import Link from 'next/link'

interface CarData {
  id: string
  make: string
  model: string
  year: number
  image: string
  host: {
    name: string
    avatar: string
  }
}

export default function ReviewPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { addNotification } = useNotifications()
  const [car, setCar] = useState<CarData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Review form state
  const [carRating, setCarRating] = useState(0)
  const [hostRating, setHostRating] = useState(0)
  const [carReview, setCarReview] = useState('')
  const [hostReview, setHostReview] = useState('')
  const [overallExperience, setOverallExperience] = useState('')

  useEffect(() => {
    if (!session) {
      router.push('/auth/login')
      return
    }

    // Simulate loading car data
    setTimeout(() => {
      setCar({
        id: params.id as string,
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        image: '/api/placeholder/400/300',
        host: {
          name: 'John Smith',
          avatar: '/api/placeholder/40/40',
        },
      })
      setLoading(false)
    }, 1000)
  }, [params.id, session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Add notification
    addNotification({
      type: 'review',
      title: 'Review Submitted',
      message: 'Thank you for your review! It helps other users make better decisions.',
      userId: session?.user?.id || '',
    })

    setSubmitting(false)
    router.push('/dashboard/bookings')
  }

  const StarRating = ({ 
    rating, 
    setRating, 
    label 
  }: { 
    rating: number
    setRating: (rating: number) => void
    label: string 
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none"
          >
            <Star
              className={`h-8 w-8 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
            <span className="text-gray-400">|</span>
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Write a Review</h1>
          <p className="text-gray-600 mt-2">
            Share your experience with the {car?.year} {car?.make} {car?.model}
          </p>
        </div>

        {/* Car Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={car?.image}
              alt={`${car?.make} ${car?.model}`}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {car?.year} {car?.make} {car?.model}
              </h3>
              <p className="text-gray-600">Hosted by {car?.host.name}</p>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Rate Your Experience</h2>
            
            {/* Car Rating */}
            <div className="mb-6">
              <StarRating
                rating={carRating}
                setRating={setCarRating}
                label="How was the car?"
              />
              <textarea
                value={carReview}
                onChange={(e) => setCarReview(e.target.value)}
                placeholder="Tell us about the car's condition, cleanliness, and performance..."
                className="mt-3 w-full p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Host Rating */}
            <div className="mb-6">
              <StarRating
                rating={hostRating}
                setRating={setHostRating}
                label="How was the host?"
              />
              <textarea
                value={hostReview}
                onChange={(e) => setHostReview(e.target.value)}
                placeholder="Tell us about your interaction with the host..."
                className="mt-3 w-full p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Overall Experience */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Experience
              </label>
              <textarea
                value={overallExperience}
                onChange={(e) => setOverallExperience(e.target.value)}
                placeholder="Share any additional thoughts about your rental experience..."
                className="w-full p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || carRating === 0 || hostRating === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-md font-medium flex items-center space-x-2 transition-colors"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
