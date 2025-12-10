import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

const api = import.meta.env.VITE_API_URL;

export default function Signup({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (val: boolean) => void;
}) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isSeller, setIsSeller] = useState(false);
  const [authing, setAuthing] = useState(false);
  const [error, setError] = useState("");

  const safeJson = async (res: Response) => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthing(true);
    setError("");

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      const checkRes = await fetch(`${api}/user/${user.uid}`);
      if (checkRes.ok) {
        setError("This email is already registered. Please log in.");
        setAuthing(false);
        return;
      }
      if (checkRes.status !== 404) {
        const errData = await safeJson(checkRes);
        throw new Error(errData?.error || "Server error");
      }

      const createRes = await fetch(`${api}/add-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: fullName.trim() || null,
          phone: phone || null,
          role: isSeller ? "seller" : "buyer",
        }),
      });

      if (!createRes.ok) {
        const errData = await safeJson(createRes);
        throw new Error(errData?.error || "Failed to create profile");
      }

      toast.success("Account created successfully!");
      setIsAuthenticated(true);
      navigate(isSeller ? "/realtorListings" : "/listings");
    } catch (error) {
      if(error instanceof Error){
                setError(error.message);
      }
      else{
        setError('something went wrong')
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

      <div className="flex py-10 h-screen w-full max-w-5xl mx-auto">
        <div className="bg-[#50b6c1] w-1/2 hidden md:flex items-center justify-center shadow-xl">
          <img src={logo} alt="logo" className="w-40" />
        </div>

        <form onSubmit={handleSignup} className="flex flex-col w-full md:w-1/2 p-8 justify-center gap-4 bg-white shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-[#50b6c1]">Sign Up</h2>
            <div className="flex items-center gap-3">
              <span className={isSeller ? "text-gray-500" : "font-medium"}>Buyer</span>
              <Switch checked={isSeller} onCheckedChange={setIsSeller} />
              <span className={isSeller ? "font-medium" : "text-gray-500"}>Seller</span>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div>
            <label>Full Name</label>
            <Input
              type="text"
              placeholder="Enter your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1"
            />
          </div>

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
            <label>Phone Number</label>
            <Input
              type="tel"
              placeholder="0912 345 678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label>Password <span className="text-red-600">*</span></label>
            <Input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={authing}
            className="bg-[#50b6c1] hover:bg-[#3a8a93] text-white font-medium py-6 text-lg"
          >
            {authing ? "Creating Account..." : "Sign Up"}
          </Button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}