"use client"

import Link from "next/link"
import { Shield, FileText, AlertTriangle, CheckCircle } from "lucide-react"

export default function TermsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Terms of Service</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Please read these terms carefully before using QuickCourt services
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8 rounded-r-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Important Notice</h3>
                  <p className="text-blue-800">
                    By using QuickCourt, you agree to be bound by these Terms of Service. 
                    If you do not agree to these terms, please do not use our services.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 mb-6">
              These Terms of Service ("Terms") govern your use of the QuickCourt platform, website, and mobile application 
              (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms and 
              all applicable laws and regulations.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              2. Description of Service
            </h2>
            <p className="text-gray-700 mb-6">
              QuickCourt is a platform that connects sports facility owners with individuals seeking to book sports facilities. 
              We provide booking management, payment processing, and related services to facilitate these connections.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. User Accounts</h2>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-gray-700">
                  You must create an account to use certain features of the Service. You are responsible for maintaining 
                  the confidentiality of your account credentials.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-gray-700">
                  You must provide accurate, current, and complete information when creating your account and keep it updated.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-gray-700">
                  You are responsible for all activities that occur under your account.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Booking and Payment</h2>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-gray-700">
                  All bookings are subject to availability and confirmation by the facility owner.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-gray-700">
                  Payment is processed securely through our platform. Prices are set by facility owners and may vary.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-gray-700">
                  Cancellation policies are determined by individual facilities and will be clearly communicated during booking.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. User Conduct</h2>
            <p className="text-gray-700 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-700">
              <li>Use the Service for any unlawful purpose or in violation of these Terms</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Use automated systems to access the Service without permission</li>
              <li>Harass, abuse, or harm other users</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Facility Owner Responsibilities</h2>
            <p className="text-gray-700 mb-6">
              Facility owners are responsible for maintaining accurate facility information, managing availability, 
              providing the services as described, and complying with all applicable laws and regulations.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Disclaimers and Limitations</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <p className="text-gray-700 mb-4">
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. QUICKCOURT DISCLAIMS ALL WARRANTIES, 
                EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
                PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p className="text-gray-700">
                QUICKCOURT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES 
                ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICE.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Privacy and Data Protection</h2>
            <p className="text-gray-700 mb-6">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, 
              to understand our practices regarding the collection and use of your information.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Intellectual Property</h2>
            <p className="text-gray-700 mb-6">
              The Service and its original content, features, and functionality are owned by QuickCourt and are protected 
              by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Termination</h2>
            <p className="text-gray-700 mb-6">
              We may terminate or suspend your account and access to the Service at any time, with or without cause, 
              with or without notice. You may terminate your account at any time by contacting us.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">11. Changes to Terms</h2>
            <p className="text-gray-700 mb-6">
              We reserve the right to modify these Terms at any time. We will notify users of any material changes 
              by posting the new Terms on the Service. Your continued use of the Service after such changes constitutes 
              acceptance of the new Terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">12. Governing Law</h2>
            <p className="text-gray-700 mb-6">
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising 
              from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts 
              in Bangalore, Karnataka.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">13. Contact Information</h2>
            <p className="text-gray-700 mb-6">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> legal@quickcourt.com<br />
                <strong>Address:</strong> QuickCourt Legal Department<br />
                123 Sports Avenue, Tech Park<br />
                Bangalore, Karnataka 560001<br />
                India
              </p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mt-8 rounded-r-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">Last Updated</h3>
                  <p className="text-yellow-800">
                    These Terms of Service were last updated on January 1, 2024. 
                    Please check back periodically for updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Questions About These Terms?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Our legal team is here to help clarify any questions you may have
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-lg"
            >
              Contact Us
            </Link>
            <Link
              href="/privacy"
              className="bg-gray-100 text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-lg"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
