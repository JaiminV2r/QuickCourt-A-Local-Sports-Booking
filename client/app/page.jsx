"use client"

import { useAuth } from "../contexts/auth-context"
import { Search, MapPin, Star, Users, ChevronRight, Calendar, Clock, X } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { useSportsStats } from "../hooks/use-sports"
import { useCitiesSearch } from "../hooks/use-cities"
import { useVenuesByCity } from "../hooks/use-venues"

export default function HomePage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const greetingName = user?.name?.split(" ")[0] ?? "Player"

  // React Query hooks
  const { 
    data: sports = [], 
    isLoading: isLoadingSports, 
    error: sportsError,
    refetch: refetchSports 
  } = useSportsStats()
  
  const { 
    data: cities = [], 
    isLoading: isLoadingCities 
  } = useCitiesSearch(searchQuery, showCityDropdown)
  
  const { 
    data: venues = [], 
    isLoading: isLoadingVenues 
  } = useVenuesByCity(selectedCity, !!selectedCity)

  // Simplified functions - data fetching now handled by React Query
  const searchCities = useCallback((query) => {
      setShowCityDropdown(true)
  }, [])

  // Search venues by city
  const searchVenuesByCity = useCallback(async (cityName) => {
    if (!cityName) return

    setIsLoadingVenues(true)
    try {
      const response = await get(endpoints.venues.list, {
        city: cityName,
        limit: 4,
        page: 1,
      })
      if (response.success) {
        setVenues(response.data.results)
      }
    } catch (error) {
      console.error('Error searching venues:', error)
      setVenues([])
    } finally {
      setIsLoadingVenues(false)
    }
  }, [])

  // Handle city selection
  const handleCitySelect = (city) => {
    setSelectedCity(city.name)
    setSearchQuery(city.name)
    setShowCityDropdown(false)
    // Venues will be fetched automatically by useVenuesByCity hook
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    searchCities(value)
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    setSelectedCity("")
    setShowCityDropdown(false)
    // Data will be cleared automatically by React Query when dependencies change
  }

  // Effect to search cities when query changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
        searchCities(searchQuery)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery, searchCities])

  // Sports data is automatically fetched by React Query on component mount

  // Click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCityDropdown && !event.target.closest('.search-container')) {
        setShowCityDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showCityDropdown])

  // Fallback sports data if API fails
  const fallbackSports = [
    { name: "Badminton", icon: "🏸", venues: 45, color: "from-red-400 to-red-500" },
    { name: "Tennis", icon: "🎾", venues: 32, color: "from-green-400 to-green-500" },
    { name: "Football", icon: "⚽", venues: 28, color: "from-blue-400 to-blue-500" },
    { name: "Basketball", icon: "🏀", venues: 22, color: "from-orange-400 to-orange-500" },
    { name: "Cricket", icon: "🏏", venues: 18, color: "from-purple-400 to-purple-500" },
    { name: "Table Tennis", icon: "🏓", venues: 35, color: "from-yellow-400 to-yellow-500" },
  ]

  const popularVenues = [
    {
      id: 1,
      name: "SportZone Arena",
      sports: ["Badminton", "Tennis"],
      price: 500,
      location: "Koramangala, Bangalore",
      rating: 4.8,
      reviews: 156,
      image: "/vibrant-sports-arena.png",
      amenities: ["Parking", "Changing Room", "Water"],
      distance: "2.3 km",
      nextSlot: "6:00 PM",
    },
    {
      id: 2,
      name: "Elite Sports Club",
      sports: ["Football", "Basketball"],
      price: 800,
      location: "Indiranagar, Bangalore",
      rating: 4.6,
      reviews: 89,
      image: "/vibrant-sports-club.png",
      amenities: ["AC", "Parking", "Cafeteria"],
      distance: "3.1 km",
      nextSlot: "7:00 PM",
    },
    {
      id: 3,
      name: "Champions Court",
      sports: ["Badminton", "Table Tennis"],
      price: 400,
      location: "Whitefield, Bangalore",
      rating: 4.7,
      reviews: 203,
      image: "/badminton-court.png",
      amenities: ["Parking", "Equipment Rental"],
      distance: "5.2 km",
      nextSlot: "8:00 PM",
    },
    {
      id: 4,
      name: "Victory Grounds",
      sports: ["Cricket", "Football"],
      price: 1200,
      location: "HSR Layout, Bangalore",
      rating: 4.5,
      reviews: 67,
      image: "/cricket-ground.png",
      amenities: ["Floodlights", "Parking", "Changing Room"],
      distance: "4.8 km",
      nextSlot: "9:00 PM",
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-visible">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Hi {user?.name?.split(" ")[0]}! 👋</h1>
            <h2 className="text-xl md:text-3xl font-semibold mb-6">Ready to play your favorite sport?</h2>
            <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Find and book local sports facilities in your area with just a few taps
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl search-container relative z-50">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search venues, sports, or locations..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-32 py-4 text-gray-900 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-lg"
                />
                {isLoadingCities && (
                  <div className="absolute right-28 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  </div>
                )}
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-24 top-1/2 transform -translate-y-1/2 bg-gray-200 text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-400 text-gray-900 px-6 py-2 rounded-xl font-semibold hover:bg-yellow-500 transition-colors shadow-md">
                  Search
                </button>

                {showCityDropdown && (
                  <div className="absolute left-0 top-full mt-2 z-50 w-full bg-white border border-gray-200 rounded-2xl shadow-xl max-h-64 overflow-auto text-left">
                    {isLoadingCities ? (
                      <div className="p-3 text-gray-500 text-sm">Loading cities...</div>
                    ) : cities.length === 0 ? (
                      <div className="p-3 text-gray-500 text-sm">No cities found.</div>
                    ) : (
                      cities.map((city) => (
                        <button
                          key={city._id}
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-800"
                          onClick={() => handleCitySelect(city)}
                        >
                          {city.name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 bg-white -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/my-bookings"
              className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 hover:shadow-lg transition-all transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="bg-green-500 p-3 rounded-2xl shadow-md">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">My Bookings</h3>
                  <p className="text-green-700 text-sm">
                    {user ? "View your upcoming games" : "Login required on next step"}
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/venues"
              className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 hover:shadow-lg transition-all transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-500 p-3 rounded-2xl shadow-md">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Find Venues</h3>
                  <p className="text-blue-700 text-sm">Discover new places to play</p>
                </div>
              </div>
            </Link>

            <Link
              href="/profile"
              className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 hover:shadow-lg transition-all transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="bg-purple-500 p-3 rounded-2xl shadow-md">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-900">My Profile</h3>
                  <p className="text-purple-700 text-sm">
                    {user ? "Update your preferences" : "Login required on next step"}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Sports */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Sport</h2>
            <p className="text-gray-600 text-lg">What would you like to play today?</p>
            {sportsError && (
              <button
                onClick={() => refetchSports()}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                Retry Loading Sports
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {isLoadingSports ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-gray-200 p-6 rounded-3xl animate-pulse">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4 mx-auto"></div>
                </div>
              ))
            ) : sportsError ? (
              // Error state with fallback data
              fallbackSports.map((sport, index) => (
                <Link key={index} href={`/venues?sport=${sport.name.toLowerCase()}`} className="group">
                  <div
                    className={`bg-gradient-to-br ${sport.color} p-6 rounded-3xl text-center hover:shadow-xl transition-all duration-300 transform hover:scale-[1.05] text-white`}
                  >
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {sport.icon}
                    </div>
                    <h3 className="font-semibold mb-1">{sport.name}</h3>
                    <p className="text-sm opacity-90">{sport.venues} venues</p>
                  </div>
                </Link>
              ))
            ) : sports.length > 0 ? (
              // Dynamic sports data
              sports.map((sport, index) => (
                <Link key={index} href={`/venues?sport=${sport.name.toLowerCase()}`} className="group">
                  <div
                    className={`bg-gradient-to-br ${sport.color} p-6 rounded-3xl text-center hover:shadow-xl transition-all duration-300 transform hover:scale-[1.05] text-white`}
                  >
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {sport.icon}
                    </div>
                    <h3 className="font-semibold mb-1">{sport.name}</h3>
                    <p className="text-sm opacity-90">{sport.venues} venues</p>
                  </div>
                </Link>
              ))
            ) : (
              // Fallback data if no sports data
              fallbackSports.map((sport, index) => (
                <Link key={index} href={`/venues?sport=${sport.name.toLowerCase()}`} className="group">
                  <div
                    className={`bg-gradient-to-br ${sport.color} p-6 rounded-3xl text-center hover:shadow-xl transition-all duration-300 transform hover:scale-[1.05] text-white`}
                  >
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {sport.icon}
                    </div>
                    <div className="font-semibold mb-1">{sport.name}</div>
                    <p className="text-sm opacity-90">{sport.venues} venues</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Popular Venues */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {selectedCity ? `Venues in ${selectedCity}` : 'Venues Near You'}
              </h2>
              <p className="text-gray-600 text-lg">
                {selectedCity ? `Top-rated sports facilities in ${selectedCity}` : 'Top-rated sports facilities in your area'}
              </p>
              {selectedCity && isLoadingVenues && (
                <p className="text-blue-600 text-sm mt-2">Loading venues...</p>
              )}
            </div>
            <Link
              href="/venues"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingVenues ? (
              // Loading skeleton for venues
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100">
                  <div className="bg-gray-200 h-48 animate-pulse"></div>
                  <div className="p-5">
                    <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse w-3/4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                      <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : venues.length > 0 ? (
              venues.map((venue) => (
                <Link key={venue._id} href={`/venues/${venue._id}`} className="group">
                  <div className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:scale-[1.02]">
                    <div className="relative">
                      <img
                        src={venue.photoUrls?.[0] || "/placeholder.svg"}
                        alt={venue.venue_name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                        {venue.city}
                      </div>
                      <div className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {venue.venue_status === 'approved' ? 'Available' : 'Pending'}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">{venue.venue_name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{venue.address}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold">{venue.rating?.avg || 0}</span>
                        <span className="text-xs text-gray-500">({venue.rating?.count || 0} reviews)</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {Array.isArray(venue.sports) ? venue.sports.map((sport, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium"
                          >
                            {typeof sport === 'string' ? sport : 'Sport'}
                          </span>
                        )) : (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                            Sports Available
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xl font-bold text-green-600">₹500</span>
                          <span className="text-sm text-gray-500">/hr</span>
                        </div>
                        <div className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold group-hover:bg-blue-700 transition-colors">
                          Book Now
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              popularVenues.map((venue) => (
                <Link key={venue.id} href={`/venues/${venue.id}`} className="group">
                  <div className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:scale-[1.02]">
                    <div className="relative">
                      <img
                        src={venue.image || "/placeholder.svg"}
                        alt={venue.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                        {venue.distance}
                      </div>
                      <div className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Next: {venue.nextSlot}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">{venue.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{venue.location}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold">{venue.rating}</span>
                        <span className="text-xs text-gray-500">({venue.reviews} reviews)</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {venue.sports.map((sport, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium"
                          >
                            {sport}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xl font-bold text-green-600">₹{venue.price}</span>
                          <span className="text-sm text-gray-500">/hr</span>
                        </div>
                        <div className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold group-hover:bg-blue-700 transition-colors">
                          Book Now
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Join Thousands of Players</h2>
            <p className="text-blue-100 text-lg">Be part of the growing sports community</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Sports Venues</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-200">Happy Players</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-200">Bookings Made</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-blue-200">Sports Available</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
