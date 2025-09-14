"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, Car, Save, Plus } from "lucide-react";
import Link from "next/link";

interface CarFormData {
  make: string;
  model: string;
  year: number;
  price: number;
  location: string;
  description: string;
  features: string[];
  transmission: string;
  fuelType: string;
  seats: number;
  mileage: number;
  vin: string;
  licensePlate: string;
  insurance: boolean;
  maintenance: boolean;
}

export default function AddNewCarPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  
  const [formData, setFormData] = useState<CarFormData>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    location: "",
    description: "",
    features: [],
    transmission: "automatic",
    fuelType: "gasoline",
    seats: 5,
    mileage: 0,
    vin: "",
    licensePlate: "",
    insurance: true,
    maintenance: true
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session?.user?.isHost) {
    router.push("/dashboard");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? Number(value) : value
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (featureToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // For now, we'll simulate image upload with placeholder URLs
      // In a real app, you'd upload to a service like AWS S3 or Cloudinary
      Array.from(files).forEach(file => {
        const imageUrl = `/api/placeholder/400/300?text=${encodeURIComponent(file.name)}`;
        setUploadedImages(prev => [...prev, imageUrl]);
      });
    }
  };

  const handleRemoveImage = (imageToRemove: string) => {
    setUploadedImages(prev => prev.filter(image => image !== imageToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you'd send the data to your API
      console.log("Car data to submit:", { ...formData, images: uploadedImages });
      
      // Redirect to cars list
      router.push("/dashboard/cars");
    } catch (error) {
      console.error("Error adding car:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/cars"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Cars
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Car</h1>
          <p className="text-gray-600 mt-2">List your car and start earning money</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Car className="h-5 w-5 mr-2 text-blue-600" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Make *
                </label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Toyota"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Camry"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="75"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Downtown Seattle"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your car, its condition, and any special features..."
                />
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Technical Specifications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transmission
                </label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                  <option value="cvt">CVT</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type
                </label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="gasoline">Gasoline</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="electric">Electric</option>
                  <option value="plug-in-hybrid">Plug-in Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Seats
                </label>
                <select
                  name="seats"
                  value={formData.seats}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[2, 3, 4, 5, 6, 7, 8].map(seat => (
                    <option key={seat} value={seat}>{seat} seats</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mileage
                </label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VIN Number
                </label>
                <input
                  type="text"
                  name="vin"
                  value={formData.vin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="17-character VIN"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Plate
                </label>
                <input
                  type="text"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ABC-123"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Features & Amenities</h2>
            
            <div className="mb-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature (e.g., Bluetooth, Backup Camera)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {formData.features.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{feature}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(feature)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Car Photos</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload high-quality photos of your car
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Recommended: At least 4 photos (front, back, side, interior)
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Images
                </label>
              </div>
            </div>

            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Car image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(image)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Legal & Insurance */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Legal & Insurance</h2>
            
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="insurance"
                  checked={formData.insurance}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  My car is properly insured for rental use
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="maintenance"
                  checked={formData.maintenance}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  My car is well-maintained and safe to drive
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/dashboard/cars"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading || uploadedImages.length === 0}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding Car...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Add Car
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
