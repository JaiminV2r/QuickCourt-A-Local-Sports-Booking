import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export function FacilitySearchFilters({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
  sortBy,
  onSortChange,
  resultCount,
  totalCount,
  onClearFilters,
  className
}) {
  const filterOptions = [
    { value: "all", label: "All Facilities" },
    { value: "withImages", label: "With Images" },
    { value: "withAmenities", label: "With Amenities" },
    { value: "withRevenue", label: "With Revenue" }
  ]

  const sortOptions = [
    { value: "date", label: "Sort by Date" },
    { value: "name", label: "Sort by Name" },
    { value: "courts", label: "Sort by Courts" },
    { value: "revenue", label: "Sort by Revenue" },
    { value: "rating", label: "Sort by Rating" }
  ]

  const hasActiveFilters = searchQuery || filterStatus !== "all"

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search facilities, owners, locations, or emails..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters and Sort */}
          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={onFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary and Clear Filters */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>
              Showing {resultCount} of {totalCount} facilities
            </span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                Filtered
              </Badge>
            )}
          </div>
          
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="text-gray-600 hover:text-gray-800"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
