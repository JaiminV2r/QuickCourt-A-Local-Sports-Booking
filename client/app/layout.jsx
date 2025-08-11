"use client"
import Layout from "../components/layout"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { AuthProvider } from "../contexts/auth-context"
import QueryProvider from "../contexts/query-provider"
import "./globals.css"


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <QueryProvider>
          <AuthProvider>
            <Layout>{children}</Layout>
            <ToastContainer position="top-right" autoClose={4000} newestOnTop theme="light" closeOnClick pauseOnHover />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
