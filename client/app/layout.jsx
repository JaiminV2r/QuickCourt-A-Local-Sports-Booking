import { AuthProvider } from "../contexts/auth-context"
import QueryProvider from "../contexts/query-provider"
import "./globals.css"

export const metadata = {
  title: "QuickCourt - Local Sports Booking",
  description: "Book local sports facilities and connect with players in your area",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <QueryProvider>{children}</QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
