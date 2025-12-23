import ReactDOM from "react-dom/client";
import React, { useState, StrictMode } from "react";
import "./index.css";
import App from "./pages/App.tsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import AuthRoute from "./components/auth/AuthRoute.tsx";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Login from "./components/auth/Login.tsx";
import Signup from "./components/auth/Signup.tsx";
import Listings from "./pages/user/listings/Listings.tsx";
import Messages from "./pages/user/messaging/Messages.tsx";
import ListingDetail from "./components/listings/ListingDetail.tsx";
import Layout from "./components/common/Layout.tsx";
import { SidebarProvider as SidebarProvider } from "./components/ui/sidebar.tsx";
import RealtorListings from "./pages/realtor/listing/MyListing.tsx";
import SellerListings from "./pages/realtor/listing/MyListing.tsx";
import About from "./pages/public/landing/About.tsx";
import { Services } from "./pages/public/landing/Services.tsx";
import { Skeleton } from "./components/ui/skeleton.tsx";
import { Button } from "./components/ui/button.tsx";
import { MessageCircle } from "lucide-react";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const FloatingMessageButton = () => {
  const navigate = useNavigate();
          const auth = getAuth();
const user = auth.currentUser;
  return (
    <div className={`fixed bottom-6 right-6 z-50 ${user ? '' : 'hidden'}`}>
      <Button
        onClick={() => {
          navigate("/messages");
        }}
        className="w-12 h-12 rounded-full bg-[#1bada2] hover:bg-[#169a8f] text-white shadow-2xl hover:scale-110"
      >
        <MessageCircle className="w-8 h-8" />
      </Button>
    </div>
  );
};

const Root = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  React.useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          setUserRole(docSnap.data().role);
        }
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex flex-col min-h-full">
        <Skeleton className="w-full h-16"/>

      <div className="w-full flex flex-col md:flex-row p-10 py-20 justify-between gap-10">
      <div className="flex-1 space-y-6">

        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-10 w-4/5" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>

        <Skeleton className="h-10 w-36 rounded-md" />
      </div>

      <div className="flex-1 flex justify-center">
        <Skeleton className="h-100 w-full md:w-[80%] rounded-2xl" />
      </div>
    </div>
    </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />

      <Route element={<Layout />}>
        <Route path="/" element={<App />} />
        <Route path="/listingDetail/:id" element={
          <AuthRoute isAuthenticated={isAuthenticated}>
            <ListingDetail />
          </AuthRoute>
        } />
        <Route path="/listings" element={
          <AuthRoute isAuthenticated={isAuthenticated}>
            {userRole === "seller" ? <SellerListings /> : <Listings />}
          </AuthRoute>
        } />
        
        <Route path="/messages" element={
          <AuthRoute isAuthenticated={isAuthenticated}>
            <Messages />
          </AuthRoute>
        } />
        <Route path="/realtorListings" element={
          <AuthRoute isAuthenticated={isAuthenticated}>
            <RealtorListings />
          </AuthRoute>
        } />
        
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <StrictMode>
    <SidebarProvider>
      <Router>
        <Root />
        <FloatingMessageButton /> 
      </Router>
    </SidebarProvider>
  </StrictMode>
);