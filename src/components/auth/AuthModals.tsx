import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { Button } from "../ui/button";
import { auth } from "../../../firebase";
import { Switch } from "../ui/switch";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser, getUser } from "@/api/auth";

type AuthModalProps = {
  openLoginModal: boolean;
  openSignupModal: boolean;
  setOpenLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenSignupModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthModals = ({
  openLoginModal,
  openSignupModal,
  setOpenLoginModal,
  setOpenSignupModal,
}: AuthModalProps) => {
  const [isSeller, setIsSeller] = useState(false);
  const navigate = useNavigate();

  const loginSchema = z.object({
    loginEmail: z.email("Invalid email address"),
    loginPassword: z.string().min(6, "Password must be at least 6 characters"),
  });
  type LoginFormData = z.infer<typeof loginSchema>;

  const {
    register: login,
    handleSubmit: loginSubmit,
    formState: { errors: loginErrors, isSubmitting: loggingIn },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const signupSchema = z.object({
    fullname: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(10, "Invalid phone number"),
    signupEmail: z.email("Invalid email address"),
    signupPassword: z.string().min(6, "Password must be at least 6 characters"),
  });
  type SignupFormData = z.infer<typeof signupSchema>;

  const {
    register: signup,
    handleSubmit: signupSubmit,
    formState: { errors: signupErrors, isSubmitting: signingUp },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const signInWithEmail = async (data: LoginFormData) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.loginEmail,
        data.loginPassword,
      );

      const user = userCredential.user;
      const userData = await getUser({ userId: user.uid });

      if (userData?.role === "seller") {
        navigate("/realtorListings");
      } else {
        navigate("/listings");
      }
    } catch (error) {
      console.error(error);
      toast.error("Invalid email or password");
    }
  };

  const signUpWithEmail = async (data: SignupFormData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.signupEmail,
        data.signupPassword,
      );

      const user = userCredential.user;

      await createUser({
        uid: user.uid,
        fullname: data.fullname,
        email: data.signupEmail,
        phone: Number(data.phone),
        role: isSeller ? "seller" : "buyer",
      });

      toast.success("Account created successfully!");

      navigate(isSeller ? "/realtorListings" : "/listings");
    } catch (error) {
      console.error(error);
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div>
      {/* Login modal  */}
      <Dialog open={openLoginModal} onOpenChange={setOpenLoginModal}>
        <DialogContent>
          <form
            className="flex flex-col space-y-5"
            onSubmit={loginSubmit(signInWithEmail)}
          >
            <DialogHeader>
              <DialogTitle>Login</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col space-y-3">
              <Label htmlFor="email">Email</Label>
              <Input id="email" {...login("loginEmail")} required />
              {loginErrors.loginEmail && (
                <p className="text-sm text-destructive">
                  {loginErrors.loginEmail.message}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...login("loginPassword")}
                required
              />
              {loginErrors.loginPassword && (
                <p className="text-sm text-destructive">
                  {loginErrors.loginPassword.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={loggingIn}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={loggingIn}
                className="bg-primary text-white"
              >
                {loggingIn ? "Submitting..." : "Submit"}{" "}
              </Button>
            </DialogFooter>
            <div className="flex items-center justify-center">
              <p>Don't have an account? </p>
              <Button
                type="button"
                onClick={() => {
                  setOpenSignupModal(true);
                  setOpenLoginModal(false);
                }}
                className="hover:underline bg-white hover:bg-white text-blue-700"
              >
                Sign up
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Signup modal */}
      <Dialog open={openSignupModal} onOpenChange={setOpenSignupModal}>
        <DialogContent>
          <form
            className="flex flex-col space-y-5"
            onSubmit={signupSubmit(signUpWithEmail)}
          >
            <DialogHeader>
              <DialogTitle>Signup</DialogTitle>
            </DialogHeader>
            <div className="flex items-center gap-3 self-end">
              <span className={isSeller ? "text-gray-500" : "font-medium"}>
                Buyer
              </span>
              <Switch checked={isSeller} onCheckedChange={setIsSeller} />
              <span className={isSeller ? "font-medium" : "text-gray-500"}>
                Seller
              </span>
            </div>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" {...signup("fullname")} />
              {signupErrors.fullname && (
                <p className="text-sm text-destructive">
                  {signupErrors.fullname.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email">email</Label>
              <Input
                id="email"
                type="email"
                {...signup("signupEmail")}
                required
              />
              {signupErrors.signupEmail && (
                <p className="text-sm text-destructive">
                  {signupErrors.signupEmail.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="number" {...signup("phone")} />
              {signupErrors.phone && (
                <p className="text-sm text-destructive">
                  {signupErrors.phone.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...signup("signupPassword")}
                required
              />
              {signupErrors.signupPassword && (
                <p className="text-sm text-destructive">
                  {signupErrors.signupPassword.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={signingUp}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={signingUp}
                className="bg-primary text-white"
              >
                {signingUp ? "Submitting..." : "Submit"}{" "}
              </Button>
            </DialogFooter>
            <div className="flex items-center justify-center">
              <p>Already have an account? </p>
              <Button
                type="button"
                onClick={() => {
                  setOpenSignupModal(false);
                  setOpenLoginModal(true);
                }}
                className="hover:underline bg-white hover:bg-white text-blue-700"
              >
                Login
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuthModals;
