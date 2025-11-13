// Landing page (public)
import Listing from "../listing/Listing";
import { HouseIcon, HouseHeart, ShoppingBag  } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleViewMore = () => {
    if (isAuthenticated) {
      navigate('/listings');
    } else {
      navigate('/login');
    }
  };

    return(
        <div>
        <div className="flex flex-col md:flex-row items-center justify-between p-5 md:p-15 gap-5 h-full">
            <div id="home" className="flex flex-col md:items-start gap-5 md:w-1/2">
            <p className="text-[#1bada2] font-bold text-xl">BUY, SELL, RENT EASY</p>
            <p className="text-5xl font-semibold">Your Key to Better Living</p>
            <p>From Addis Ababa, Ethiopia, we connect buyers and renters with trusted listings - helping you find, sell, or rent properties across vibrant neighborhoods and growing markets.</p>
            <Button className="bg-[#1bada2] text-white p-2 rounded-lg">Find out more</Button>
        </div>
        <img src="https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhvdXNlfGVufDB8fDB8fHww" className='md:w-1/2' alt="" />
        </div>
        <div className="flex flex-col items-center gap-5 p-10">
           <p className="text-3xl font-semibold" id="services">Services</p>
           <p className="text-2xl text-center">We offer Best services</p>
           <div className="flex flex-col md:flex-row gap-10 items-center justify-center py-10">
            <div className="flex flex-col items-center my-2 w=[90%] p-5 h-40 shadow-lg hover:shadow-xl rounded-md md:w-1/3 text-center group">
                <HouseIcon className="group-hover:text-green-100 group-hover:bg-[#1bada2] w-10 h-10 p-2 text-[#1bada2] bg-green-100 rounded-md"/>
                <p className="text-xl font-semibold">House for rent</p>
                <p>urban, sub-urban houses available for rent</p>
            </div>
            <div className="flex flex-col items-center my-2 w=[90%] p-5 h-40 shadow-lg hover:shadow-xl rounded-md md:w-1/3 text-center group">
            <HouseHeart className="group-hover:text-green-100 group-hover:bg-[#1bada2] w-10 h-10 p-2 text-[#1bada2] bg-green-100 rounded-md"/>
                <p className="text-xl font-semibold">House for Sale</p>
                <p>urban, sub-urban houses available for sale</p>
            </div>
            <div className="flex flex-col items-center my-2 w=[90%] p-5 h-40 shadow-lg hover:shadow-xl rounded-md md:w-1/3 text-center group">
                <ShoppingBag className="group-hover:text-green-100 group-hover:bg-[#1bada2] w-10 h-10 p-2 text-[#1bada2] bg-green-100 rounded-md"/>
                <p className="text-xl font-semibold">Real estate market</p>
                <p>variety of homes available for sale and rent, you can also list your properties here</p>
            </div>
            </div> 
            <h2 className="text-2xl font-bold">Listings</h2>
      <p className="text-lg">Homes are available</p>
      <div id="listings">
        <Listing showOnly={3} />
        <div className="flex justify-center mt-6">
          <Button onClick={handleViewMore} className="bg-[#1bada2] text-white px-6 py-2 rounded-lg">
            View More Properties
          </Button>
        </div>
      </div>
      <div className="relative h-100 w-full flex items-center justify-center overflow-hidden">
      <img
        src="https://plus.unsplash.com/premium_photo-1661908377130-772731de98f6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGhvdXNlfGVufDB8fDB8fHww"
        alt="Library background"
        className="absolute inset-0 w-full h-full object-cover blur-xs"
      />

      <div className="flex flex-col justify-center items-center z-10 text-white space-y-5 px-5">
       <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-center">Ninety percent of all millionaires become so through owning real estate. Find your next fortune here.</h1>
    <Button className="bg-[#1bada2] p-2 w-36 rounded-lg"><Link to="/listings">Find Property</Link></Button>
       </div>
       </div>
        </div>
</div>
    )
}