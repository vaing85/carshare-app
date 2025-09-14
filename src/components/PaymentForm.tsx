'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Globe, 
  CheckCircle, 
  XCircle,
  Loader2,
  AlertCircle
} from 'lucide-react'

interface PaymentMethod {
  id: string
  type: string
  name: string
  image: string
  category: string
  supported_currencies: string[]
  is_online: boolean
}

interface PaymentFormProps {
  bookingData: {
    carId: string
    startDate: string
    endDate: string
    totalAmount: number
    currency?: string
  }
  onPaymentSuccess: (paymentId: string) => void
  onPaymentError: (error: string) => void
}

export default function PaymentForm({ bookingData, onPaymentSuccess, onPaymentError }: PaymentFormProps) {
  const { data: session } = useSession()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  const fetchPaymentMethods = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/payments/methods?country=US')
      const data = await response.json()
      
      if (data.success) {
        setPaymentMethods(data.data)
        // Select first available method by default
        if (data.data.length > 0) {
          setSelectedMethod(data.data[0].id)
        }
      } else {
        setError('Failed to load payment methods')
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error)
      setError('Failed to load payment methods')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError('Please select a payment method')
      return
    }

    try {
      setIsProcessing(true)
      setError('')

      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingData,
          paymentMethod: selectedMethod,
          notes
        }),
      })

      const data = await response.json()

      if (data.success) {
        if (data.data.redirectUrl) {
          // Redirect to Rapyd checkout page
          window.location.href = data.data.redirectUrl
        } else {
          // Payment completed immediately
          onPaymentSuccess(data.data.paymentId)
        }
      } else {
        onPaymentError(data.error || 'Payment failed')
      }
    } catch (error) {
      console.error('Payment error:', error)
      onPaymentError('Payment processing failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const getMethodIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'card':
        return <CreditCard className="h-5 w-5" />
      case 'bank_transfer':
        return <Banknote className="h-5 w-5" />
      case 'ewallet':
        return <Smartphone className="h-5 w-5" />
      default:
        return <Globe className="h-5 w-5" />
    }
  }

  const formatAmount = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading payment methods...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Booking Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Booking Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Rental Period:</span>
            <span className="text-gray-900">
              {new Date(bookingData.startDate).toLocaleDateString()} - {new Date(bookingData.endDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Amount:</span>
            <span className="text-lg font-semibold text-gray-900">
              {formatAmount(bookingData.totalAmount, bookingData.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <label
              key={method.id}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="sr-only"
              />
              <div className="flex items-center space-x-3 flex-1">
                <div className="text-blue-600">
                  {getMethodIcon(method.type)}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{method.name}</div>
                  <div className="text-sm text-gray-500 capitalize">{method.category}</div>
                </div>
                <div className="text-sm text-gray-500">
                  {method.supported_currencies.join(', ')}
                </div>
              </div>
              {selectedMethod === method.id && (
                <CheckCircle className="h-5 w-5 text-blue-600" />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any special requests or notes for the host..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          rows={3}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <XCircle className="h-5 w-5 text-red-500" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={!selectedMethod || isProcessing}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            <span>Pay {formatAmount(bookingData.totalAmount, bookingData.currency)}</span>
          </>
        )}
      </button>

      {/* Security Notice */}
      <div className="flex items-start space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
        <div className="text-sm text-green-700">
          <p className="font-medium">Secure Payment</p>
          <p>Your payment is processed securely by Rapyd. We never store your payment information.</p>
        </div>
      </div>
    </div>
  )
}
