'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, MapPin, Car, User, DollarSign, MessageSquare, CheckCircle, XCircle, AlertCircle, Filter, Search, Star, Eye, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface MyBooking {
  id: string
  carName: string
  carImage: string
  hostName: string
  hostEmail: string
  startDate: string
  endDate: string
  totalAmount: number
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
  createdAt: string
  pickupLocation: string
  returnLocation: string
  myMessage?: string
  hostResponse?: string
  carId: string
}

export default function MyBookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<MyBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    // Mock bookings data for renters
    const mockBookings: MyBooking[] = [
      {
        id: '1',
        carName: 'Toyota Camry',
        carImage: '/api/placeholder/400/300?text=Toyota+Camry',
        hostName: 'John Smith',
        hostEmail: 'john@example.com',
        startDate: '2024-01-20',
        endDate: '2024-01-23',
        totalAmount: 225,
        status: 'confirmed',
        createdAt: '2024-01-15T10:30:00Z',
        pickupLocation: 'Downtown Seattle',
        returnLocation: 'Downtown Seattle',
        myMessage: 'Need the car for a business trip. Will pick up early morning.',
        carId: '1'
      },
      {
        id: '2',
        carName: 'Honda CR-V',
        carImage: '/api/placeholder/400/300?text=Honda+CR-V',
        hostName: 'Sarah Johnson',
        hostEmail: 'sarah@example.com',
        startDate: '2024-01-18',
        endDate: '2024-01-19',
        totalAmount: 150,
        status: 'active',
        createdAt: '2024-01-14T14:20:00Z',
        pickupLocation: 'Bellevue',
        returnLocation: 'Bellevue',
        carId: '2'
      },
      {
        id: '3',
        carName: 'Tesla Model 3',
        carImage: '/api/placeholder/400/300?text=Tesla+Model+3',
        hostName: 'Mike Davis',
        hostEmail: 'mike@example.com',
        startDate: '2024-01-25',
        endDate: '2024-01-28',
        totalAmount: 360,
        status: 'pending',
        createdAt: '2024-01-16T09:15:00Z',
        pickupLocation: 'Redmond',
        returnLocation: 'Redmond',
        myMessage: 'Planning a weekend trip. Is the car available for this period?',
        carId: '3'
      },
      {
        id: '4',
        carName: 'BMW 3 Series',
        carImage: '/api/placeholder/400/300?text=BMW+3+Series',
        hostName: 'Emily Wilson',
        hostEmail: 'emily@example.com',
        startDate: '2024-01-12',
        endDate: '2024-01-14',
        totalAmount: 240,
        status: 'completed',
        createdAt: '2024-01-10T16:45:00Z',
        pickupLocation: 'Downtown Seattle',
        returnLocation: 'Downtown Seattle',
        carId: '4'
      },
      {
        id: '5',
        carName: 'Ford Mustang',
        carImage: '/api/placeholder/400/300?text=Ford+Mustang',
        hostName: 'Alex Thompson',
        hostEmail: 'alex@example.com',
        startDate: '2024-01-30',
        endDate: '2024-02-02',
        totalAmount: 300,
        status: 'cancelled',
        createdAt: '2024-01-17T11:30:00Z',
        pickupLocation: 'Kirkland',
        returnLocation: 'Kirkland',
        carId: '5'
      }
    ]

    setBookings(mockBookings)
    setLoading(false)
  }, [])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />
      case 'active':
        return <Car className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus
    const matchesSearch = 
      booking.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.hostName.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesPeriod = true
    if (selectedPeriod !== 'all') {
      const today = new Date()
      const startDate = new Date(booking.startDate)
      const endDate = new Date(booking.endDate)
      
      switch (selectedPeriod) {
        case 'today':
          matchesPeriod = startDate <= today && endDate >= today
          break
        case 'week':
          const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
          matchesPeriod = startDate <= weekFromNow
          break
        case 'month':
          const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
          matchesPeriod = startDate <= monthFromNow
          break
      }
    }
    
    return matchesStatus && matchesSearch && matchesPeriod
  })

  const totalSpent = bookings
    .filter(booking => booking.status === 'completed' || booking.status === 'active')
    .reduce((sum, booking) => sum + booking.totalAmount, 0)

  const upcomingBookings = bookings.filter(booking => 
    booking.status === 'confirmed' || booking.status === 'active'
  ).length

  const completedBookings = bookings.filter(booking => booking.status === 'completed').length

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' as any }
            : booking
        )
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">View and manage your car rental bookings</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${totalSpent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedBookings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedStatus('all')
                  setSelectedPeriod('all')
                }}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Bookings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={booking.carImage}
                  alt={booking.carName}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    <span className="ml-1">{getStatusText(booking.status)}</span>
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{booking.carName}</h3>
                    <p className="text-sm text-gray-600">Hosted by {booking.hostName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">${booking.totalAmount}</p>
                    <p className="text-sm text-gray-500">Total</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{booking.pickupLocation}</span>
                  </div>
                </div>

                {booking.myMessage && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Your message:</strong> {booking.myMessage}
                    </p>
                  </div>
                )}

                {booking.hostResponse && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Host response:</strong> {booking.hostResponse}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Link
                      href={`/cars/${booking.carId}`}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="View Car"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/dashboard/messages`}
                      className="text-indigo-600 hover:text-indigo-800 p-1"
                      title="Message Host"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Link>
                    {booking.status === 'completed' && (
                      <Link
                        href={`/cars/${booking.carId}/review`}
                        className="text-yellow-600 hover:text-yellow-800 p-1"
                        title="Write Review"
                      >
                        <Star className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                  
                  {(booking.status === 'pending' || booking.status === 'confirmed') && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedStatus !== 'all' || selectedPeriod !== 'all'
                ? 'Try adjusting your search criteria or filters'
                : "You don't have any bookings yet"}
            </p>
            <Link
              href="/cars"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Car className="h-4 w-4 mr-2" />
              Browse Cars
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
