'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

function PaymentStatusContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('loading')
  const [paymentData, setPaymentData] = useState<any>(null)
  const [error, setError] = useState('')

  const paymentId = searchParams.get('payment_id')
  const statusParam = searchParams.get('status')

  useEffect(() => {
    if (paymentId) {
      checkPaymentStatus()
    } else {
      setStatus('error')
      setError('No payment ID provided')
    }
  }, [paymentId])

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch(`/api/payments/status?paymentId=${paymentId}`)
      const data = await response.json()

      if (data.success) {
        setPaymentData(data.data)
        
        switch (data.data.status) {
          case 'CLO': // Closed/Completed
            setStatus('success')
            break
          case 'CAN': // Cancelled
            setStatus('error')
            setError('Payment was cancelled')
            break
          case 'ERR': // Error
            setStatus('error')
            setError(data.data.failureReason || 'Payment failed')
            break
          default:
            setStatus('pending')
        }
      } else {
        setStatus('error')
        setError(data.error || 'Failed to check payment status')
      }
    } catch (error) {
      console.error('Error checking payment status:', error)
      setStatus('error')
      setError('Failed to check payment status')
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case 'error':
        return <XCircle className="h-16 w-16 text-red-500" />
      case 'pending':
        return <AlertCircle className="h-16 w-16 text-yellow-500" />
      default:
        return <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
    }
  }

  const getStatusTitle = () => {
    switch (status) {
      case 'success':
        return 'Payment Successful!'
      case 'error':
        return 'Payment Failed'
      case 'pending':
        return 'Payment Pending'
      default:
        return 'Checking Payment Status...'
    }
  }

  const getStatusMessage = () => {
    switch (status) {
      case 'success':
        return 'Your payment has been processed successfully. Your booking is confirmed!'
      case 'error':
        return error || 'There was an issue processing your payment. Please try again.'
      case 'pending':
        return 'Your payment is being processed. You will receive a confirmation email once completed.'
      default:
        return 'Please wait while we check your payment status...'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          {getStatusIcon()}
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {getStatusTitle()}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {getStatusMessage()}
        </p>

        {paymentData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Payment Details</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Payment ID:</span>
                <span className="font-mono">{paymentData.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span>${paymentData.amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Currency:</span>
                <span>{paymentData.currency}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="capitalize">{paymentData.status}</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {status === 'success' && (
            <>
              <Link
                href="/dashboard/my-bookings"
                className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View My Bookings
              </Link>
              <Link
                href="/dashboard"
                className="block w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go to Dashboard
              </Link>
            </>
          )}
          
          {status === 'error' && (
            <>
              <button
                onClick={() => window.history.back()}
                className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <Link
                href="/dashboard"
                className="block w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go to Dashboard
              </Link>
            </>
          )}
          
          {status === 'pending' && (
            <>
              <button
                onClick={checkPaymentStatus}
                className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Check Status Again
              </button>
              <Link
                href="/dashboard"
                className="block w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go to Dashboard
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <PaymentStatusContent />
    </Suspense>
  )
}
