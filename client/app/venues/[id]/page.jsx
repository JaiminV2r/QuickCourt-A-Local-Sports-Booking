"use client"

import { useEffect, useState } from "react"
import { MapPin, Star, ChevronLeft, ChevronRight, Phone, Mail, Share2, Heart, LogIn } from "lucide-react"
import Link from "next/link"
import { useVenueDetails } from "../../../hooks/use-venues"
import { useAuth } from "../../../contexts/auth-context"

export default function SingleVenuePage({ params }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const { user } = useAuth()
  const venueId = params?.id
  const { data: venueResponse, isLoading, error } = useVenueDetails(venueId)
  
  // Extract venue data from API response
  const rawVenue = venueResponse?.data?.venue || null
  const courts = venueResponse?.data?.courts || []
  
  // Map venue properties based on actual API response structure
  const venue = rawVenue ? {
    id: rawVenue._id || rawVenue.id,
    name: rawVenue.venue_name || rawVenue.name || "Unnamed Venue",
    description: rawVenue.description || rawVenue.about || "No description available",
    address: rawVenue.address || "Address not available",
    city: rawVenue.city || "Unknown City",
    phone: rawVenue.phone || "Contact not available",
    email: rawVenue.email || "Email not available",
    venue_type: rawVenue.venue_type || "indoor",
    venue_status: rawVenue.venue_status || rawVenue.status || "pending",
    
    // Handle amenities (could be array or stringified array)
    amenities: (() => {
      if (rawVenue.amenities) {
        if (Array.isArray(rawVenue.amenities)) {
          return rawVenue.amenities
        } else if (typeof rawVenue.amenities === 'string') {
          try {
            return JSON.parse(rawVenue.amenities)
          } catch (e) {
            return [rawVenue.amenities]
          }
        }
      }
      return []
    })(),
    
    // Handle images
    images: rawVenue.images || [],
    gallery: rawVenue.gallery || rawVenue.images?.map(img => ({ url: img, caption: "Venue Image" })) || [],
    
    // Handle rating
    rating: rawVenue.rating?.avg || rawVenue.average_rating || 4.0,
    totalReviews: rawVenue.rating?.count || rawVenue.total_reviews || 0,
    
    // Handle pricing (could be from courts or venue level)
    price: rawVenue.price || rawVenue.base_price || "500",
    
    // Handle sports (extract from courts or use default)
    sports: rawVenue.sports || rawVenue.available_sports || courts?.map(court => court.sport_type).filter((sport, index, arr) => arr.indexOf(sport) === index) || ["General"],
    
    // Handle location
    location: {
      lat: rawVenue.location?.coordinates?.latitude || rawVenue.latitude || 0,
      lng: rawVenue.location?.coordinates?.longitude || rawVenue.longitude || 0,
      address: rawVenue.address || "Address not available"
    },
    
    // Handle reviews
    reviews: rawVenue.reviews || [],
    
    // Handle operating hours
    operatingHours: rawVenue.operating_hours || rawVenue.hours || {
      monday: "6:00 AM - 10:00 PM",
      tuesday: "6:00 AM - 10:00 PM", 
      wednesday: "6:00 AM - 10:00 PM",
      thursday: "6:00 AM - 10:00 PM",
      friday: "6:00 AM - 10:00 PM",
      saturday: "6:00 AM - 10:00 PM",
      sunday: "6:00 AM - 10:00 PM"
    }
  } : null

  useEffect(() => {
    setCurrentImageIndex(0)
  }, [venueId])

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "sports", label: "Sports & Courts" },
    { id: "amenities", label: "Amenities" },
    { id: "reviews", label: "Reviews" },
    { id: "location", label: "Location" },
    { id: "gallery", label: "Gallery" },
  ]

  const nextImage = () => {
    if (!venue?.images?.length) return
    setCurrentImageIndex((prev) => (prev + 1) % venue.images.length)
  }

  const prevImage = () => {
    if (!venue?.images?.length) return
    setCurrentImageIndex((prev) => (prev - 1 + venue.images.length) % venue.images.length)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: venue.name,
        text: venue.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const handleBookNow = () => {
    if (user) {
      // User is logged in, redirect to booking page
      window.location.href = `/venues/${venue.id}/book`
    } else {
      // User is not logged in, redirect to login with redirect back to this page
      window.location.href = "/auth/login?redirect=" + encodeURIComponent(window.location.pathname)
    }
  }

  const handleWriteReview = () => {
    if (user) {
      // User is logged in, redirect to review page or show review form
      alert("Review functionality coming soon!")
    } else {
      // User is not logged in, redirect to login with redirect back to this page
      window.location.href = "/auth/login?redirect=" + encodeURIComponent(window.location.pathname)
    }
  }

  const handleFavorite = () => {
    if (user) {
      // User is logged in, toggle favorite
      setIsFavorite(!isFavorite)
    } else {
      // User is not logged in, show login prompt
      const shouldLogin = confirm("Please login to add this venue to your favorites. Would you like to login now?")
      if (shouldLogin) {
        window.location.href = "/auth/login?redirect=" + encodeURIComponent(window.location.pathname)
      }
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading venue details...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="text-center">
            <p className="text-red-700 font-medium mb-2">Failed to load venue details</p>
            <p className="text-red-600 text-sm">
              {error.message || "Unable to fetch venue information. Please try again."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // No venue found state
  if (!venue) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <div className="text-center">
            <p className="text-gray-700 font-medium mb-2">Venue not found</p>
            <p className="text-gray-600 text-sm mb-4">
              The venue you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/venues"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Other Venues
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/venues" className="hover:text-blue-600 transition-colors">
                Venues
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{venue.name}</span>
            </div>
          </nav>

          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{venue.name}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{venue.rating}</span>
                    <span className="text-gray-600">({venue.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{venue.location.address}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{venue.phone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>{venue.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleFavorite}
                  className={`p-3 rounded-xl border transition-colors ${
                    isFavorite
                      ? "bg-red-50 border-red-200 text-red-600"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                  title={isFavorite ? "Remove from favorites" : user ? "Add to favorites" : "Add to favorites (requires login)"}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  title="Share this venue"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleBookNow}
                  className="bg-blue-600 text-white px-6 md:px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                  title={user ? "Book this venue" : "Book this venue (requires login)"}
                >
                  {user ? (
                    "Book Now"
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      Book Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="mb-6 md:mb-8">
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={venue.images[currentImageIndex] || "/placeholder.svg"}
                alt={`${venue.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-64 md:h-96 object-cover"
              />
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                 {(venue.images || []).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 md:mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-4 md:space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold mb-4">About {venue.name}</h2>
                    <p className="text-gray-600 leading-relaxed">{venue.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-semibold mb-4">Operating Hours</h3>
                    <div className="bg-gray-50 p-4 md:p-6 rounded-2xl">
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(venue.operatingHours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between items-center">
                            <span className="font-medium capitalize">{day}:</span>
                            <span>{hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-semibold mb-4">Quick Info</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 md:p-6 rounded-2xl text-center">
                        <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
                          {courts.length || venue.sports.length}
                        </div>
                        <div className="text-sm text-gray-600">Total Courts</div>
                      </div>
                      <div className="bg-green-50 p-4 md:p-6 rounded-2xl text-center">
                        <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1">
                          ₹{venue.price}
                        </div>
                        <div className="text-sm text-gray-600">Starting Price/hr</div>
                      </div>
                      <div className="bg-yellow-50 p-4 md:p-6 rounded-2xl col-span-2 md:col-span-1">
                        <div className="text-2xl md:text-3xl font-bold text-yellow-600 mb-1">{venue.rating}</div>
                        <div className="text-sm text-gray-600">Rating</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-semibold mb-4">Venue Type & Status</h3>
                    <div className="bg-gray-50 p-4 md:p-6 rounded-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Venue Type:</span>
                          <span className="capitalize">{venue.venue_type}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            venue.venue_status === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {venue.venue_status === 'approved' ? 'Available' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "sports" && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold mb-6">Available Sports & Courts</h2>
                  <div className="space-y-6">
                    {courts.length > 0 ? (
                      // Group courts by sport type
                      Object.entries(
                        courts.reduce((acc, court) => {
                          const sport = court.sport_type || 'General'
                          if (!acc[sport]) acc[sport] = []
                          acc[sport].push(court)
                          return acc
                        }, {})
                      ).map(([sportType, sportCourts]) => (
                        <div key={sportType} className="border border-gray-200 rounded-2xl p-4 md:p-6">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                            <div>
                              <h3 className="text-lg md:text-xl font-semibold mb-2 capitalize">{sportType}</h3>
                              <p className="text-gray-600">{sportCourts.length} court{sportCourts.length > 1 ? 's' : ''} available</p>
                              <div className="mt-2">
                                <p className="text-sm text-gray-500">Court Names:</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {sportCourts.map((court, idx) => (
                                    <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                      {court.court_name?.[0] || `Court ${idx + 1}`}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Starting from</div>
                              <div className="text-xl md:text-2xl font-bold text-green-600">
                                ₹{Math.min(...sportCourts.flatMap(court => 
                                  court.availability?.flatMap(avail => 
                                    avail.time_slots?.map(slot => slot.price) || []
                                  ) || [venue.price]
                                ))}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={handleBookNow}
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                          >
                            {user ? (
                              `Book ${sportType} Court`
                            ) : (
                              <>
                                <LogIn className="w-4 h-4" />
                                Book {sportType} Court
                              </>
                            )}
                          </button>
                        </div>
                      ))
                    ) : (
                      // Fallback to venue sports if no courts data
                      venue.sports.map((sport, index) => (
                        <div key={index} className="border border-gray-200 rounded-2xl p-4 md:p-6">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                            <div>
                              <h3 className="text-lg md:text-xl font-semibold mb-2 capitalize">{sport}</h3>
                              <p className="text-gray-600">Available for booking</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Starting from</div>
                              <div className="text-xl md:text-2xl font-bold text-green-600">
                                ₹{venue.price}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={handleBookNow}
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                          >
                            {user ? (
                              `Book ${sport} Court`
                            ) : (
                              <>
                                <LogIn className="w-4 h-4" />
                                Book {sport} Court
                              </>
                            )}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === "amenities" && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold mb-6">Amenities & Facilities</h2>
                  <div className="flex flex-wrap gap-2">
                    {(venue.amenities || []).map((amenity, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-3 py-2 rounded-xl text-sm">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-0">Reviews & Ratings</h2>
                    <button 
                      onClick={handleWriteReview}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      {user ? (
                        "Write Review"
                      ) : (
                        <>
                          <LogIn className="w-4 h-4" />
                          Write Review
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center gap-6 p-6 bg-gray-50 rounded-2xl">
                      <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{venue.rating}</div>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(venue.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-gray-600">{venue.totalReviews} reviews</div>
                      </div>
                      <div className="flex-1">
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-3">
                              <span className="text-sm w-8">{rating}★</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-yellow-400 h-2 rounded-full"
                                  style={{
                                    width: `${
                                      rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 8 : rating === 2 ? 2 : 0
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 w-8">
                                {rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 8 : rating === 2 ? 2 : 0}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {venue.reviews.map((review) => (
                      <div key={review.id} className="border border-gray-200 rounded-2xl p-4 md:p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-semibold text-blue-600 flex-shrink-0">
                            {review.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{review.user}</h4>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-3">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "location" && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold mb-6">Location & Address</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 md:p-6 rounded-2xl">
                      <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                      <p className="text-gray-700">{venue.location.address}</p>
                      <div className="mt-2 text-sm text-gray-600">
                        <p>City: {venue.location.city}</p>
                        <p>State: {venue.location.state}</p>
                        <p>Pincode: {venue.location.pincode}</p>
                      </div>
                    </div>
                    <div className="bg-gray-200 h-64 md:h-80 rounded-2xl flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Interactive map would be integrated here</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-2xl">
                        <h4 className="font-semibold text-blue-900 mb-2">Public Transport</h4>
                        <p className="text-blue-700 text-sm">Koramangala Metro Station - 500m</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-2xl">
                        <h4 className="font-semibold text-green-900 mb-2">Parking</h4>
                        <p className="text-green-700 text-sm">Free parking available</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "gallery" && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold mb-6">Photo Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {venue.gallery.map((item, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={item.url || "/placeholder.svg"}
                          alt={item.caption}
                          className="w-full h-48 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-2xl"></div>
                        <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="font-medium">{item.caption}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 sticky top-8">
                <h3 className="text-lg md:text-xl font-semibold mb-4">Quick Booking</h3>
                <div className="space-y-4 mb-6">
                  {courts.length > 0 ? (
                    // Group courts by sport type for sidebar
                    Object.entries(
                      courts.reduce((acc, court) => {
                        const sport = court.sport_type || 'General'
                        if (!acc[sport]) {
                          acc[sport] = {
                            count: 0,
                            minPrice: Infinity
                          }
                        }
                        acc[sport].count++
                        
                        // Find minimum price from availability
                        const courtPrices = court.availability?.flatMap(avail => 
                          avail.time_slots?.map(slot => slot.price) || []
                        ) || []
                        
                        if (courtPrices.length > 0) {
                          acc[sport].minPrice = Math.min(acc[sport].minPrice, ...courtPrices)
                        } else {
                          acc[sport].minPrice = Math.min(acc[sport].minPrice, parseInt(venue.price))
                        }
                        
                        return acc
                      }, {})
                    ).map(([sportType, sportInfo]) => (
                      <div key={sportType} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <div>
                          <span className="font-medium capitalize">{sportType}</span>
                          <div className="text-sm text-gray-500">{sportInfo.count} court{sportInfo.count > 1 ? 's' : ''}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-green-600 font-semibold">₹{sportInfo.minPrice === Infinity ? venue.price : sportInfo.minPrice}</span>
                          <div className="text-xs text-gray-500">/hr</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Fallback to venue sports
                    venue.sports.map((sport, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <div>
                          <span className="font-medium capitalize">{sport}</span>
                          <div className="text-sm text-gray-500">Available</div>
                        </div>
                        <div className="text-right">
                          <span className="text-green-600 font-semibold">₹{venue.price}</span>
                          <div className="text-xs text-gray-500">/hr</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <button
                  onClick={handleBookNow}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-center block flex items-center justify-center gap-2"
                >
                  {user ? (
                    "Book Now"
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      Book Now
                    </>
                  )}
                </button>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold mb-3">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{venue.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{venue.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}
