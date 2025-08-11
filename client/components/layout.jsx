"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "../contexts/auth-context"
import {
  Menu,
  X,
  User,
  Calendar,
  MapPin,
  LogOut,
  Home,
  BarChart3,
  Users,
  Building,
  FileText,
  Shield,
  Settings,
} from "lucide-react"

export default function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const getNavItems = () => {
    if (!user) return []

    switch (user.role) {
      case "admin":
        return [
          { href: "/admin", label: "Dashboard", icon: BarChart3 },
          { href: "/admin/facilities", label: "Facilities", icon: Building },
          { href: "/admin/users", label: "Users", icon: Users },
          { href: "/admin/reports", label: "Reports", icon: FileText },
          { href: "/admin/settings", label: "Settings", icon: Settings },
        ]
      case "owner":
        return [
          { href: "/owner", label: "Dashboard", icon: BarChart3 },
          { href: "/owner/facilities", label: "My Facilities", icon: Building },
          { href: "/owner/bookings", label: "Bookings", icon: Calendar },
          { href: "/owner/analytics", label: "Analytics", icon: BarChart3 },
          { href: "/owner/profile", label: "Profile", icon: User },
        ]
      default: // player
        return [
          { href: "/", label: "Home", icon: Home },
          { href: "/venues", label: "Venues", icon: MapPin },
          { href: "/my-bookings", label: "My Bookings", icon: Calendar },
          { href: "/profile", label: "Profile", icon: User },
        ]
    }
  }

  const handleLogout = () => {
    logout()
    window.location.href = "/auth/login"
  }

  if (!user) {
    return <div className="min-h-screen bg-gray-50">{children}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                QuickCourt
              </Link>
              {user.role === "admin" && (
                <span className="ml-3 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                  <Shield className="w-3 h-3 inline mr-1" />
                  Admin
                </span>
              )}
              {user.role === "owner" && (
                <span className="ml-3 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                  <Building className="w-3 h-3 inline mr-1" />
                  Owner
                </span>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {getNavItems().map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-blue-600"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* User menu */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-gray-500 capitalize">{user.role}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-blue-600 p-2 rounded-md transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {getNavItems().map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
              <div className="border-t pt-3 mt-3">
                <div className="flex items-center px-3 py-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-gray-500 capitalize">{user.role}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">QuickCourt</h3>
              <p className="text-gray-300 mb-4">Your local sports booking platform</p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/venues" className="hover:text-white transition-colors">
                    Find Venues
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Sports</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Badminton</li>
                <li>Tennis</li>
                <li>Football</li>
                <li>Basketball</li>
                <li>Cricket</li>
                <li>Table Tennis</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 QuickCourt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
