"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { CheckCircle, Calendar, MapPin, Car, Download, Mail, Phone, Star, MessageSquare } from "lucide-react";
import Link from "next/link";

interface BookingConfirmation {
  id: string;
  car: {
    make: string;
    model: string;
    year: number;
    image: string;
  };
  dates: {
    start: string;
    end: string;
    totalDays: number;
  };
  total: number;
  host: {
    name: string;
    phone: string;
    email: string;
  };
}

export default function BookingSuccessPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const carId = params.id as string;

  const [booking, setBooking] = useState<BookingConfirmation | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push(`/auth/login?callbackUrl=/cars/${carId}/book/success`);
      return;
    }

    // Mock booking confirmation data
    setBooking({
      id: `BK${Date.now().toString().slice(-6)}`,
      car: {
        make: "Toyota",
        model: "Camry",
        year: 2022,
        image: "/api/placeholder/400/300?text=Toyota+Camry+Front"
      },
      dates: {
        start: "2024-01-15",
        end: "2024-01-17",
        totalDays: 3
      },
      total: 258.75,
      host: {
        name: "Sarah Johnson",
        phone: "+1 (555) 123-4567",
        email: "sarah.johnson@example.com"
      }
    });
  }, [status, session, router, carId]);

  if (status === "loading" || !booking) {
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
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your car rental has been successfully booked. You'll receive a confirmation email shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Car className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Car</p>
                    <p className="font-medium text-gray-900">
                      {booking.car.year} {booking.car.make} {booking.car.model}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium text-gray-900">
                      {booking.dates.totalDays} day{booking.dates.totalDays > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Pickup Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(booking.dates.start).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Return Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(booking.dates.end).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">Total Paid</span>
                  <span className="text-2xl font-bold text-green-600">${booking.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Host Information */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Host Information</h2>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                  <Car className="h-8 w-8 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{booking.host.name}</h3>
                  <p className="text-gray-600">Your car host</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{booking.host.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{booking.host.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">What's Next?</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-medium text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Host Confirmation</h4>
                    <p className="text-gray-600">Your host will confirm the booking within 24 hours.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-medium text-blue-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Pickup Instructions</h4>
                    <p className="text-gray-600">You'll receive detailed pickup location and instructions.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-medium text-blue-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Enjoy Your Trip</h4>
                    <p className="text-gray-600">Pick up your car and have a great journey!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-4">
                <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="h-5 w-5" />
                  <span>Download Receipt</span>
                </button>

                <Link
                  href="/dashboard/bookings"
                  className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Calendar className="h-5 w-5" />
                  <span>View My Bookings</span>
                </Link>

                <Link
                  href="/cars"
                  className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Car className="h-5 w-5" />
                  <span>Browse More Cars</span>
                </Link>

                <Link
                  href={`/cars/${carId}/review`}
                  className="w-full flex items-center justify-center space-x-2 bg-yellow-100 text-yellow-700 py-3 px-4 rounded-lg hover:bg-yellow-200 transition-colors"
                >
                  <Star className="h-5 w-5" />
                  <span>Write a Review</span>
                </Link>

                <Link
                  href="/dashboard/messages"
                  className="w-full flex items-center justify-center space-x-2 bg-indigo-100 text-indigo-700 py-3 px-4 rounded-lg hover:bg-indigo-200 transition-colors"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Message Host</span>
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-gray-900 mb-3">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  If you have any questions about your booking, our support team is here to help.
                </p>
                <button className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

