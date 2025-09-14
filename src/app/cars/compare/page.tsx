'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Fuel, 
  Users, 
  Calendar,
  X,
  Plus,
  Check,
  X as XIcon
} from 'lucide-react'

interface Car {
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
  specs: {
    engine: string
    transmission: string
    fuelType: string
    seats: number
    doors: number
    mpg: string
    luggage: string
  }
}

const mockCars: Car[] = [
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
    features: ['Electric', 'Autopilot', 'Premium Sound', 'Supercharger'],
    isAvailable: true,
    host: {
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40?text=SJ',
      rating: 4.9
    },
    specs: {
      engine: 'Electric Motor',
      transmission: 'Single Speed',
      fuelType: 'Electric',
      seats: 5,
      doors: 4,
      mpg: '130 MPGe',
      luggage: '15 cu ft'
    }
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
    features: ['Luxury', 'AWD', 'Premium Audio', 'Sunroof'],
    isAvailable: true,
    host: {
      name: 'David Wilson',
      avatar: '/api/placeholder/40/40?text=DW',
      rating: 4.6
    },
    specs: {
      engine: '2.0L Turbo I4',
      transmission: '8-Speed Automatic',
      fuelType: 'Gasoline',
      seats: 5,
      doors: 4,
      mpg: '25/29 MPG',
      luggage: '28.7 cu ft'
    }
  },
  {
    id: '3',
    make: 'Honda',
    model: 'CR-V',
    year: 2021,
    price: 85,
    location: 'Bellevue',
    image: '/api/placeholder/400/300?text=Honda+CR-V',
    rating: 4.7,
    reviews: 89,
    features: ['AWD', 'Backup Camera', 'Bluetooth', 'USB Ports'],
    isAvailable: true,
    host: {
      name: 'Mike Chen',
      avatar: '/api/placeholder/40/40?text=MC',
      rating: 4.7
    },
    specs: {
      engine: '1.5L Turbo I4',
      transmission: 'CVT',
      fuelType: 'Gasoline',
      seats: 5,
      doors: 4,
      mpg: '28/34 MPG',
      luggage: '39.2 cu ft'
    }
  }
]

export default function ComparePage() {
  const [selectedCars, setSelectedCars] = useState<Car[]>([])
  const [availableCars, setAvailableCars] = useState<Car[]>(mockCars)

  const addToComparison = (car: Car) => {
    if (selectedCars.length < 3 && !selectedCars.find(c => c.id === car.id)) {
      setSelectedCars([...selectedCars, car])
    }
  }

  const removeFromComparison = (carId: string) => {
    setSelectedCars(selectedCars.filter(car => car.id !== carId))
  }

  const clearComparison = () => {
    setSelectedCars([])
  }

  const getFeatureComparison = (feature: string) => {
    return selectedCars.map(car => ({
      car: car,
      hasFeature: car.features.includes(feature)
    }))
  }

  const allFeatures = [...new Set(selectedCars.flatMap(car => car.features))]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/cars" 
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Cars
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Compare Cars</h1>
            </div>
            {selectedCars.length > 0 && (
              <button
                onClick={clearComparison}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedCars.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cars selected for comparison</h3>
            <p className="text-gray-600 mb-6">
              Select up to 3 cars to compare their features and specifications
            </p>
            
            {/* Available Cars to Add */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {availableCars.map((car) => (
                <div key={car.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <Image
                      src={car.image}
                      alt={`${car.make} ${car.model}`}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => addToComparison(car)}
                      className="absolute top-3 right-3 p-2 bg-blue-600 text-white rounded-full shadow-sm hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {car.year} {car.make} {car.model}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {car.location}
                    </div>
                    <div className="text-xl font-bold text-blue-600 mb-3">
                      ${car.price}/day
                    </div>
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(car.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {car.rating} ({car.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Selected Cars Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Comparing {selectedCars.length} car{selectedCars.length !== 1 ? 's' : ''}
              </h2>
              {selectedCars.length < 3 && (
                <Link
                  href="/cars"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Add more cars
                </Link>
              )}
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                        Feature
                      </th>
                      {selectedCars.map((car) => (
                        <th key={car.id} className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center">
                            <Image
                              src={car.image}
                              alt={`${car.make} ${car.model}`}
                              width={80}
                              height={60}
                              className="rounded-lg mb-2"
                            />
                            <div className="text-sm font-medium text-gray-900">
                              {car.year} {car.make} {car.model}
                            </div>
                            <div className="text-lg font-bold text-blue-600">
                              ${car.price}/day
                            </div>
                            <button
                              onClick={() => removeFromComparison(car.id)}
                              className="mt-2 p-1 text-red-500 hover:text-red-700"
                            >
                              <XIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {/* Basic Info */}
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Rating</td>
                      {selectedCars.map((car) => (
                        <td key={car.id} className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-sm text-gray-900">{car.rating}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Reviews</td>
                      {selectedCars.map((car) => (
                        <td key={car.id} className="px-6 py-4 text-center text-sm text-gray-900">
                          {car.reviews}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Location</td>
                      {selectedCars.map((car) => (
                        <td key={car.id} className="px-6 py-4 text-center text-sm text-gray-900">
                          {car.location}
                        </td>
                      ))}
                    </tr>

                    {/* Specifications */}
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Engine</td>
                      {selectedCars.map((car) => (
                        <td key={car.id} className="px-6 py-4 text-center text-sm text-gray-900">
                          {car.specs.engine}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Transmission</td>
                      {selectedCars.map((car) => (
                        <td key={car.id} className="px-6 py-4 text-center text-sm text-gray-900">
                          {car.specs.transmission}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Fuel Type</td>
                      {selectedCars.map((car) => (
                        <td key={car.id} className="px-6 py-4 text-center text-sm text-gray-900">
                          {car.specs.fuelType}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Seats</td>
                      {selectedCars.map((car) => (
                        <td key={car.id} className="px-6 py-4 text-center text-sm text-gray-900">
                          {car.specs.seats}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">MPG</td>
                      {selectedCars.map((car) => (
                        <td key={car.id} className="px-6 py-4 text-center text-sm text-gray-900">
                          {car.specs.mpg}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Luggage Space</td>
                      {selectedCars.map((car) => (
                        <td key={car.id} className="px-6 py-4 text-center text-sm text-gray-900">
                          {car.specs.luggage}
                        </td>
                      ))}
                    </tr>

                    {/* Features */}
                    {allFeatures.map((feature) => (
                      <tr key={feature} className="bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{feature}</td>
                        {getFeatureComparison(feature).map(({ car, hasFeature }) => (
                          <td key={car.id} className="px-6 py-4 text-center">
                            {hasFeature ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-red-500 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              {selectedCars.map((car) => (
                <Link
                  key={car.id}
                  href={`/cars/${car.id}`}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View {car.make} {car.model}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
