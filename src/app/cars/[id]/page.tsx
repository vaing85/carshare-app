"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Car, Calendar, MapPin, User, Star, Phone, Mail, Shield, Clock, Fuel, Users, Zap, ArrowLeft, DollarSign } from "lucide-react";
import Link from "next/link";

interface CarData {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  location: string;
  description: string;
  features: string[];
  images: string[];
  host: {
    name: string;
    rating: number;
    totalTrips: number;
    isVerified: boolean;
  };
}

export default function CarDetailPage() {
  const params = useParams();
  const [car, setCar] = useState<CarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);


  useEffect(() => {
    // For now, we'll use mock data. Later this will fetch from the database
    const mockCar: CarData = {
      id: params.id as string,
      make: "Toyota",
      model: "Camry",
      year: 2022,
      price: 75,
      location: "Downtown Seattle",
      description: "A reliable and comfortable sedan perfect for city driving and road trips. This well-maintained Camry offers excellent fuel efficiency and a smooth ride.",
      features: [
        "Automatic transmission",
        "Bluetooth connectivity",
        "Backup camera",
        "Apple CarPlay",
        "Android Auto",
        "Heated seats",
        "Cruise control",
        "Lane departure warning"
      ],
      images: [
        "/api/placeholder/400/300?text=Toyota+Camry+Front",
        "/api/placeholder/400/300?text=Toyota+Camry+Side",
        "/api/placeholder/400/300?text=Toyota+Camry+Interior",
        "/api/placeholder/400/300?text=Toyota+Camry+Back"
      ],
      host: {
        name: "John Smith",
        rating: 4.8,
        totalTrips: 127,
        isVerified: true
      },

    };

    setCar(mockCar);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Car Not Found</h1>
          <Link href="/cars" className="text-blue-600 hover:text-blue-700">
            ← Back to Cars
          </Link>
        </div>
      </div>
    );
  }

  // This function will be used when date selection is implemented
  // const calculateTotalPrice = (startDate: string, endDate: string) => {
  //   if (!startDate || !endDate) return 0;
  //   const start = new Date(startDate);
  //   const end = new Date(endDate);
  //   const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  //   return days * car.price;
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Dashboard */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-700 hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link href="/cars" className="text-gray-700 hover:text-blue-600">
                  Cars
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">{car.make} {car.model}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Car Images */}
            <div className="mb-8">
              <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden mb-4">
                <img
                  src={car.images[selectedImage]}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {car.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`h-20 bg-gray-200 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${car.make} ${car.model} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Car Information */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {car.year} {car.make} {car.model}
                  </h1>
                  <p className="text-gray-600 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {car.location}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">${car.price}</div>
                  <div className="text-gray-500">per day</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Users className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                  <div className="text-sm text-gray-500">5 Seats</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Fuel className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                  <div className="text-sm text-gray-500">Hybrid</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Zap className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                  <div className="text-sm text-gray-500">Automatic</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                  <div className="text-sm text-gray-500">Insured</div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">{car.description}</p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {car.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Host Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Host</h2>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{car.host.name}</h3>
                    {car.host.isVerified && (
                      <Shield className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      {car.host.rating} ({car.host.totalTrips} trips)
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Response time: 1 hour
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-600 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-600">
                    <Phone className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-600">
                    <Mail className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Book This Car</h2>
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-2">Ready to Book?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Choose your dates and complete your booking in just a few steps
                  </p>
                  <Link
                    href={`/cars/${car.id}/book`}
                    className="inline-block w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
                  >
                    Book Now
                  </Link>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Fully insured and verified</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>Instant confirmation</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span>No hidden fees</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    You won't be charged until the host confirms
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
