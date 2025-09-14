'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Car, Calendar, DollarSign, Users, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useNotifications } from '@/contexts/NotificationContext'

interface HostStats {
  totalCars: number
  totalBookings: number
  totalRevenue: number
  averageRating: number
  pendingBookings: number
  activeBookings: number
  completedBookings: number
}

interface RecentBooking {
  id: string
  car: {
    make: string
    model: string
    year: number
  }
  guest: {
    name: string
    email: string
  }
  startDate: string
  endDate: string
  totalPrice: number
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
  createdAt: string
}

export default function HostDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { addNotification } = useNotifications()
  const [stats, setStats] = useState<HostStats>({
    totalCars: 0,
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    pendingBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
  })
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/login')
      return
    }

    if (!session.user?.isHost) {
      router.push('/dashboard')
      return
    }

    // Simulate loading host data
    setTimeout(() => {
      setStats({
        totalCars: 3,
        totalBookings: 24,
        totalRevenue: 2840,
        averageRating: 4.8,
        pendingBookings: 2,
        activeBookings: 5,
        completedBookings: 17,
      })

      setRecentBookings([
        {
          id: '1',
          car: { make: 'Toyota', model: 'Camry', year: 2022 },
          guest: { name: 'John Smith', email: 'john@example.com' },
          startDate: '2024-01-15',
          endDate: '2024-01-18',
          totalPrice: 180,
          status: 'pending',
          createdAt: '2024-01-10T10:30:00Z',
        },
        {
          id: '2',
          car: { make: 'Honda', model: 'Civic', year: 2021 },
          guest: { name: 'Sarah Johnson', email: 'sarah@example.com' },
          startDate: '2024-01-12',
          endDate: '2024-01-14',
          totalPrice: 120,
          status: 'active',
          createdAt: '2024-01-08T14:20:00Z',
        },
        {
          id: '3',
          car: { make: 'Ford', model: 'Mustang', year: 2023 },
          guest: { name: 'Mike Wilson', email: 'mike@example.com' },
          startDate: '2024-01-05',
          endDate: '2024-01-07',
          totalPrice: 240,
          status: 'completed',
          createdAt: '2024-01-02T09:15:00Z',
        },
      ])

      setLoading(false)
    }, 1000)
  }, [session, status, router])

  const handleBookingAction = (bookingId: string, action: 'approve' | 'reject') => {
    // Simulate booking action
    setRecentBookings(prev =>
      prev.map(booking =>
        booking.id === bookingId
          ? { ...booking, status: action === 'approve' ? 'confirmed' : 'cancelled' }
          : booking
      )
    )

    // Add notification
    addNotification({
      type: 'booking',
      title: `Booking ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      message: `You ${action === 'approve' ? 'approved' : 'rejected'} a booking request`,
      userId: session?.user?.id || '',
    })

    // Update stats
    setStats(prev => ({
      ...prev,
      pendingBookings: prev.pendingBookings - 1,
      [action === 'approve' ? 'activeBookings' : 'completedBookings']: 
        prev[action === 'approve' ? 'activeBookings' : 'completedBookings'] + 1,
    }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'active':
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-gray-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'active':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your car listings and bookings</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cars</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCars}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                <p className="text-2xl font-bold text-blue-600">{stats.activeBookings}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedBookings}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Car & Guest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.car.year} {booking.car.make} {booking.car.model}
                        </div>
                        <div className="text-sm text-gray-500">{booking.guest.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${booking.totalPrice}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1 capitalize">{booking.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {booking.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleBookingAction(booking.id, 'approve')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleBookingAction(booking.id, 'reject')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {booking.status === 'confirmed' && (
                        <span className="text-green-600">Approved</span>
                      )}
                      {booking.status === 'cancelled' && (
                        <span className="text-red-600">Rejected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
