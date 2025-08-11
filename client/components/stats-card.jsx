import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend, 
  trendValue,
  description,
  className 
}) {
  const getColorClasses = (color) => {
    const colorMap = {
      'yellow': 'border-l-yellow-500 text-yellow-600 bg-yellow-50',
      'green': 'border-l-green-500 text-green-600 bg-green-50',
      'red': 'border-l-red-500 text-red-600 bg-red-50',
      'blue': 'border-l-blue-500 text-blue-600 bg-blue-50',
      'purple': 'border-l-purple-500 text-purple-600 bg-purple-50',
      'indigo': 'border-l-indigo-500 text-indigo-600 bg-indigo-50',
      'pink': 'border-l-pink-500 text-pink-600 bg-pink-50',
      'gray': 'border-l-gray-500 text-gray-600 bg-gray-50'
    }
    return colorMap[color] || colorMap['blue']
  }

  const colorClasses = getColorClasses(color)
  const [borderColor, textColor, bgColor] = colorClasses.split(' ')

  return (
    <Card className={cn("border-l-4 transition-all duration-200 hover:shadow-md", borderColor, className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={cn("text-2xl font-bold", textColor)}>
              {value}
            </CardTitle>
            <CardDescription className="text-gray-600">{title}</CardDescription>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
          <div className={cn("p-3 rounded-full", bgColor)}>
            <Icon className={cn("w-6 h-6", textColor)} />
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs mt-2">
            {trend === "up" ? (
              <TrendingUp className="w-3 h-3 text-green-600" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-600" />
            )}
            <span className={trend === "up" ? "text-green-600" : "text-red-600"}>
              {trendValue}
            </span>
          </div>
        )}
      </CardHeader>
    </Card>
  )
}

export function StatsGrid({ children, className }) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6", className)}>
      {children}
    </div>
  )
}
