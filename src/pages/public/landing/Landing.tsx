import Listing from "../listing/Listing";
import { HouseIcon, HouseHeart, ShoppingBag, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Landing() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleViewMore = () => {
    if (isExpanded) {
      setVisibleCount(3);
      setIsExpanded(false);
    } else {
      setVisibleCount(999); 
      setIsExpanded(true);
    }
    document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between p-5 md:p-10 lg:p-15 gap-8 lg:gap-16">
        <div className="flex flex-col items-start gap-6 md:w-1/2 text-center md:text-left">
          <p className="text-[#1bada2] font-bold text-xl tracking-wider">
            BUY, SELL, RENT EASY
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Your Key to Better Living
          </h1>
          <p className="text-gray-600 text-lg text-start">
            From Addis Ababa, Ethiopia, we connect buyers and renters with trusted listings —
            helping you find, sell, or rent properties across vibrant neighborhoods and growing markets.
          </p>
          <Link to='/about'>
            <Button className="bg-[#1bada2] hover:bg-[#169a8f] cursor-pointer text-white px-8 py-6 text-lg rounded-lg">
              Find out more
              <ArrowRight/>
            </Button>
          </Link>
        </div>
        <img
          src="https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&auto=format&fit=crop&q=80"
          alt="Beautiful home"
          className="w-full md:w-1/2 rounded-2xl shadow-2xl object-cover h-96 md:h-full"
        />
      </div>

      {/* Services Section */}
      <div className="py-16 px-5 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" id="services">
          Services
        </h2>
        <p className="text-2xl text-gray-700 mb-12">We offer the best services</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { icon: HouseIcon, title: "House for Rent", desc: "Urban & suburban houses available for rent" },
            { icon: HouseHeart, title: "House for Sale", desc: "Premium homes ready for purchase" },
            { icon: ShoppingBag, title: "Real Estate Market", desc: "List or find your dream property easily" },
          ].map((service, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl shadow-lg hover:shadow-2xl group text-center space-y-2"
            >
              <div className="inline-block p-4 rounded-lg bg-green-50 group-hover:bg-[#1bada2] transition-colors">
                <service.icon className="w-8 h-8 text-[#1bada2] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="text-gray-600">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Listings Preview Section */}
      <div id="listings" className="py-16 px-5 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Latest Listings
          </h2>
          <p className="text-center text-lg text-gray-600 mb-10">
            Homes are available across Addis Ababa and beyond
          </p>

          <Listing showOnly={visibleCount} />

          <div className="flex justify-center mt-12 ">
            <Button
              onClick={handleViewMore}
              className="bg-[#1bada2] hover:bg-[#169a8f] text-white cursor-pointer w-60 px-10 py-6 text-lg rounded-lg font-medium transition-all shadow-lg"
            >
              {isExpanded? <ChevronUp/>:<ChevronDown/>}
              {isExpanded ? "Show Less" : "View More Properties"}
            </Button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative h-96 md:h-[500px] flex items-center justify-center overflow-hidden">
        <img
          src="https://plus.unsplash.com/premium_photo-1661908377130-772731de98f6?w=1600&auto=format&fit=crop&q=80"
          alt="Real estate success"
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Ninety percent of all millionaires become so through owning real estate.
          </h1>
          <p className="text-xl mt-4 opacity-90">
            Find your next fortune here.
          </p>
          <Button className="mt-8 bg-[#1bada2] hover:bg-[#169a8f] text-white px-8 py-6 text-lg rounded-lg">
            <Link to={isAuthenticated ? "/listings" : "/login"}>{isAuthenticated ? "Find Property": "Get Started"}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}