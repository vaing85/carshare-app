'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, Filter, MapPin, Calendar, DollarSign } from 'lucide-react'

interface SearchFilters {
  location: string
  startDate: string
  endDate: string
  priceRange: [number, number]
  features: string[]
}

interface MobileSearchProps {
  onSearch: (filters: SearchFilters) => void
  onClose: () => void
  isOpen: boolean
}

export default function MobileSearch({ onSearch, onClose, isOpen }: MobileSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    startDate: '',
    endDate: '',
    priceRange: [0, 200],
    features: []
  })

  const [showAdvanced, setShowAdvanced] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const features = ['Electric', 'Hybrid', 'AWD', 'Luxury', 'Convertible', 'Automatic', 'Manual', 'Bluetooth']

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isOpen])

  const handleSearch = () => {
    onSearch(filters)
    onClose()
  }

  const handleFeatureToggle = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const clearFilters = () => {
    setFilters({
      location: '',
      startDate: '',
      endDate: '',
      priceRange: [0, 200],
      features: []
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 lg:hidden">
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto">
        <div ref={searchRef} className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Search Cars</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Search */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Where are you going?"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-center space-x-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Advanced Filters</span>
            </button>

            {/* Advanced Filters */}
            {showAdvanced && (
              <div className="space-y-4 pt-4 border-t">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        priceRange: [prev.priceRange[0], parseInt(e.target.value)] 
                      }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>$0</span>
                      <span>$200+</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {features.map(feature => (
                      <label key={feature} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.features.includes(feature)}
                          onChange={() => handleFeatureToggle(feature)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-8">
            <button
              onClick={clearFilters}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleSearch}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
