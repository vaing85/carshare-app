"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Car, Calendar, User, Shield, Star, MapPin, Phone, Mail, MessageSquare, Bell, Heart, Filter } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

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
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {session.user?.name || session.user?.email}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 rounded-full p-3">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{session.user?.name}</h2>
              <p className="text-gray-600">{session.user?.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                {session.user?.isHost && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Host
                  </span>
                )}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Star className="h-3 w-3 mr-1" />
                  {session.user?.isVerified ? "Verified" : "Unverified"}
                </span>
              </div>
            </div>
            <Link
              href="/dashboard/profile"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            href="/cars"
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-lg p-3">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Browse Cars</h3>
                <p className="text-gray-600">Find your perfect rental car</p>
              </div>
            </div>
          </Link>

          <Link
            href={session.user?.isHost ? "/dashboard/bookings" : "/dashboard/my-bookings"}
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 rounded-lg p-3">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {session.user?.isHost ? "Manage Bookings" : "My Bookings"}
                </h3>
                <p className="text-gray-600">
                  {session.user?.isHost ? "Manage incoming bookings" : "View and manage your rentals"}
                </p>
              </div>
            </div>
          </Link>

          {session.user?.isHost && (
            <Link
              href="/dashboard/cars"
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 rounded-lg p-3">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">My Cars</h3>
                  <p className="text-gray-600">Manage your listed vehicles</p>
                </div>
              </div>
            </Link>
          )}

          {!session.user?.isHost && (
            <Link
              href="/host"
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 rounded-lg p-3">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Become a Host</h3>
                  <p className="text-gray-600">List your car and earn money</p>
                </div>
              </div>
            </Link>
          )}

          <Link
            href="/dashboard/messages"
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 rounded-lg p-3">
                <MessageSquare className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
                <p className="text-gray-600">Chat with hosts and renters</p>
              </div>
            </div>
          </Link>

          {session.user?.isHost && (
            <Link
              href="/dashboard/host"
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-100 rounded-lg p-3">
                  <Bell className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Host Dashboard</h3>
                  <p className="text-gray-600">Manage bookings and analytics</p>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/dashboard/wishlist"
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 rounded-lg p-3">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Wishlist</h3>
                <p className="text-gray-600">Save your favorite cars</p>
              </div>
            </div>
          </Link>

          <Link
            href="/cars/compare"
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 rounded-lg p-3">
                <Filter className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Compare Cars</h3>
                <p className="text-gray-600">Compare features side by side</p>
              </div>
            </div>
          </Link>

          {session.user?.isHost && (
            <Link
              href="/dashboard/analytics"
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 rounded-lg p-3">
                  <Bell className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
                  <p className="text-gray-600">Track your performance</p>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No recent activity</p>
            <p className="text-sm">Your bookings and activities will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
