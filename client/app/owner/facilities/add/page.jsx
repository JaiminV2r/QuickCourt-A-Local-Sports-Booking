
"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import BasicInfoAndAmenitiesForm from "../../../../components/facilities/BasicInfoAndAmenitiesForm"
import SportsAndCourtsForm from "../../../../components/facilities/SportsAndCourtsForm"

export default function AddFacilityPage() {
  const [step, setStep] = useState(1)
  const [venueId, setVenueId] = useState(null)
  const searchParams = useSearchParams()
  const editId = searchParams.get("id")
  const isEditMode = Boolean(editId)
  const router = useRouter()

  const initialValues = {
    name: "",
    description: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    about: "A premium sports facility with multiple courts",
    venue_type: "indoor",
    sports: [],
    courts: [],
    amenities: [],
  }

  const [formInitialValues, setFormInitialValues] = useState(initialValues)

  useEffect(() => {
    if (!isEditMode) return
    
    const mockFacility = (() => {
      if (editId === "1") {
        return {
          name: "SportZone Arena",
          address: "123 Sports Complex, Mumbai",
          city: "Mumbai",
          phone: "+91 9876543210",
          email: "",
          about: "A premium sports facility with multiple courts",
          venue_type: "indoor",
          sports: ["Badminton", "Tennis"],
          amenities: ["Parking", "AC"],
        }
      }
      if (editId === "2") {
        return {
          name: "Elite Sports Club",
          address: "456 Elite Street, Delhi",
          city: "Delhi",
          phone: "+91 9876543210",
          email: "",
          about: "Elite sports facility for professional players",
          venue_type: "outdoor",
          sports: ["Football", "Cricket"],
          amenities: ["Parking", "Floodlights"],
        }
      }
      return {
        name: "Champions Court",
        address: "789 Victory Lane, Bangalore",
        city: "Bangalore",
        phone: "+91 9876543210",
        email: "",
        about: "Champions Court - where winners are made",
        venue_type: "indoor",
        sports: ["Badminton", "Table Tennis"],
        amenities: ["WiFi", "Water"],
      }
    })()

    const makeEmptyPricing = () => ({
      sun: [{ startTime: "", endTime: "", price: "" }],
      mon: [{ startTime: "", endTime: "", price: "" }],
      tue: [{ startTime: "", endTime: "", price: "" }],
      wed: [{ startTime: "", endTime: "", price: "" }],
      thu: [{ startTime: "", endTime: "", price: "" }],
      fri: [{ startTime: "", endTime: "", price: "" }],
      sat: [{ startTime: "", endTime: "", price: "" }],
    })

    const courtsFromSports = mockFacility.sports.map((sport, idx) => ({
      id: Date.now() + idx,
      sport,
      name: `${sport} Court 1`,
      pricing: makeEmptyPricing(),
    }))

    setFormInitialValues((prev) => ({
      ...prev,
      ...initialValues,
      ...mockFacility,
      courts: courtsFromSports,
    }))
  }, [isEditMode, editId])

  const handleStep1Success = (data) => {
    setVenueId(data.id) // Assuming the API response contains the venue ID
    setStep(2)
  }

  const handleStep2Success = () => {
    router.push("/owner/facilities")
  }

  const handleBackToStep1 = () => {
    setStep(1)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/owner/facilities" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Facilities
        </Link>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {[1, 2].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= stepNumber ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 2 && (
                <div className={`w-16 h-1 mx-2 ${step > stepNumber ? "bg-blue-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <div className="flex justify-center gap-4 text-sm">
            <span className={step >= 1 ? "text-blue-600 font-medium" : "text-gray-500"}>Basic Info & Amenities</span>
            <span className={step >= 2 ? "text-blue-600 font-medium" : "text-gray-500"}>Sports & Courts</span>
          </div>
        </div>
      </div>

      {/* Render the appropriate form based on step */}
      {step === 1 && (
        <BasicInfoAndAmenitiesForm 
          initialValues={formInitialValues} 
          onSuccess={handleStep1Success} 
          isEditMode={isEditMode} 
          venueId={editId || venueId}
        />
      )}
      
      {step === 2 && (
        <SportsAndCourtsForm 
          initialValues={formInitialValues} 
          onSuccess={handleStep2Success} 
          onBack={handleBackToStep1}
          venueId={venueId}
        />
      )}
    </div>
  )
}