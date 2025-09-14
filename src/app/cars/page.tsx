"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MapPin, Star, Calendar, Users, Fuel, Zap, ArrowLeft, Heart, SortAsc, SortDesc, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  location: string;
  rating: number;
  reviewCount: number;
  image: string;
  features: string[];
  isAvailable: boolean;
  host: {
    name: string;
    avatar: string;
    rating: number;
  };
}

const mockCars: Car[] = [
  {
    id: "1",
    make: "Toyota",
    model: "Camry",
    year: 2022,
    price: 75,
    location: "Downtown Seattle",
    rating: 4.8,
    reviewCount: 127,
    image: "/api/placeholder/400/300?text=Toyota+Camry",
    features: ["Automatic", "5 Seats", "Hybrid", "Bluetooth"],
    isAvailable: true,
    host: {
      name: "Sarah Johnson",
      avatar: "/api/placeholder/40/40?text=SJ",
      rating: 4.9
    }
  },
  {
    id: "2",
    make: "Honda",
    model: "CR-V",
    year: 2021,
    price: 85,
    location: "Bellevue",
    rating: 4.7,
    reviewCount: 89,
    image: "/api/placeholder/400/300?text=Honda+CR-V",
    features: ["Automatic", "5 Seats", "AWD", "Backup Camera"],
    isAvailable: true,
    host: {
      name: "Mike Chen",
      avatar: "/api/placeholder/40/40?text=MC",
      rating: 4.7
    }
  },
  {
    id: "3",
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    price: 120,
    location: "Redmond",
    rating: 4.9,
    reviewCount: 203,
    image: "/api/placeholder/400/300?text=Tesla+Model+3",
    features: ["Electric", "5 Seats", "Autopilot", "Supercharger"],
    isAvailable: false,
    host: {
      name: "Emily Davis",
      avatar: "/api/placeholder/40/40?text=ED",
      rating: 4.8
    }
  },
  {
    id: "4",
    make: "BMW",
    model: "X3",
    year: 2022,
    price: 110,
    location: "Kirkland",
    rating: 4.6,
    reviewCount: 67,
    image: "/api/placeholder/400/300?text=BMW+X3",
    features: ["Automatic", "5 Seats", "AWD", "Premium Sound"],
    isAvailable: true,
    host: {
      name: "David Wilson",
      avatar: "/api/placeholder/40/40?text=DW",
      rating: 4.6
    }
  },
  {
    id: "5",
    make: "Ford",
    model: "Mustang",
    year: 2021,
    price: 95,
    location: "Tacoma",
    rating: 4.5,
    reviewCount: 45,
    image: "/api/placeholder/400/300?text=Ford+Mustang",
    features: ["Manual", "4 Seats", "V8", "Convertible"],
    isAvailable: true,
    host: {
      name: "Alex Rodriguez",
      avatar: "/api/placeholder/40/40?text=AR",
      rating: 4.5
    }
  },
  {
    id: "6",
    make: "Subaru",
    model: "Outback",
    year: 2022,
    price: 80,
    location: "Olympia",
    rating: 4.7,
    reviewCount: 78,
    image: "/api/placeholder/400/300?text=Subaru+Outback",
    features: ["Automatic", "5 Seats", "AWD", "Roof Rack"],
    isAvailable: true,
    host: {
      name: "Lisa Park",
      avatar: "/api/placeholder/40/40?text=LP",
      rating: 4.7
    }
  }
];

export default function CarsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("price");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>(mockCars);

  const locations = ['All', 'Downtown Seattle', 'Bellevue', 'Redmond', 'Kirkland', 'Tacoma', 'Olympia'];
  const features = ['Electric', 'Hybrid', 'AWD', 'Luxury', 'Convertible', 'Automatic', 'Manual', 'Bluetooth'];

  useEffect(() => {
    let filtered = mockCars.filter(car => {
      const matchesSearch = car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           car.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !selectedLocation || selectedLocation === 'All' || car.location === selectedLocation;
      const matchesPrice = car.price >= priceRange[0] && car.price <= priceRange[1];
      const matchesFeatures = selectedFeatures.length === 0 || 
                             selectedFeatures.every(feature => car.features.includes(feature));
      const matchesAvailability = car.isAvailable;

      return matchesSearch && matchesLocation && matchesPrice && matchesFeatures && matchesAvailability;
    });

    // Sort cars
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'year':
          aValue = a.year;
          bValue = b.year;
          break;
        case 'reviews':
          aValue = a.reviewCount;
          bValue = b.reviewCount;
          break;
        default:
          aValue = a.price;
          bValue = b.price;
      }

      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    setFilteredCars(filtered);
  }, [searchTerm, selectedLocation, priceRange, selectedFeatures, sortBy, sortOrder]);

  const toggleFavorite = (carId: string) => {
    setFavorites(prev => 
      prev.includes(carId) 
        ? prev.filter(id => id !== carId)
        : [...prev, carId]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLocation("");
    setPriceRange([0, 200]);
    setSelectedFeatures([]);
    setSortBy("price");
    setSortOrder("asc");
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Browse Cars</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href="/cars/compare"
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Filter className="h-4 w-4 mr-2" />
                Compare
              </Link>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear all
                </button>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Make, model..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-600"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="">All Locations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
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
                <div className="space-y-2">
                  {features.map(feature => (
                    <label key={feature} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFeatures.includes(feature)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFeatures([...selectedFeatures, feature]);
                          } else {
                            setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Sort and Results Count */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <p className="text-gray-600 mb-4 sm:mb-0">
                {filteredCars.length} car{filteredCars.length !== 1 ? 's' : ''} found
              </p>
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                  <option value="year">Year</option>
                  <option value="reviews">Reviews</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {sortOrder === 'asc' ? (
                    <SortAsc className="h-4 w-4 text-gray-600" />
                  ) : (
                    <SortDesc className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Cars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
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
                      onClick={() => toggleFavorite(car.id)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          favorites.includes(car.id) 
                            ? 'text-red-500 fill-current' 
                            : 'text-gray-400'
                        }`} 
                      />
                    </button>
                    {!car.isAvailable && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">Unavailable</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {car.year} {car.make} {car.model}
                        </h3>
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          {car.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          ${car.price}
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
                              i < Math.floor(car.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {car.rating} ({car.reviewCount} reviews)
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {car.features.slice(0, 3).map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                      {car.features.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          +{car.features.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Image
                          src={car.host.avatar}
                          alt={car.host.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <div className="ml-2">
                          <p className="text-sm font-medium text-gray-900">{car.host.name}</p>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="ml-1 text-xs text-gray-600">{car.host.rating}</span>
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/cars/${car.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCars.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
