"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, Car, User, DollarSign, MessageSquare, CheckCircle, XCircle, AlertCircle, Filter, Search } from "lucide-react";
import Link from "next/link";

interface Booking {
  id: string;
  carName: string;
  guestName: string;
  guestEmail: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  createdAt: string;
  pickupLocation: string;
  returnLocation: string;
  guestMessage?: string;
  hostResponse?: string;
}

export default function BookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated" && !session?.user?.isHost) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    // Mock bookings data
    const mockBookings: Booking[] = [
      {
        id: "1",
        carName: "Tesla Model 3",
        guestName: "Mike Johnson",
        guestEmail: "mike@example.com",
        startDate: "2024-01-20",
        endDate: "2024-01-23",
        totalAmount: 360,
        status: "confirmed",
        createdAt: "2024-01-15T10:30:00Z",
        pickupLocation: "Downtown Seattle",
        returnLocation: "Downtown Seattle",
        guestMessage: "Need the car for a business trip. Will pick up early morning."
      },
      {
        id: "2",
        carName: "Toyota Camry",
        guestName: "Sarah Wilson",
        guestEmail: "sarah@example.com",
        startDate: "2024-01-18",
        endDate: "2024-01-19",
        totalAmount: 150,
        status: "active",
        createdAt: "2024-01-14T14:20:00Z",
        pickupLocation: "Bellevue",
        returnLocation: "Bellevue"
      },
      {
        id: "3",
        carName: "Honda CR-V",
        guestName: "David Brown",
        guestEmail: "david@example.com",
        startDate: "2024-01-25",
        endDate: "2024-01-28",
        totalAmount: 340,
        status: "pending",
        createdAt: "2024-01-16T09:15:00Z",
        pickupLocation: "Redmond",
        returnLocation: "Redmond",
        guestMessage: "Planning a weekend trip. Is the car available for this period?"
      },
      {
        id: "4",
        carName: "Tesla Model 3",
        guestName: "Emily Davis",
        guestEmail: "emily@example.com",
        startDate: "2024-01-12",
        endDate: "2024-01-14",
        totalAmount: 240,
        status: "completed",
        createdAt: "2024-01-10T16:45:00Z",
        pickupLocation: "Downtown Seattle",
        returnLocation: "Downtown Seattle"
      },
      {
        id: "5",
        carName: "Toyota Camry",
        guestName: "Alex Thompson",
        guestEmail: "alex@example.com",
        startDate: "2024-01-30",
        endDate: "2024-02-02",
        totalAmount: 300,
        status: "cancelled",
        createdAt: "2024-01-17T11:30:00Z",
        pickupLocation: "Kirkland",
        returnLocation: "Kirkland"
      }
    ];

    setBookings(mockBookings);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "active":
        return <Car className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = selectedStatus === "all" || booking.status === selectedStatus;
    const matchesSearch = 
      booking.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guestEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesPeriod = true;
    if (selectedPeriod !== "all") {
      const today = new Date();
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      
      switch (selectedPeriod) {
        case "today":
          matchesPeriod = startDate <= today && endDate >= today;
          break;
        case "week":
          const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          matchesPeriod = startDate <= weekFromNow;
          break;
        case "month":
          const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
          matchesPeriod = startDate <= monthFromNow;
          break;
      }
    }
    
    return matchesStatus && matchesSearch && matchesPeriod;
  });

  const totalRevenue = bookings
    .filter(booking => booking.status === "completed" || booking.status === "active")
    .reduce((sum, booking) => sum + booking.totalAmount, 0);

  const pendingBookings = bookings.filter(booking => booking.status === "pending").length;
  const activeBookings = bookings.filter(booking => booking.status === "active").length;

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    // In a real app, you'd make an API call to update the booking status
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus as any }
          : booking
      )
    );
  };

  const handleRespondToGuest = (bookingId: string) => {
    const response = prompt("Enter your response to the guest:");
    if (response) {
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, hostResponse: response }
            : booking
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-600 mt-2">Manage all your car rental bookings</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{pendingBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Car className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Rentals</p>
                <p className="text-2xl font-bold text-gray-900">{activeBookings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("all");
                  setSelectedPeriod("all");
                }}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Bookings ({filteredBookings.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{booking.carName}</div>
                        <div className="text-sm text-gray-500">ID: {booking.id}</div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.pickupLocation}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{booking.guestName}</div>
                        <div className="text-sm text-gray-500">{booking.guestEmail}</div>
                        {booking.guestMessage && (
                          <div className="text-xs text-gray-600 mt-1 max-w-xs truncate" title={booking.guestMessage}>
                            💬 {booking.guestMessage}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div>{new Date(booking.startDate).toLocaleDateString()}</div>
                        <div className="text-gray-500">to</div>
                        <div>{new Date(booking.endDate).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        ${booking.totalAmount}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1">{getStatusText(booking.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleStatusChange(booking.id, "confirmed")}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Confirm Booking"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(booking.id, "cancelled")}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Reject Booking"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        
                        {booking.status === "confirmed" && (
                          <button
                            onClick={() => handleStatusChange(booking.id, "active")}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Start Rental"
                          >
                            <Car className="h-4 w-4" />
                          </button>
                        )}
                        
                        {booking.status === "active" && (
                          <button
                            onClick={() => handleStatusChange(booking.id, "completed")}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Complete Rental"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        
                        {booking.guestMessage && !booking.hostResponse && (
                          <button
                            onClick={() => handleRespondToGuest(booking.id)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Respond to Guest"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </button>
                        )}
                        
                        <Link
                          href={`/dashboard/bookings/${booking.id}`}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="View Details"
                        >
                          <Calendar className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedStatus !== "all" || selectedPeriod !== "all"
                  ? "Try adjusting your search criteria or filters"
                  : "You don't have any bookings yet"}
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/dashboard/cars"
                className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Car className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-blue-900 font-medium">Manage Cars</span>
              </Link>
              <Link
                href="/dashboard/analytics"
                className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Calendar className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-green-900 font-medium">View Analytics</span>
              </Link>
              <Link
                href="/dashboard/cars/new"
                className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Car className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-purple-900 font-medium">Add New Car</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
