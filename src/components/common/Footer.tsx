import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { MailIcon, PhoneIcon, MapPinIcon } from 'lucide-react'

export default function Footer() {
 
  return (
  <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
                <img src={logo} alt="logo"  className="w-16 h-16"/>
                <span className="text-lg font-semibold text-white">
                RealEstate
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Ethiopia's trusted marketplace connecting property buyers and
              sellers directly. No middleman, no commission.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm hover:text-teal-500 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm hover:text-teal-500 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-sm hover:text-teal-500 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/listings"
                  className="text-sm hover:text-teal-500 transition-colors"
                >
                  Browse Listings
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">For Users</h3>
            <ul className="space-y-2">
              <li className="text-sm">Sign Up as Buyer</li>
              <li className="text-sm">Sign Up as Seller</li>
              <li className="text-sm">How It Works</li>
              <li className="text-sm">Safety Guidelines</li>
              <li className="text-sm">Terms of Service</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Support</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-500" />
                <span>Bole, Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <PhoneIcon className="w-4 h-4 flex-shrink-0 text-teal-500" />
                <a href="tel:+251001234567">+251 00 123 4567</a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <MailIcon className="w-4 h-4 flex-shrink-0 text-teal-500" />
                <a href="mailto:support@realestate.et">support@realestate.et</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; 2025 RealEstate Platform. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}