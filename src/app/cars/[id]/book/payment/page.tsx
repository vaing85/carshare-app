"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, CreditCard, Shield, CheckCircle, Lock } from "lucide-react";
import Link from "next/link";
import PaymentForm from "@/components/PaymentForm";

interface BookingData {
  carId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
  serviceFee: number;
  grandTotal: number;
  car: {
    make: string;
    model: string;
    year: number;
    dailyRate: number;
  };
}

export default function PaymentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const carId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // In a real app, this would come from the booking form or API
  const [bookingData] = useState<BookingData>({
    carId,
    startDate: "2024-01-15",
    endDate: "2024-01-17",
    totalDays: 3,
    totalPrice: 225,
    serviceFee: 33.75,
    grandTotal: 258.75,
    car: {
      make: "Toyota",
      model: "Camry",
      year: 2022,
      dailyRate: 75
    }
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push(`/auth/login?callbackUrl=/cars/${carId}/book/payment`);
      return;
    }
  }, [status, session, router, carId]);

  const handlePaymentSuccess = (paymentId: string) => {
    console.log("Payment successful:", paymentId);
    router.push(`/cars/${carId}/book/success?paymentId=${paymentId}`);
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
  };

  if (status === "loading") {
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
              href={`/cars/${carId}/book`}
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Booking
            </Link>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Complete Payment</h1>
            <p className="text-gray-600 mt-2">
              Secure payment for your {bookingData.car.year} {bookingData.car.make} {bookingData.car.model} booking
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Lock className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Secure Payment</h2>
              </div>
              
              <PaymentForm
                bookingData={{
                  carId: bookingData.carId,
                  startDate: bookingData.startDate,
                  endDate: bookingData.endDate,
                  totalAmount: bookingData.grandTotal,
                  currency: 'USD'
                }}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            </div>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Summary</h2>
              
              {/* Car Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {bookingData.car.year} {bookingData.car.make} {bookingData.car.model}
                </h3>
                <p className="text-sm text-gray-600">
                  {bookingData.startDate} - {bookingData.endDate}
                </p>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {bookingData.totalDays} day{bookingData.totalDays > 1 ? 's' : ''} × ${bookingData.car.dailyRate}
                  </span>
                  <span className="text-gray-900">${bookingData.totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service fee (15%)</span>
                  <span className="text-gray-900">${bookingData.serviceFee.toFixed(2)}</span>
                </div>
                
                <hr className="my-3" />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">${bookingData.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Security Features */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-gray-900 mb-3">Security Features</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">SSL encrypted</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">PCI compliant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Fraud protection</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

