'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Heart, 
  MapPin, 
  Star, 
  Calendar,
  Trash2,
  ExternalLink
} from 'lucide-react'

interface WishlistItem {
  id: string
  make: string
  model: string
  year: number
  price: number
  location: string
  image: string
  rating: number
  reviews: number
  features: string[]
  isAvailable: boolean
  host: {
    name: string
    avatar: string
    rating: number
  }
  addedDate: string
}

const mockWishlist: WishlistItem[] = [
  {
    id: '1',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    price: 89,
    location: 'Downtown Seattle',
    image: '/api/placeholder/400/300?text=Tesla+Model+3',
    rating: 4.8,
    reviews: 124,
    features: ['Electric', 'Autopilot', 'Premium Sound'],
    isAvailable: true,
    host: {
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40?text=SJ',
      rating: 4.9
    },
    addedDate: '2024-01-15'
  },
  {
    id: '2',
    make: 'BMW',
    model: 'X3',
    year: 2022,
    price: 110,
    location: 'Kirkland',
    image: '/api/placeholder/400/300?text=BMW+X3',
    rating: 4.6,
    reviews: 67,
    features: ['Luxury', 'AWD', 'Premium Audio'],
    isAvailable: true,
    host: {
      name: 'David Wilson',
      avatar: '/api/placeholder/40/40?text=DW',
      rating: 4.6
    },
    addedDate: '2024-01-10'
  },
  {
    id: '3',
    make: 'Ford',
    model: 'Mustang',
    year: 2021,
    price: 95,
    location: 'Tacoma',
    image: '/api/placeholder/400/300?text=Ford+Mustang',
    rating: 4.5,
    reviews: 45,
    features: ['Convertible', 'V8 Engine', 'Sport Mode'],
    isAvailable: false,
    host: {
      name: 'Alex Rodriguez',
      avatar: '/api/placeholder/40/40?text=AR',
      rating: 4.5
    },
    addedDate: '2024-01-05'
  }
]

export default function WishlistPage() {
  const { data: session } = useSession()
  const [wishlist, setWishlist] = useState<WishlistItem[]>(mockWishlist)
  const [sortBy, setSortBy] = useState('addedDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const removeFromWishlist = (carId: string) => {
    setWishlist(prev => prev.filter(item => item.id !== carId))
  }

  const sortedWishlist = [...wishlist].sort((a, b) => {
    let aValue: any, bValue: any
    
    switch (sortBy) {
      case 'price':
        aValue = a.price
        bValue = b.price
        break
      case 'rating':
        aValue = a.rating
        bValue = b.rating
        break
      case 'year':
        aValue = a.year
        bValue = b.year
        break
      case 'addedDate':
        aValue = new Date(a.addedDate).getTime()
        bValue = new Date(b.addedDate).getTime()
        break
      default:
        aValue = new Date(a.addedDate).getTime()
        bValue = new Date(b.addedDate).getTime()
    }

    if (sortOrder === 'asc') {
      return aValue - bValue
    } else {
      return bValue - aValue
    }
  })

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your wishlist</h1>
          <Link
            href="/auth/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="addedDate">Date Added</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
                <option value="year">Year</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {wishlist.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Heart className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-4">
              Start adding cars you love to your wishlist
            </p>
            <Link
              href="/cars"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Cars
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                {wishlist.length} car{wishlist.length !== 1 ? 's' : ''} in your wishlist
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedWishlist.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <Image
                      src={item.image}
                      alt={`${item.make} ${item.model}`}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">Unavailable</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.year} {item.make} {item.model}
                        </h3>
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          {item.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          ${item.price}
                          <span className="text-sm font-normal text-gray-600">/day</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(item.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {item.rating} ({item.reviews} reviews)
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.features.slice(0, 3).map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                      {item.features.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          +{item.features.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Image
                          src={item.host.avatar}
                          alt={item.host.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <div className="ml-2">
                          <p className="text-sm font-medium text-gray-900">{item.host.name}</p>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="ml-1 text-xs text-gray-600">{item.host.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/cars/${item.id}`}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View
                        </Link>
                        {item.isAvailable && (
                          <Link
                            href={`/cars/${item.id}/book`}
                            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            Book Now
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
