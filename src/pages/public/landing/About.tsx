import { UserIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function About(){
    return(
        <div className="">
            <h1 className="text-4xl font-bold p-10 pb-0">About Our Platform</h1>
            <p className="text-2xl text-gray-600 w-2/3 mb-10 mt-5 px-10">We're building Ethiopia's most trusted real estate marketplace, connecting property buyers and sellers directly for transparent, efficient transactions.</p>
            
            <div className="flex md:flex-row flex-col items-center justify-between bg-gray-50 p-10">
                <div className="flex flex-col space-y-6">
                    <h3 className="text-3xl font-semibold">Our Mission</h3>
                    <p className="text-lg text-gray-600">Founded in Addis Ababa, our platform was created to solve a simple problem: real estate transactions in Ethiopia needed to be more direct, transparent, and accessible.</p>
                    <p className="text-lg text-gray-600">We built a marketplace where property owners can list their homes directly and buyers can discover opportunities without unnecessary intermediaries. No commissions, no hidden fees—just a platform that connects people.</p>
                    <p className="text-lg text-gray-600 mb-5">Today, thousands of buyers and sellers use our platform every month to list properties, discover homes, and complete transactions with confidence and transparency.</p>
                </div>
                <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80" alt="" className="md:w-1/2" />
            </div>
<section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600">
              The principles that guide our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Transparency
              </h3>
              <p className="text-gray-600 text-sm">
                Direct connections between buyers and sellers with no hidden
                fees or commissions
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Community
              </h3>
              <p className="text-gray-600 text-sm">
                Building a trusted marketplace where buyers and sellers connect
                with confidence
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quality
              </h3>
              <p className="text-gray-600 text-sm">
                Verified listings and secure communication to ensure the best
                experience
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Accessibility
              </h3>
              <p className="text-gray-600 text-sm">
                Making real estate simple and accessible for everyone in
                Ethiopia
              </p>
            </div>
          </div>
        </div>
      </section>

           <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Our Platform Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple steps for buyers and sellers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                For Buyers
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Create Your Account
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Sign up as a buyer to access all property listings
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Browse & Search
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Filter by location, price, and features to find your
                      perfect property
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Connect with Sellers
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Message sellers directly through our secure platform
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Complete Your Purchase
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Arrange viewings and finalize the deal directly with the
                      seller
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                For Sellers
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Create Seller Account
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Sign up and verify your account to start listing
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      List Your Property
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Add photos, details, and pricing for your property
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Receive Inquiries
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Get messages from interested buyers through the platform
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Close the Deal
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Negotiate and finalize the sale directly with buyers
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        <section className="flex flex-col space-y-3 items-center justify-center pb-10">
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Answers to common questions</p>
            <Accordion
      type="single"
      collapsible
      className="w-3/4"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-xl">How do I create an account?</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p className="text-lg text-gray-600">
            Click "Sign Up" in the top right corner and choose whether you want to register as a buyer or seller. Complete the verification process to start using the platform.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="text-xl">How do I list my property?</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p className="text-lg text-gray-600">
            After creating a seller account, go to your Listing page and click "Add Listing." Add names, property details, pricing, and publish. Your listing will be added instantly.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="text-xl">How do I contact a seller about a property?</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p className="text-lg text-gray-600">
            Once you're logged in as a buyer, you can message sellers directly through our secure messaging system on any property listing page.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
        </section>

      <section className="py-20 bg-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">2,500+</div>
              <div className="text-teal-100">Active Listings</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">5,000+</div>
              <div className="text-teal-100">Registered Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">800+</div>
              <div className="text-teal-100">Successful Connections</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">0%</div>
              <div className="text-teal-100">Commission Fees</div>
            </div>
          </div>
        </div>
      </section>

        </div>
    )
}