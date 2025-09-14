"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Eye, Calendar, MapPin, DollarSign, Car, Users, Fuel, Zap } from "lucide-react";
import Link from "next/link";

interface CarData {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  location: string;
  status: "active" | "inactive" | "maintenance";
  image: string;
  bookings: number;
  revenue: number;
  lastBooked: string;
}

export default function HostCarsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated" && !session?.user?.isHost) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    // Mock data for demonstration
    const mockCars: CarData[] = [
      {
        id: "1",
        make: "Toyota",
        model: "Camry",
        year: 2022,
        price: 75,
        location: "Downtown Seattle",
        status: "active",
        image: "/api/placeholder/400/300?text=Toyota+Camry",
        bookings: 23,
        revenue: 1725,
        lastBooked: "2024-01-10"
      },
      {
        id: "2",
        make: "Honda",
        model: "CR-V",
        year: 2021,
        price: 85,
        location: "Bellevue",
        status: "active",
        image: "/api/placeholder/400/300?text=Honda+CR-V",
        bookings: 18,
        revenue: 1530,
        lastBooked: "2024-01-08"
      },
      {
        id: "3",
        make: "Tesla",
        model: "Model 3",
        year: 2023,
        price: 120,
        location: "Redmond",
        status: "maintenance",
        image: "/api/placeholder/400/300?text=Tesla+Model+3",
        bookings: 31,
        revenue: 3720,
        lastBooked: "2024-01-05"
      }
    ];

    setCars(mockCars);
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
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      case "maintenance":
        return "Maintenance";
      default:
        return "Unknown";
    }
  };

  const totalRevenue = cars.reduce((sum, car) => sum + car.revenue, 0);
  const totalBookings = cars.reduce((sum, car) => sum + car.bookings, 0);
  const activeCars = cars.filter(car => car.status === "active").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Cars</h1>
            <p className="text-gray-600">Manage your car listings and track performance</p>
          </div>
          <Link
            href="/dashboard/cars/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Car
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Cars</p>
                <p className="text-2xl font-bold text-gray-900">{activeCars}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cars Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Car Listings</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Car
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price/Day
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bookings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Booked
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cars.map((car) => (
                  <tr key={car.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-16 flex-shrink-0">
                          <img
                            className="h-12 w-16 rounded-lg object-cover"
                            src={car.image}
                            alt={`${car.make} ${car.model}`}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {car.year} {car.make} {car.model}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {car.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        {car.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${car.price}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(car.status)}`}>
                        {getStatusText(car.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {car.bookings}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${car.revenue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(car.lastBooked).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/cars/${car.id}`}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/dashboard/cars/${car.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Edit Car"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete Car"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this car?")) {
                              setCars(cars.filter(c => c.id !== car.id));
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {cars.length === 0 && (
            <div className="text-center py-12">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cars listed yet</h3>
              <p className="text-gray-600 mb-4">
                Start earning by listing your first car for rent
              </p>
              <Link
                href="/dashboard/cars/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Car
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/dashboard/cars/new"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Plus className="h-5 w-5 mr-3 text-blue-600" />
                <span>Add New Car</span>
              </Link>
              <Link
                href="/dashboard/bookings"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Calendar className="h-5 w-5 mr-3 text-green-600" />
                <span>View All Bookings</span>
              </Link>
              <Link
                href="/dashboard/analytics"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <DollarSign className="h-5 w-5 mr-3 text-purple-600" />
                <span>View Analytics</span>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tips for Success</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Keep your car clean and well-maintained</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Respond quickly to booking requests</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Add high-quality photos of your car</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Set competitive pricing for your area</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

