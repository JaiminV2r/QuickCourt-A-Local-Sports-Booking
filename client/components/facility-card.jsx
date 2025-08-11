import { 
  Eye, 
  Check, 
  X, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  Building, 
  Star,
  DollarSign,
  Users,
  Award,
  Ban,
  ImageIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

export function FacilityCard({ 
  facility, 
  activeTab, 
  onApprove, 
  onReject, 
  onViewDetails,
  isSelectionMode = false,
  isSelected = false,
  onToggleSelection,
  approveLoading = false,
  rejectLoading = false
}) {
  const getStatusBadge = () => {
    switch (activeTab) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>
      default:
        return null
    }
  }

  const getDateInfo = () => {
    switch (activeTab) {
      case "pending":
        return { label: "Submitted", date: facility.submittedDate, icon: Calendar }
      case "approved":
        return { label: "Approved", date: facility.approvedDate, icon: Calendar }
      case "rejected":
        return { label: "Rejected", date: facility.rejectedDate, icon: Calendar }
      default:
        return { label: "Date", date: "", icon: Calendar }
    }
  }

  const dateInfo = getDateInfo()
  const DateIcon = dateInfo.icon

  return (
    <Card className={cn(
      "hover:shadow-md transition-shadow",
      isSelectionMode && "cursor-pointer",
      isSelected && "ring-2 ring-blue-500"
    )}>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Facility Info */}
          <div className="flex-1 space-y-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  {isSelectionMode && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelection?.(facility.id)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{facility.name}</h3>
                    <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{facility.owner}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{facility.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{facility.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{facility.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge()}
              </div>
            </div>

            {/* Sports & Courts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Sports & Courts
                </h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {facility.sports?.map((sport, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                      {sport}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{facility.courts} courts total</span>
                </div>
              </div>

              {/* Amenities */}
              {facility.amenities && facility.amenities.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Amenities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {facility.amenities.slice(0, 4).map((amenity, index) => (
                      <Badge key={index} variant="outline">
                        {amenity}
                      </Badge>
                    ))}
                    {facility.amenities.length > 4 && (
                      <Badge variant="outline">
                        +{facility.amenities.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {facility.description && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-sm text-gray-600">{facility.description}</p>
              </div>
            )}

            {/* Additional Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <DateIcon className="w-4 h-4" />
                <span>
                  {dateInfo.label}: {dateInfo.date}
                </span>
              </div>
              
              {facility.totalBookings && (
                <>
                  <span>•</span>
                  <span>{facility.totalBookings} bookings</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-green-600 font-medium">{facility.monthlyRevenue}</span>
                  </div>
                </>
              )}
              
              {facility.rating && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-yellow-600 font-medium">
                      {typeof facility.rating === 'object' && facility.rating.avg 
                        ? `${facility.rating.avg.toFixed(1)} (${facility.rating.count})`
                        : facility.rating}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Rejection Reason */}
            {facility.rejectionReason && (
              <Alert className="border-red-200 bg-red-50">
                <Ban className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Rejection Reason:</strong> {facility.rejectionReason}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 lg:ml-6">
            {activeTab === "pending" && (
              <>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{facility.name}</DialogTitle>
                      <DialogDescription>
                        Review facility details before making a decision
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      {/* Owner Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold mb-3">Owner Information</h3>
                          <div className="space-y-2 text-sm">
                            <p><strong>Name:</strong> {facility.owner}</p>
                            <p><strong>Email:</strong> {facility.email}</p>
                            <p><strong>Phone:</strong> {facility.phone}</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-3">Facility Details</h3>
                          <div className="space-y-2 text-sm">
                            <p><strong>Location:</strong> {facility.location}</p>
                            <p><strong>Address:</strong> {facility.address}</p>
                            <p><strong>Courts:</strong> {facility.courts}</p>
                          </div>
                        </div>
                      </div>

                      {/* Images */}
                      {facility.images && facility.images.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            Facility Images
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {facility.images.map((image, index) => (
                              <img
                                key={index}
                                src={image || "/placeholder.svg"}
                                alt={`${facility.name} - Image ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                          onClick={() => onApprove?.(facility.id, facility.name)}
                          disabled={approveLoading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => onReject?.(facility.id, facility.name)}
                          disabled={rejectLoading}
                          variant="destructive"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button
                  onClick={() => onApprove?.(facility.id, facility.name)}
                  disabled={approveLoading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                
                <Button
                  onClick={() => onReject?.(facility.id, facility.name)}
                  disabled={rejectLoading}
                  variant="outline"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
            
            {activeTab === "approved" && (
              <>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{facility.name}</DialogTitle>
                      <DialogDescription>
                        Approved facility details
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      {/* Same content as pending but without action buttons */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold mb-3">Owner Information</h3>
                          <div className="space-y-2 text-sm">
                            <p><strong>Name:</strong> {facility.owner}</p>
                            <p><strong>Email:</strong> {facility.email}</p>
                            <p><strong>Phone:</strong> {facility.phone}</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-3">Facility Details</h3>
                          <div className="space-y-2 text-sm">
                            <p><strong>Location:</strong> {facility.location}</p>
                            <p><strong>Address:</strong> {facility.address}</p>
                            <p><strong>Courts:</strong> {facility.courts}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <div className="text-center">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Approved
                  </Badge>
                </div>
              </>
            )}
            
            {activeTab === "rejected" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{facility.name}</DialogTitle>
                    <DialogDescription>
                      Rejected facility details
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* Same content as pending but without action buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3">Owner Information</h3>
                        <div className="space-y-2 text-sm">
                          <p><strong>Name:</strong> {facility.owner}</p>
                          <p><strong>Email:</strong> {facility.email}</p>
                          <p><strong>Phone:</strong> {facility.phone}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3">Facility Details</h3>
                        <div className="space-y-2 text-sm">
                          <p><strong>Location:</strong> {facility.location}</p>
                          <p><strong>Address:</strong> {facility.address}</p>
                          <p><strong>Courts:</strong> {facility.courts}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
