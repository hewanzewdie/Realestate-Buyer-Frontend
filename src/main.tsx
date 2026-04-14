import ReactDOM from "react-dom/client";
import React, { useState, StrictMode } from "react";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { SidebarProvider } from "./components/ui/sidebar.tsx";
import AppRoutes from "./routes/AppRoutes.tsx";
import FloatingMessageButton from "./components/common/FloatingMessageButton.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoadingSkeleton from "./components/common/LoadingSkeleton.tsx";

const Root = () => {
  const [loading, setLoading] = useState(true);
  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, () => {
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <LoadingSkeleton type="landing" />;
  }
  return <AppRoutes />;
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

export const queryClient = new QueryClient();

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <Router>
          <Root />
          <FloatingMessageButton />
        </Router>
      </SidebarProvider>
    </QueryClientProvider>
  </StrictMode>,
);
