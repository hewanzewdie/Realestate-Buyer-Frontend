import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import  toast  from "react-hot-toast";
import { getFirestore, doc, getDoc } from "firebase/firestore";
export default function Login({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (val: boolean) => void;
}) {
  const auth = getAuth();
  const navigate = useNavigate();
const db = getFirestore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authing, setAuthing] = useState(false);
  const [error, setError] = useState("");

  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthing(true);
    setError("");

    // signInWithEmailAndPassword(auth, email, password)
    //   .then(() => {
    //     setIsAuthenticated(true);
    //     toast.success('Successfully Logged In!')
    //     navigate("/");
    //   })
    //   .catch((error) => {
    //     setError(error.message);
    //     setAuthing(false);
    //   });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user role
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      const userData = docSnap.data();

      if (userData?.role === "seller") {
        toast.success("Welcome back, Seller!");
        navigate("/realtorListings");
      } else {
        toast.success("Welcome back, Buyer!");
        navigate("/listings");
      }

      setIsAuthenticated(true);
    } catch (error: any) {
      setError(error.message);
      setAuthing(false);
    }
  };

  return (
    <div className="flex py-10 w-200 h-160 m-auto">
      <div className="bg-[#50b6c1] w-1/2 flex items-center justify-center hidden sm:flex shadow-xl">
        <img src={logo} alt="" className="w-40 " />
      </div>
      <form
        onSubmit={signInWithEmail}
        className='flex flex-col w-full shadow-xl md:w-1/2 p-8 justify-center gap-3 sm:static sm:translate-x-0 sm:translate-y-0 
          relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 sm:left-0 sm:top-0'
        >
        <div className="flex justify-between ">
          <p className="text-2xl font-bold text-[#50b6c1]">Login</p>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <p>
          Email <span className="text-red-600 font-bold">*</span>
        </p>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-gray-300 rounded-md p-2 mb-4"
        />
        <p>
          Password <span className="text-red-600 font-bold">*</span>
        </p>
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-gray-300 rounded-md p-2 mb-4"
        />
        <Button
          type="submit"
          className="bg-[#50b6c1] p-1.5 text-white rounded-md"
          disabled={authing}
        >
          {authing ? "Loading..." : "Login"}
        </Button>
        <p className="text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="hover:underline text-blue-600">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
