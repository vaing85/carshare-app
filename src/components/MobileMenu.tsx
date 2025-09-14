'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { 
  Menu, 
  X, 
  User, 
  Car, 
  BarChart3, 
  MessageSquare, 
  Heart, 
  LogOut,
  Bell
} from 'lucide-react'
import NotificationBell from './NotificationBell'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  const toggleMenu = () => setIsOpen(!isOpen)

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Browse Cars', href: '/cars', icon: Car },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { name: 'Wishlist', href: '/dashboard/wishlist', icon: Heart },
  ]

  const hostMenuItems = [
    { name: 'My Cars', href: '/dashboard/cars', icon: Car },
    { name: 'Bookings', href: '/dashboard/bookings', icon: BarChart3 },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMenu}
        className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={toggleMenu} />
          
          <div className="relative flex flex-col w-full max-w-xs h-full bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* User info */}
            {session && (
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                    <p className="text-xs text-gray-600">{session.user?.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={toggleMenu}
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}

              {/* Host-specific menu items */}
              {session?.user && (session.user as any).isHost && (
                <>
                  <div className="border-t my-4"></div>
                  <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Host Tools
                  </p>
                  {hostMenuItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={toggleMenu}
                        className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </>
              )}

              {/* Notifications */}
              <div className="border-t my-4"></div>
              <div className="px-3 py-2">
                <NotificationBell />
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t">
              {session ? (
                <button
                  onClick={() => {
                    signOut()
                    toggleMenu()
                  }}
                  className="flex items-center space-x-3 w-full px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/auth/login"
                    onClick={toggleMenu}
                    className="block w-full px-4 py-2 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={toggleMenu}
                    className="block w-full px-4 py-2 text-center border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
