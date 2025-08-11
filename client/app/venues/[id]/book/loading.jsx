export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Progress Skeleton */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                {i < 3 && <div className="w-16 h-1 bg-gray-200 mx-2"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Form Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-6">
            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-gray-200 rounded-2xl"></div>
                <div className="h-20 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
              <div className="grid grid-cols-7 gap-2">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded-2xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
