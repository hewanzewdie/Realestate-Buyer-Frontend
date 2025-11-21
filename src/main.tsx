import ReactDOM from "react-dom/client";
import React, { useState, StrictMode } from "react";
import "./index.css";
import App from "./pages/App.tsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthRoute from "./components/auth/AuthRoute.tsx";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Login from "./components/auth/Login.tsx";
import Signup from "./components/auth/Signup.tsx";
import reportWebVitals from "./reportWebVitals";
import "../firebase";
import Listings from "./pages/user/listings/Listings.tsx";
import Favorites from "./pages/user/dashboard/Favorites.tsx";
import Messages from "./pages/user/messaging/Messages.tsx";
import ListingDetail from "./components/listings/ListingDetail.tsx";
import Layout from "./components/common/Layout.tsx";
import { SidebarProvider } from "./components/ui/sidebar.tsx";
import { createUserProfile } from "./lib/createUserProfile.ts";
import RealtorListings from "./pages/realtor/listing/MyListing.tsx";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import RealtorDashboard from "./pages/realtor/dashboard/index.tsx";
import SellerListings from "./pages/realtor/listing/MyListing.tsx";

const Root = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  React.useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
         createUserProfile(user);
         const docSnap = await getDoc(doc(db, "users", user.uid));
         if (docSnap.exists()) {
          setUserRole(docSnap.data().role);
          }
          setIsAuthenticated(true);
      }
      setIsAuthenticated(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-2xl font-bold">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Auth pages (no layout) */}
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/signup"
          element={<Signup setIsAuthenticated={setIsAuthenticated} />}
        />

        {/* All other pages with layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />
          <Route path="/listingDetail/:id" element={
            <AuthRoute isAuthenticated={isAuthenticated}>
            <ListingDetail />
            </AuthRoute>
            } />
          <Route
            path="/listings"
            element={
                userRole === "seller" ? (
                  <AuthRoute isAuthenticated={isAuthenticated}>
                    <SellerListings/>
                    </AuthRoute>
                ) : (
                  <AuthRoute isAuthenticated={isAuthenticated}>
                    <Listings />
                  </AuthRoute>
                )
            }
          />
          <Route
            path="/favorites"
            element={
              userRole === "seller" ? (
                <Navigate to="/realtorDashboard" />
              ) : (
              <AuthRoute isAuthenticated={isAuthenticated}>
                <Favorites />
              </AuthRoute>
              )
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
          <Route path="*" element={<Navigate to="/" />} />

          <Route 
          path="/realtorListings" 
          element={
            <AuthRoute isAuthenticated={isAuthenticated}>
              <RealtorListings />
            </AuthRoute>
          } 
          />
          <Route 
          path="/realtorDashboard" 
          element={
            <AuthRoute isAuthenticated={isAuthenticated}>
<RealtorDashboard/>
</AuthRoute>
          } 
          />  
        </Route>
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <StrictMode>
    <SidebarProvider>
      <Root />
    </SidebarProvider>
  </StrictMode>
);

reportWebVitals();
