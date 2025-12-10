import {
  HomeIcon,
  KeyIcon,
  BuildingIcon,
  ShieldCheckIcon,
  MessageSquareIcon,
  BellIcon,
} from 'lucide-react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function Services() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user)
    })

    return () => unsubscribe() 
  }, [])

  return (
    <div>
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Platform Features
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Everything you need to buy or sell property directly. Our platform
              provides the tools and security for successful real estate
              transactions.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mb-6">
                <HomeIcon className="w-8 h-8 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">For Buyers</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Discover your perfect property from thousands of verified listings across Addis Ababa.
              </p>
              <ul className="space-y-3 text-gray-600">
                {[
                  "Advanced search with filters by location, price, and features",
                  "Save favorite properties and get alerts for new listings",
                  "Direct messaging with property owners",
                  "Detailed property information with photos and descriptions",
                  "No commission fees or hidden charges",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mb-6">
                <KeyIcon className="w-8 h-8 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">For Sellers</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                List your property and reach thousands of potential buyers. Create detailed listings with photos and manage inquiries all in one place.
              </p>
              <ul className="space-y-3 text-gray-600">
                {[
                  "Easy-to-use listing creation with photo uploads",
                  "Reach thousands of active buyers on the platform",
                  "Manage all buyer inquiries in your dashboard",
                  "Edit and update your listings anytime",
                  "No commission fees—keep 100% of your sale price",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mb-6">
                <BuildingIcon className="w-8 h-8 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Safe & Secure</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We prioritize the safety and security of all transactions with verification and secure communication tools.
              </p>
              <ul className="space-y-3 text-gray-600">
                {[
                  "Verified user accounts for buyers and sellers",
                  "Secure in-platform messaging system",
                  "Property listing verification and moderation",
                  "Report and flag suspicious listings or users",
                  "24/7 platform support and dispute resolution",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Tools</h2>
            <p className="text-lg text-gray-600">Everything you need for successful transactions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: MessageSquareIcon, title: "Direct Messaging", desc: "Communicate securely with buyers or sellers through our built-in messaging system." },
              { icon: ShieldCheckIcon, title: "Verified Listings", desc: "All property listings are reviewed and verified by our team to ensure accuracy." },
              { icon: BellIcon, title: "Smart Notifications", desc: "Get instant alerts for new listings, messages, and important updates." },
            ].map((tool, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm border text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                  <tool.icon className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{tool.title}</h3>
                <p className="text-gray-600">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple Process</h2>
            <p className="text-lg text-gray-600">From listing to closing in four easy steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              "Create Account",
              "List or Browse",
              "Connect",
              "Complete Deal"
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 bg-teal-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                  {i + 1}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step}</h3>
                <p className="text-gray-600 text-sm">
                  {i === 0 && "Sign up and complete your profile verification."}
                  {i === 1 && "Sellers create listings; buyers search and filter properties."}
                  {i === 2 && "Message directly to discuss details and arrange viewings."}
                  {i === 3 && "Finalize the transaction directly—no middleman needed."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-20 bg-gradient-to-r from-teal-600 to-teal-700 text-white ${isLoggedIn? 'hidden': ''}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join Our Platform?</h2>
          <p className="text-xl mb-10 opacity-90">
            Whether you're buying or selling, create your account today and start connecting.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              asChild
              size="lg"
              className='bg-white text-teal-600 hover:bg-gray-100 font-semibold text-lg px-10 py-6'
            >
              <Link to="/signup">Sign Up as Buyer</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className='bg-white text-teal-600 hover:bg-gray-100 font-semibold text-lg px-10 py-6'
            >
              <Link to="/signup">Sign Up as Seller</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}