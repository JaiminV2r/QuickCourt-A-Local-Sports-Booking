"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, HelpCircle, BookOpen, CreditCard, User, Settings, MessageCircle, Phone, Mail, ChevronDown, ChevronUp } from "lucide-react"

export default function HelpPage() {
  const [expandedSections, setExpandedSections] = useState({})

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-blue-500',
      questions: [
        {
          question: "How do I create an account?",
          answer: "Creating an account is easy! Click the 'Sign Up' button in the top right corner, fill in your details, and verify your email address. You'll be ready to start booking in minutes."
        },
        {
          question: "What sports facilities can I book?",
          answer: "We offer a wide range of sports facilities including badminton courts, tennis courts, football grounds, basketball courts, cricket grounds, and table tennis facilities. New sports are added regularly!"
        },
        {
          question: "How do I search for venues?",
          answer: "Use our search bar to find venues by location, sport type, or venue name. You can also filter results by price, rating, and availability to find the perfect match."
        }
      ]
    },
    {
      id: 'bookings',
      title: 'Bookings & Reservations',
      icon: <CreditCard className="w-6 h-6" />,
      color: 'bg-green-500',
      questions: [
        {
          question: "How do I make a booking?",
          answer: "Select your preferred venue, choose an available time slot, review the details, and complete the payment. You'll receive a confirmation email with all the booking details."
        },
        {
          question: "Can I cancel my booking?",
          answer: "Yes, you can cancel bookings up to 24 hours before the scheduled time through your account dashboard. Cancellation policies may vary by venue."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, debit cards, UPI, net banking, and digital wallets including Paytm, PhonePe, and Google Pay."
        }
      ]
    },
    {
      id: 'account',
      title: 'Account & Profile',
      icon: <User className="w-6 h-6" />,
      color: 'bg-purple-500',
      questions: [
        {
          question: "How do I update my profile information?",
          answer: "Go to your profile page and click 'Edit Profile'. You can update your personal information, preferences, and profile picture at any time."
        },
        {
          question: "Can I change my email address?",
          answer: "Yes, you can change your email address in your profile settings. You'll need to verify the new email address before the change takes effect."
        },
        {
          question: "How do I reset my password?",
          answer: "Click 'Forgot Password' on the login page, enter your email address, and follow the instructions sent to your email to create a new password."
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Support',
      icon: <Settings className="w-6 h-6" />,
      color: 'bg-orange-500',
      questions: [
        {
          question: "The app is not loading properly",
          answer: "Try refreshing the page, clearing your browser cache, or updating to the latest version. If the problem persists, contact our support team."
        },
        {
          question: "I can't complete my payment",
          answer: "Ensure your payment method is valid and has sufficient funds. If you continue to have issues, try a different payment method or contact our support team."
        },
        {
          question: "How do I report a bug?",
          answer: "Use our contact form or email support@quickcourt.com with details about the issue. Include screenshots if possible to help us resolve it quickly."
        }
      ]
    }
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Help Center</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
            Find answers to your questions and get the support you need
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles..."
                className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Help Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">How Can We Help You?</h2>
            <p className="text-xl text-gray-600">
              Choose a category below to find the answers you need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((category) => (
              <div key={category.id} className="text-center p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition-all">
                <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <div className="text-white">
                    {category.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{category.title}</h3>
                <Link
                  href={`#${category.id}`}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Browse Questions
                  <ChevronDown className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {helpCategories.map((category) => (
            <div key={category.id} id={category.id} className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <div className={`${category.color} w-8 h-8 rounded-full flex items-center justify-center`}>
                  <div className="text-white">
                    {category.icon}
                  </div>
                </div>
                {category.title}
              </h2>

              <div className="space-y-4">
                {category.questions.map((item, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <button
                      onClick={() => toggleSection(`${category.id}-${index}`)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{item.question}</span>
                      {expandedSections[`${category.id}-${index}`] ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    
                    {expandedSections[`${category.id}-${index}`] && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Still Need Help?</h2>
          <p className="text-xl text-gray-600 mb-12">
            Our support team is here to help you with any questions or issues
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">Get instant help from our support team</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Start Chat
              </button>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">Send us a detailed message</p>
              <Link
                href="/contact"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors inline-block"
              >
                Send Email
              </Link>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600 mb-4">Call us for immediate assistance</p>
              <a
                href="tel:+91-80-1234-5678"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors inline-block"
              >
                Call Now
              </a>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Support Hours</h3>
            <p className="text-gray-600 mb-4">
              Our support team is available to help you during the following hours:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM IST<br />
                <strong>Saturday:</strong> 10:00 AM - 4:00 PM IST
              </div>
              <div>
                <strong>Sunday:</strong> Closed<br />
                <strong>Emergency:</strong> Available 24/7 for critical issues
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Additional Resources</h2>
          <p className="text-xl text-gray-600 mb-12">
            Explore more helpful content and guides
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">User Guide</h3>
              <p className="text-gray-600 mb-6">
                Comprehensive guide covering all features and functionality of QuickCourt
              </p>
              <Link
                href="/guide"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Read Guide
                <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Video Tutorials</h3>
              <p className="text-gray-600 mb-6">
                Step-by-step video guides to help you get the most out of QuickCourt
              </p>
              <Link
                href="/tutorials"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Watch Videos
                <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of players who are already enjoying seamless sports facility bookings
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/venues"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-lg"
            >
              Find Venues
            </Link>
            <Link
              href="/contact"
              className="bg-gray-100 text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-lg"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
