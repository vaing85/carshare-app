"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Clock, DollarSign, Shield, CheckCircle } from "lucide-react";
import Link from "next/link";
import { differenceInDays, addDays, format } from "date-fns";

interface CarData {
  id: string;
  make: string;
  model: string;
  year: number;
  dailyRate: number;
  location: string;
  description: string;
  features: string[];
  images: string[];
  host: {
    name: string;
    rating: number;
    totalReviews: number;
  };
}

interface BookingFormData {
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  notes: string;
}

export default function BookCarPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const carId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [car, setCar] = useState<CarData | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    startDate: "",
    endDate: "",
    pickupLocation: "",
    dropoffLocation: "",
    notes: ""
  });

  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push(`/auth/login?callbackUrl=/cars/${carId}/book`);
      return;
    }

    // Mock car data - in a real app, fetch from API
    const mockCar: CarData = {
      id: carId,
      make: "Toyota",
      model: "Camry",
      year: 2022,
      dailyRate: 75,
      location: "Downtown Seattle",
      description: "A reliable and comfortable sedan perfect for city driving and road trips. This well-maintained Camry offers excellent fuel efficiency and a smooth ride.",
      features: [
        "Automatic transmission",
        "Bluetooth connectivity",
        "Backup camera",
        "Apple CarPlay",
        "Android Auto",
        "Heated seats"
      ],
      images: [
        "/api/placeholder/400/300?text=Toyota+Camry+Front",
        "/api/placeholder/400/300?text=Toyota+Camry+Side",
        "/api/placeholder/400/300?text=Toyota+Camry+Interior"
      ],
      host: {
        name: "Sarah Johnson",
        rating: 4.8,
        totalReviews: 127
      }
    };

    setCar(mockCar);
  }, [status, session, router, carId]);

  useEffect(() => {
    if (formData.startDate && formData.endDate && car) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const days = differenceInDays(end, start) + 1;
      
      if (days > 0) {
        setTotalDays(days);
        const basePrice = days * car.dailyRate;
        const fee = basePrice * 0.15; // 15% service fee
        setTotalPrice(basePrice);
        setServiceFee(fee);
        setGrandTotal(basePrice + fee);
      }
    }
  }, [formData.startDate, formData.endDate, car]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real app, you'd send the booking data to your API
      console.log("Booking submitted:", {
        carId,
        userId: session?.user?.id,
        ...formData,
        totalDays,
        totalPrice,
        serviceFee,
        grandTotal
      });

      // Redirect to payment page
      router.push(`/cars/${carId}/book/payment`);
    } catch (error) {
      console.error("Error creating booking:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || !car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <span className="text-gray-400">|</span>
            <Link
              href={`/cars/${carId}`}
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Car Details
            </Link>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book Your Car</h1>
            <p className="text-gray-600 mt-2">
              Complete your booking for the {car.year} {car.make} {car.model}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        min={format(new Date(), 'yyyy-MM-dd')}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Return Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        min={formData.startDate || format(new Date(), 'yyyy-MM-dd')}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleInputChange}
                        placeholder="Same as car location"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Drop-off Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="dropoffLocation"
                        value={formData.dropoffLocation}
                        onChange={handleInputChange}
                        placeholder="Same as pickup location"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests or Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any special requirements or notes for your host..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !formData.startDate || !formData.endDate}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline"></div>
                      Processing...
                    </>
                  ) : (
                    "Continue to Payment"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Summary</h2>
              
              {/* Car Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src={car.images[0]}
                    alt={`${car.make} ${car.model}`}
                    className="w-16 h-12 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {car.year} {car.make} {car.model}
                    </h3>
                    <p className="text-sm text-gray-600">{car.location}</p>
                  </div>
                </div>
              </div>

              {/* Host Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{car.host.name}</p>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600">
                        {car.host.rating} ({car.host.totalReviews} reviews)
                      </span>
                    </div>
                  </div>
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
              </div>

              {/* Pricing */}
              {totalDays > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {totalDays} day{totalDays > 1 ? 's' : ''} × ${car.dailyRate}
                    </span>
                    <span className="text-gray-900">${totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service fee (15%)</span>
                    <span className="text-gray-900">${serviceFee.toFixed(2)}</span>
                  </div>
                  
                  <hr className="my-3" />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Included Features</h4>
                <div className="space-y-2">
                  {car.features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
