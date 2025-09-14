"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TrendingUp, TrendingDown, DollarSign, Calendar, Car, Users, Star, BarChart3 } from "lucide-react";
import Link from "next/link";

interface AnalyticsData {
  totalRevenue: number;
  monthlyRevenue: number;
  totalBookings: number;
  monthlyBookings: number;
  activeCars: number;
  averageRating: number;
  totalReviews: number;
  revenueChange: number;
  bookingsChange: number;
  topPerformingCar: {
    name: string;
    revenue: number;
    bookings: number;
  };
  recentBookings: Array<{
    id: string;
    carName: string;
    guestName: string;
    amount: number;
    date: string;
    status: string;
  }>;
  monthlyData: Array<{
    month: string;
    revenue: number;
    bookings: number;
  }>;
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated" && !session?.user?.isHost) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    // Mock analytics data
    const mockAnalytics: AnalyticsData = {
      totalRevenue: 12450,
      monthlyRevenue: 2850,
      totalBookings: 89,
      monthlyBookings: 23,
      activeCars: 3,
      averageRating: 4.7,
      totalReviews: 67,
      revenueChange: 12.5,
      bookingsChange: -5.2,
      topPerformingCar: {
        name: "Tesla Model 3",
        revenue: 4850,
        bookings: 31
      },
      recentBookings: [
        {
          id: "1",
          carName: "Tesla Model 3",
          guestName: "Mike Johnson",
          amount: 240,
          date: "2024-01-15",
          status: "completed"
        },
        {
          id: "2",
          carName: "Toyota Camry",
          guestName: "Sarah Wilson",
          amount: 150,
          date: "2024-01-14",
          status: "active"
        },
        {
          id: "3",
          carName: "Honda CR-V",
          guestName: "David Brown",
          amount: 170,
          date: "2024-01-13",
          status: "completed"
        }
      ],
      monthlyData: [
        { month: "Jan", revenue: 2850, bookings: 23 },
        { month: "Dec", revenue: 3200, bookings: 28 },
        { month: "Nov", revenue: 2900, bookings: 25 },
        { month: "Oct", revenue: 3500, bookings: 30 }
      ]
    };

    setAnalytics(mockAnalytics);
    setLoading(false);
  }, []);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session?.user?.isHost) {
    return null;
  }

  if (!analytics) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your performance and earnings</p>
        </div>

        {/* Period Selector */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Time Period:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${analytics.totalRevenue}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {analytics.revenueChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${analytics.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analytics.revenueChange >= 0 ? '+' : ''}{analytics.revenueChange}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${analytics.monthlyRevenue}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-500">This month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalBookings}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {analytics.bookingsChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${analytics.bookingsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analytics.bookingsChange >= 0 ? '+' : ''}{analytics.bookingsChange}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.averageRating}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-500">{analytics.totalReviews} reviews</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Performing Car */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Car className="h-5 w-5 mr-2 text-blue-600" />
                Top Performing Car
              </h3>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {analytics.topPerformingCar.name}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="text-lg font-semibold text-green-600">
                      ${analytics.topPerformingCar.revenue}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bookings</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {analytics.topPerformingCar.bookings}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-green-600" />
                Recent Bookings
              </h3>
              <div className="space-y-3">
                {analytics.recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{booking.carName}</p>
                          <p className="text-sm text-gray-600">Guest: {booking.guestName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${booking.amount}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(booking.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className={`ml-4 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link
                  href="/dashboard/bookings"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All Bookings →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
              Monthly Trends
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {analytics.monthlyData.map((month, index) => (
                <div key={month.month} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-2">{month.month}</p>
                  <p className="text-lg font-bold text-green-600 mb-1">${month.revenue}</p>
                  <p className="text-sm text-gray-500">{month.bookings} bookings</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/dashboard/cars/new"
                className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Car className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-blue-900 font-medium">Add New Car</span>
              </Link>
              <Link
                href="/dashboard/cars"
                className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <BarChart3 className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-green-900 font-medium">Manage Cars</span>
              </Link>
              <Link
                href="/dashboard/bookings"
                className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Calendar className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-purple-900 font-medium">View Bookings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
