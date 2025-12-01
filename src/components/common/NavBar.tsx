import { Link, useNavigate } from "react-router-dom";
import { SendHorizontal, Menu, X, User } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Button } from "../ui/button";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();
    const unsub = onAuthStateChanged(auth, async (user) => {
      setIsAuthenticated(!!user);

      if (user) {
        // Fetch user data from Firestore
        const userDoc = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as { name: string; email: string; phone: string });
        }
      } else {
        setUserProfile({});
      }
    });

    return () => unsub();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigate("/login");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Desktop Nav */}
      {!isMenuOpen && (
        <header className="flex items-center justify-between p-4 sticky top-0 z-50 bg-green-50 shadow-md">
          <img src={logo} alt="logo" className="w-10" />

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-5">
              <Link to="/" className="hover:underline hover:text-[#1bada2]">Home</Link>
             <Link to="/about" className="hover:underline hover:text-[#1bada2]">About</Link>
              <Link to="/services" className="hover:underline hover:text-[#1bada2]">Services</Link>
                  
            {isAuthenticated && (
              <>
               {/* <Link to="/favorites" className="hover:underline hover:text-[#1bada2]">Favorites</Link> */}
                <Link to="/listings" className="hover:underline hover:text-[#1bada2]">Listings</Link>
</>
            )}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex space-x-4 items-center relative">
            {isAuthenticated ? (
              <>
                {/* <Link to="/messages">
                  <SendHorizontal className="w-6 h-6 hover:text-[#1bada2]" />
                </Link> */}

                {/* Profile Dropdown */}
                <div className="relative">
                  <Button
                    className="flex items-center space-x-2 p-1.5 rounded-lg bg-[#1bada2] text-white"
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                  >
                    <User className="w-5 h-5" />
                    <span>{userProfile.name || "Profile"}</span>
                  </Button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-3 z-50">
                      <p className="font-semibold">{userProfile.name}</p>
                      <p className="text-sm">{userProfile.email}</p>
                      <p className="text-sm">{userProfile.phone}</p>
                    </div>
                  )}
                </div>

                <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white p-1.5 w-20 rounded-lg">Logout</Button>
              </>
            ) : (
              <>
                <Button className="p-1.5 rounded-lg bg-[#1bada2] text-white w-20" onClick={() => navigate('/login')}>Login</Button>
                <Button className="p-1.5 rounded-lg bg-[#1bada2] text-white w-20" onClick={() => navigate('/signup')}>Sign Up</Button>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <Button className="md:hidden bg-[#1bada2]" onClick={() => setIsMenuOpen(true)}>
            <Menu />
          </Button>
        </header>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <header className="flex p-4 bg-green-50 backdrop-blur-md w-full sticky top-0 z-50 shadow">
          <div className="w-full">
            <div className="flex justify-end pr-4">
              <Button onClick={() => setIsMenuOpen(false)} className="bg-[#1bada2]">
                <X size={28} />
              </Button>
            </div>
            <div className="flex flex-col gap-4 pl-6 mt-4">

              {isAuthenticated && (
                <>
                  <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:underline hover:text-[#1bada2]">Home</Link>
                  <Link to="/about" onClick={() => setIsMenuOpen(false)} className="hover:underline hover:text-[#1bada2]">About</Link>
                  <Link to="/services" onClick={()=>setIsMenuOpen(false)} className="hover:underline hover:text-[#1bada2]">Services</Link>
                  <Link to="/listings" onClick={() => setIsMenuOpen(false)} className="hover:underline hover:text-[#1bada2]">Listings</Link>
                  {/* <Link to="/favorites" onClick={() => setIsMenuOpen(false)} className="hover:underline hover:text-[#1bada2]">Favorites</Link> */}
                  <Link to="/messages" onClick={() => setIsMenuOpen(false)} className="hover:text-[#1bada2]">
                    <SendHorizontal className="w-6 h-6" />
                  </Link>

                  {/* Mobile Profile */}
                  <div className="flex flex-col gap-1 bg-white shadow-lg rounded-lg p-3 mt-2">
                    <p className="font-semibold">{userProfile.name}</p>
                    <p className="text-sm">{userProfile.email}</p>
                    <p className="text-sm">{userProfile.phone}</p>
                  </div>

                  <Button onClick={() => { setIsMenuOpen(false); handleLogout(); }} className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-lg">Logout</Button>
                </>
              )}

              {!isAuthenticated && (
                <>
                 <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:underline hover:text-[#1bada2]">Home</Link>
                  <Link to="/about" onClick={() => setIsMenuOpen(false)} className="hover:underline hover:text-[#1bada2]">About</Link>
                  <Link to="/services" onClick={()=>setIsMenuOpen(false)} className="hover:underline hover:text-[#1bada2]">Services</Link>
                  <Button className="p-1.5 rounded-lg bg-[#1bada2] text-white" onClick={() => { setIsMenuOpen(false); navigate('/login'); }}>Login</Button>
                  <Button className="p-1.5 rounded-lg bg-[#1bada2] text-white" onClick={() => { setIsMenuOpen(false); navigate('/signup'); }}>Sign Up</Button>
                </>
              )}
            </div>
          </div>
        </header>
      )}
    </>
  );
}
