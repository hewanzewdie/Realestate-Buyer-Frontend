import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { signInWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "../../../firebase";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getUser } from "@/api/auth";
import { Label } from "@radix-ui/react-label";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (val: boolean) => void;
}) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const signInWithEmail = async (data: LoginFormData) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );

      const user = userCredential.user;
      const userData = await getUser({ userId: user.uid });

      if (userData?.role === "seller") {
        toast.success("Welcome back, Seller!");
        navigate("/realtorListings");
      } else {
        toast.success("Welcome back, Buyer!");
        navigate("/listings");
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error(error);
      toast.error("Invalid email or password");
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

      <div className="flex py-10 w-full max-w-5xl mx-auto h-screen">
        <div className="bg-primary w-1/2 hidden md:flex items-center justify-center shadow-xl">
          <img src={logo} alt="logo" className="w-40" />
        </div>

        <form
          onSubmit={handleSubmit(signInWithEmail)}
          className="flex flex-col w-full md:w-1/2 p-8 justify-center gap-4 bg-white shadow-xl"
        >
          <h2 className="text-3xl font-bold text-primary">Login</h2>

          <div>
            <Label>
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="mt-1"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label>
              Password <span className="text-destructive">*</span>
            </label>
            <Input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
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
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>

          <p className="text-center text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
