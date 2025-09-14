"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Car, User, LogIn, UserPlus, LogOut, Settings, Shield, Heart, BarChart3, MessageSquare } from "lucide-react";
import NotificationBell from "./NotificationBell";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">CarShare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation links removed */}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {status === "loading" ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : session ? (
              <>
                <NotificationBell />
                <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>{session.user?.name || session.user?.email}</span>
                  {session.user?.isHost && (
                    <Shield className="h-4 w-4 text-green-600" />
                  )}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    {session.user?.isHost && (
                      <Link
                        href="/dashboard/cars"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Cars
                      </Link>
                    )}
                    <Link
                      href="/dashboard/bookings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Link
                      href="/dashboard/wishlist"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Heart className="h-4 w-4 inline mr-2" />
                      Wishlist
                    </Link>
                    <Link
                      href="/dashboard/messages"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <MessageSquare className="h-4 w-4 inline mr-2" />
                      Messages
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 inline mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <LogIn className="h-4 w-4 inline mr-1" />
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <UserPlus className="h-4 w-4 inline mr-1" />
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-md"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {/* Navigation links removed */}
              
              <div className="pt-4 border-t">
                {status === "loading" ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-full rounded"></div>
                ) : session ? (
                  <>
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Welcome, {session.user?.name || session.user?.email}
                    </div>
                    <Link
                      href="/dashboard"
                      className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    {session.user?.isHost && (
                      <Link
                        href="/dashboard/cars"
                        className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Cars
                      </Link>
                    )}
                    <Link
                      href="/dashboard/bookings"
                      className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Link
                      href="/dashboard/wishlist"
                      className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Heart className="h-4 w-4 inline mr-2" />
                      Wishlist
                    </Link>
                    <Link
                      href="/dashboard/messages"
                      className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <MessageSquare className="h-4 w-4 inline mr-2" />
                      Messages
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="text-gray-700 hover:text-blue-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                    >
                      <LogOut className="h-4 w-4 inline mr-2" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="h-4 w-4 inline mr-2" />
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      className="bg-blue-600 hover:bg-blue-700 text-white block px-3 py-2 rounded-md text-base font-medium mt-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserPlus className="h-4 w-4 inline mr-2" />
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
