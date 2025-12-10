import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "../../../firebase";
import { ArrowLeft } from "lucide-react";

export default function Login({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (val: boolean) => void;
}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authing, setAuthing] = useState(false);
  const [error, setError] = useState("");

  const api = import.meta.env.VITE_API_URL;

  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthing(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const res = await fetch(`${api}/user/${user.uid}`);
      if (!res.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const userData = await res.json();

      if (userData?.role === "seller") {
        toast.success("Welcome back, Seller!");
        navigate("/realtorListings");
      } else {
        toast.success("Welcome back, Buyer!");
        navigate("/listings");
      }

      setIsAuthenticated(true);
    } catch (error) {
      if(error instanceof Error){
                setError(error.message);
      }
      else{
        setError('Something went wrong')
      }
      } finally {
      setAuthing(false);
    }
  };

  return (
    <>
      <Button onClick={() => navigate("/")} className="ml-10 mt-10 bg-gray-300 text-black hover:bg-gray-400">
        <ArrowLeft />
      </Button>

      <div className="flex py-10 w-full max-w-5xl mx-auto h-screen">
        <div className="bg-[#50b6c1] w-1/2 hidden md:flex items-center justify-center shadow-xl">
          <img src={logo} alt="logo" className="w-40" />
        </div>

        <form
          onSubmit={signInWithEmail}
          className="flex flex-col w-full md:w-1/2 p-8 justify-center gap-4 bg-white shadow-xl"
        >
          <h2 className="text-3xl font-bold text-[#50b6c1]">Login</h2>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div>
            <label>Email <span className="text-red-600">*</span></label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <label>Password <span className="text-red-600">*</span></label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={authing}
            className="bg-[#50b6c1] hover:bg-[#3a8a93] text-white font-medium py-6 text-lg"
          >
            {authing ? "Logging in..." : "Login"}
          </Button>

          <p className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}