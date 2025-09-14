import Image from "next/image";
import Link from "next/link";
import { Car, Shield, Star, MapPin, Calendar, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Find Your Perfect
                <span className="text-blue-600"> Ride</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Rent cars from trusted hosts. Safe, reliable, and affordable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/cars"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center justify-center"
                >
                  <Car className="mr-2 h-5 w-5" />
                  Browse Cars
                </Link>
                <Link
                  href="/host"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center justify-center"
                >
                  Become a Host
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <div className="bg-gray-100 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Search</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Pickup location"
                        className="flex-1 p-2 border border-gray-300 rounded-md text-gray-900 bg-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        className="flex-1 p-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                      Search Cars
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CarShare?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, safe, and convenient car rental for everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Safe & Secure</h3>
              <p className="text-gray-600">
                Verified hosts and insured cars. Your safety is our priority.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trusted Hosts</h3>
              <p className="text-gray-600">
                Reliable hosts who maintain their vehicles to the highest standards.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Driven</h3>
              <p className="text-gray-600">
                Join our community of car enthusiasts and travelers worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
