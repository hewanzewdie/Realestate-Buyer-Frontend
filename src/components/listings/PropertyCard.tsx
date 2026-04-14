import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { useFavorites } from "../../hooks/useFavorites";
import AuthModals from "../auth/AuthModals";
import { PropertyCardDisplay } from "./PropertyCardDisplay";
import { PropertyActions } from "./PropertyActions";
import type { Property } from "../../types/property";

export default function PropertyCard(property: Property) {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();
  const [role, setRole] = useState<string | null>(null);
  const [authModals, setAuthModals] = useState({ login: false, signup: false });

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "users", user.uid)).then((snap) =>
      setRole(snap.data()?.role || null),
    );
  }, [user]);

  const handleCardClick = () => {
    if (!user) return setAuthModals({ ...authModals, login: true });
    navigate(`/listingDetail/${property.id}`);
  };

  return (
    <div>
      <PropertyCardDisplay
        property={property}
        onCardClick={handleCardClick}
        actions={
          <PropertyActions
            property={property}
            role={role}
            isFavorited={favorites.includes(property.id)}
            onFavoriteToggle={() => toggleFavorite(property.id)}
          />
        }
      />

      <AuthModals
        openLoginModal={authModals.login}
        openSignupModal={authModals.signup}
        setOpenLoginModal={(val) =>
          setAuthModals((prev) => ({
            ...prev,
            login: typeof val === "function" ? val(prev.login) : val,
          }))
        }
        setOpenSignupModal={(val) =>
          setAuthModals((prev) => ({
            ...prev,
            signup: typeof val === "function" ? val(prev.signup) : val,
          }))
        }
      />
    </div>
  );
}
