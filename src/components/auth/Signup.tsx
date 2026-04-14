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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createUser } from "@/api/auth";

const signupSchema = z.object({
  fullname: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (val: boolean) => void;
}) {
  const navigate = useNavigate();
  const [isSeller, setIsSeller] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const handleSignup = async (data: SignupFormData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );

      const user = userCredential.user;

      await createUser({
        uid: user.uid,
        fullname: data.fullname,
        email: data.email,
        phone: Number(data.phone),
        role: isSeller ? "seller" : "buyer",
      });

      toast.success("Account created successfully!");

      setIsAuthenticated(true);

      navigate(isSeller ? "/realtorListings" : "/listings");
    } catch (error) {
      console.error(error);
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <>
      <Button
        onClick={() => navigate("/")}
        className="ml-10 mt-10 bg-gray-300 text-black hover:bg-gray-400"
      >
        <ArrowLeft />
      </Button>

      <div className="flex py-10 h-screen w-full max-w-5xl mx-auto">
        <div className="bg-primary w-1/2 hidden md:flex items-center justify-center shadow-xl">
          <img src={logo} alt="logo" className="w-40" />
        </div>

        <form
          onSubmit={handleSubmit(handleSignup)}
          className="flex flex-col w-full md:w-1/2 p-8 justify-center gap-4 bg-white shadow-xl"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-primary">Sign Up</h2>

            <div className="flex items-center gap-3">
              <span className={!isSeller ? "font-medium" : "text-gray-500"}>
                Buyer
              </span>
              <Switch checked={isSeller} onCheckedChange={setIsSeller} />
              <span className={isSeller ? "font-medium" : "text-gray-500"}>
                Seller
              </span>
            </div>
          </div>

          <div>
            <label>Full Name</label>
            <Input
              type="text"
              placeholder="Enter your name"
              {...register("fullname")}
              disabled={isSubmitting}
              className="mt-1"
            />
            {errors.fullname && (
              <p className="text-sm text-destructive">
                {errors.fullname.message}
              </p>
            )}
          </div>

          <div>
            <label>
              Email <span className="text-destructive">*</span>
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              disabled={isSubmitting}
              className="mt-1"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label>Phone Number</label>
            <Input
              type="tel"
              placeholder="0912 345 678"
              {...register("phone")}
              disabled={isSubmitting}
              className="mt-1"
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label>
              Password <span className="text-destructive">*</span>
            </label>
            <Input
              type="password"
              placeholder="Create a password"
              {...register("password")}
              disabled={isSubmitting}
              className="mt-1"
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white font-medium py-6 text-lg"
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </Button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
