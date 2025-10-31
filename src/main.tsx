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

const Root = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
         createUserProfile(user);
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
          <Route path="/listingDetail/:id" element={<ListingDetail />} />
          <Route
            path="/listings"
            element={
              <AuthRoute isAuthenticated={isAuthenticated}>
                <Listings />
              </AuthRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <AuthRoute isAuthenticated={isAuthenticated}>
                <Favorites />
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
          <Route path="*" element={<Navigate to="/" />} />
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
