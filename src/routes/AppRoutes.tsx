import AuthRoute from "@/components/auth/AuthRoute";
import Login from "@/components/auth/Login";
import Signup from "@/components/auth/Signup";
import ListingDetail from "@/components/listings/PropertyDetail";
import App from "@/pages/App";
import SellerListings from "@/pages/realtor/listing/MyListing";
import Listings from "@/pages/user/listings/Listings";
import Messages from "@/pages/user/messaging/Messages";
import RealtorListings from "../pages/realtor/listing/MyListing";
import Layout from "../components/common/Layout";
import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import About from "@/pages/public/landing/About";
import { Services } from "@/pages/public/landing/Services";

const AppRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  useEffect(() => {
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
    });

    return () => unsubscribe();
  }, []);

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login setIsAuthenticated={setIsAuthenticated} />}
      />
      <Route
        path="/signup"
        element={<Signup setIsAuthenticated={setIsAuthenticated} />}
      />

      <Route element={<Layout />}>
        <Route path="/" element={<App />} />
        <Route
          path="/listingDetail/:id"
          element={
            <AuthRoute isAuthenticated={isAuthenticated}>
              <ListingDetail />
            </AuthRoute>
          }
        />
        <Route
          path="/listings"
          element={
            <AuthRoute isAuthenticated={isAuthenticated}>
              {userRole === "seller" ? <SellerListings /> : <Listings />}
            </AuthRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <AuthRoute isAuthenticated={isAuthenticated}>
              <Messages />
            </AuthRoute>
          }
        />
        <Route
          path="/realtorListings"
          element={
            <AuthRoute isAuthenticated={isAuthenticated}>
              <RealtorListings />
            </AuthRoute>
          }
        />

        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
