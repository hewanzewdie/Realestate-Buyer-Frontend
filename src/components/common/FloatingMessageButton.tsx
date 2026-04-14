import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { MessageCircle } from "lucide-react";

const FloatingMessageButton = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  return (
    <div className={`fixed bottom-6 right-6 z-50 ${user ? "" : "hidden"}`}>
      <Button
        onClick={() => {
          navigate("/messages");
        }}
        className="w-12 h-12 rounded-full bg-primary text-white shadow-2xl hover:scale-110"
      >
        <MessageCircle className="w-8 h-8" />
      </Button>
    </div>
  );
};
export default FloatingMessageButton;
