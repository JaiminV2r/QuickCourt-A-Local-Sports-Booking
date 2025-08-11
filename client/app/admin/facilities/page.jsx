"use client"

import { useState } from "react"
import { 
  useApproveFacilityMutation, 
  useRejectFacilityMutation 
} from "@/actions/facilities"
import { 
  AlertCircle,
  Loader2,
  RefreshCw,
  Clock,
  Activity,
  Award,
  Ban,
  X,
  Users,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Star,
  Eye,
  Check,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { useFacilitiesManagement } from "@/hooks/use-facilities"
import { FacilityCard } from "@/components/facility-card"
import { StatsCard, StatsGrid } from "@/components/stats-card"
import { FacilitySearchFilters } from "@/components/facility-search-filters"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog"
import { DialogHeader } from "@/components/ui/dialog"

export default function AdminFacilitiesPage() {
  const [rejectReason, setRejectReason] = useState("")
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [facilityToReject, setFacilityToReject] = useState(null)
  const { toast } = useToast()

  // Custom hook for facilities management
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    facilities,
    stats,
    isLoading,
    isFetching,
    error,
    refreshAllData,
    refreshCurrentTab
  } = useFacilitiesManagement()

  // Mutations with proper error handling
  const approveMutation = useApproveFacilityMutation()
  const rejectMutation = useRejectFacilityMutation()

  // Refresh all data with toast feedback
  const handleRefreshAllData = async () => {
    try {
      const success = await refreshAllData()
      if (success) {
        toast({
          title: "Data refreshed",
          description: "All facility data has been updated successfully.",
        })
      } else {
        toast({
          title: "Refresh failed",
          description: "Failed to refresh facility data. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Failed to refresh facility data. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle approve with better UX
  const handleApprove = async (facilityId, facilityName) => {
    try {
      await approveMutation.mutateAsync({ id: facilityId, comment: '' })
      toast({
        title: "Facility approved",
        description: `${facilityName} has been approved successfully.`,
      })
      setSelectedFacility(null) // Clear any previous selections
    } catch (error) {
      toast({
        title: "Approval failed",
        description: error.message || "Failed to approve facility. Please try again.",
        variant: "destructive",
      })
    }
  }
  

  // Handle reject with better UX
  const handleReject = async (facilityId, facilityName, reason) => {
    if (!reason?.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      })
      return
    }
  
    try {
      await rejectMutation.mutateAsync({ id: facilityId, reason: reason.trim() })
      toast({
        title: "Facility rejected",
        description: `${facilityName} has been rejected with reason: ${reason}`,
      })
      setSelectedFacility(null)
      setShowRejectDialog(false)
      setFacilityToReject(null)
      setRejectReason("")
    } catch (error) {
      toast({
        title: "Rejection failed",
        description: error.message || "Failed to reject facility. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Open reject dialog
  const openRejectDialog = (facility) => {
    setFacilityToReject(facility)
    setShowRejectDialog(true)
  }

  // Clear filters function
  const handleClearFilters = () => {
    setSearchQuery("")
    setFilterStatus("all")
    setSortBy("date")
  }

  // Loading skeleton component
  const FacilitySkeleton = () => (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // Error component
  const ErrorDisplay = ({ error, onRetry }) => (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>Failed to load facilities: {error?.message || "Unknown error"}</span>
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  )



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
      {/* Header with refresh button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Facility Management</h1>
          <p className="text-gray-600 text-lg">Review and manage sports facility applications</p>
        </div>
        <Button 
          onClick={handleRefreshAllData} 
          disabled={isFetching}
          variant="outline"
          className="flex items-center gap-2"
        >
          {isFetching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsGrid>
        <StatsCard
          title="Pending Approval"
          value={stats.totalPending}
          icon={Clock}
          color="yellow"
          trend="up"
          trendValue="+2 this week"
        />
        <StatsCard
          title="Approved"
          value={stats.totalApproved}
          icon={Award}
          color="green"
          trend="up"
          trendValue="+5 this month"
        />
        <StatsCard
          title="Rejected"
          value={stats.totalRejected}
          icon={Ban}
          color="red"
          trend="down"
          trendValue="-1 this week"
        />
        <StatsCard
          title="Total Applications"
          value={stats.totalFacilities}
          icon={Activity}
          color="blue"
        />
      </StatsGrid>

      {/* Search and Filters */}
      <FacilitySearchFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        sortBy={sortBy}
        onSortChange={setSortBy}
        resultCount={facilities.length}
        totalCount={stats.totalFacilities}
        onClearFilters={handleClearFilters}
      />

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending Approval
            {/* <Badge variant="secondary" className="ml-1">{totalPending}</Badge> */}
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Approved
            {/* <Badge variant="secondary" className="ml-1">{totalApproved}</Badge> */}
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <Ban className="w-4 h-4" />
            Rejected
            {/* <Badge variant="secondary" className="ml-1">{totalRejected}</Badge> */}
          </TabsTrigger>
        </TabsList>

        {/* Error Display */}
        {error && (
          <ErrorDisplay 
            error={error} 
            onRetry={refreshCurrentTab}
          />
        )}

        {/* Facilities List */}
        <TabsContent value={activeTab} className="space-y-4">
        {console.log('🔥🔥🔥🔥facilities🔥🔥🔥🔥🔥',facilities)}

          {isLoading ? (
            // Loading skeletons
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <FacilitySkeleton key={i} />
              ))}
            </div>
          ) : facilities.length === 0 ? (
            // Empty state
            <Card className="text-center py-12">
              <CardContent>
                <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No facilities found</h3>
                <p className="text-gray-600">
                  {searchQuery || filterStatus !== "all" 
                    ? "No facilities match the selected criteria." 
                    : `No ${activeTab} facilities at the moment.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            // Facilities list
            <div className="space-y-4">
              {facilities.map((facility) => (
                <Card key={facility.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      {/* Facility Info */}
                      <div className="flex-1 space-y-4">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div>
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
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              Description
                            </h4>
                            <p className="text-sm text-gray-600">{facility.description}</p>
                          </div>
                        )}

                        {/* Additional Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {activeTab === "pending" && `Submitted: ${facility.submittedDate}`}
                              {activeTab === "approved" && `Approved: ${facility.approvedDate}`}
                              {activeTab === "rejected" && `Rejected: ${facility.rejectedDate}`}
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
                                {typeof facility.rating === 'object' ? (
  facility.rating.avg > 0 && (
    <>
      <span>•</span>
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-500 fill-current" />
        <span className="text-yellow-600 font-medium">
          {facility.rating.avg.toFixed(1)} ({facility.rating.count})
        </span>
      </div>
    </>
  )
) : (
  facility.rating > 0 && (
    <>
      <span>•</span>
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-500 fill-current" />
        <span className="text-yellow-600 font-medium">
          {facility.rating.toFixed(1)}
        </span>
      </div>
    </>
  )
)}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Rejection Reason */}
                        {facility.rejectionReason && (
                          <Alert className="border-red-200 bg-red-50">
                            <AlertCircle className="h-4 w-4 text-red-600" />
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
                                      onClick={() => handleApprove(facility.id, facility.name)}
                                      disabled={approveMutation.isPending}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      {approveMutation.isPending ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      ) : (
                                        <Check className="w-4 h-4 mr-2" />
                                      )}
                                      Approve
                                    </Button>
                                    <Button
                                      onClick={() => openRejectDialog(facility)}
                                      disabled={rejectMutation.isPending}
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
  onClick={() => handleApprove(facility.id, facility.name)}
  disabled={approveMutation.isPending}
  className="w-full bg-green-600 hover:bg-green-700"
>
  {approveMutation.isPending ? (
    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
  ) : (
    <Check className="w-4 h-4 mr-2" />
  )}
  Approve
</Button>
                            
                            <Button
                              onClick={() => openRejectDialog(facility)}
                              disabled={rejectMutation.isPending}
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
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Reject Facility Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Facility</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting {facilityToReject?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectDialog(false)
                  setFacilityToReject(null)
                  setRejectReason("")
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleReject(facilityToReject?.id, facilityToReject?.name, rejectReason)}
                disabled={!rejectReason.trim() || rejectMutation.isPending}
              >
                {rejectMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <X className="w-4 h-4 mr-2" />
                )}
                Reject Facility
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
