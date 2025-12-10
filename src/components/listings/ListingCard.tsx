import { HeartIcon, BedIcon, BathIcon, Ruler, MapPin, PencilIcon, TrashIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../../hooks/useFavorites";
import type { Property } from "../../types/property";
import { useState, useEffect } from "react";
import EditListing from "@/pages/realtor/listing/EditListing";
import { Button } from "../ui/button";
import { Switch } from '../ui/switch';
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
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import  toast  from "react-hot-toast";
import { doc, getDoc } from "firebase/firestore";
import {auth, db} from '../../../firebase'

function PropertyCard(property: Property) {
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorited = favorites.includes(property.id);
  
  const user = auth.currentUser;
  const [role, setRole] = useState<string | null>(null);

  const navigate = useNavigate();
const [openLoginModal, setOpenLoginModal] = useState(false);
const [openSignupModal, setOpenSignupModal] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
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
 const signInWithEmail = async (e: React.FormEvent) => {
  e.preventDefault();
  setAuthing(true);
  setError("");

  try {
    const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    const user = userCredential.user;
    const api = import.meta.env.VITE_API_URL;

    const res = await fetch(`${api}/user/${user.uid}`);

    if (!res.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const userData = await res.json();

    if (userData?.role === "seller") {
      navigate("/realtorListings");
    } else {
      navigate("/listings");
    }
  } catch (error) {
      if(error instanceof Error){
                setError(error.message);
      }
      else{
        setError('something went wrong')
      }
      setAuthing(false)
      }
};

  const signUpWithEmail = async (e: React.FormEvent) => {
  e.preventDefault();
  setAuthing(true);
  setError("");

  try {
    
    const { user } = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
    const checkRes = await fetch(`http://localhost:3000/user/${user.uid}`);
   if (checkRes.ok) {
        setError("This email is already registered. Please log in.");
        setAuthing(false);
        return;
      }
   if (checkRes.status !== 404) {
        const errData = await safeJson(checkRes);
        throw new Error(errData?.error || "Server error");
      }
   
    const createRes = await fetch(`http://localhost:3000/add-user`, {
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
      navigate(isSeller ? "/realtorListings" : "/listings");

     }

    catch (error) {
      if(error instanceof Error){
                setError(error.message);
      }
      else{
        setError('something went wrong')
      }
      }
    finally {
      setAuthing(false);
    }
};
const handleCardClick = () =>{
  if(!user){
    setOpenLoginModal(true);
    return;
  }
  navigate(`/listingDetail/${property.id}`);
}


  useEffect(() => {
    const fetchRole = async () => {
      if (!user) return;
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setRole(snap.data().role);
      }
    };
    fetchRole();
  }, [user]);

  const handleUpdate = () => {
  window.location.reload();
  toast.success("Property updated!");
};
const [deleteDialogOpen, setDeleteDialogOpen] =useState(false);
const [deleting, setDeleting] = useState(false);
  const handleDelete = async () => {
  setDeleteDialogOpen(true); 
};

const confirmDelete = async () => {
  setDeleting(true);
  try {
    const api = import.meta.env.VITE_API_URL;
    const res = await fetch(`${api}/properties/${property.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to delete");

    toast.success("Property deleted successfully");
    window.location.reload(); 
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete property");
  } finally {
    setDeleting(false);
    setDeleteDialogOpen(false);
  }
};

  return (
    <div className="block cursor-pointer">
      <div className="flex flex-col gap-3 w-full bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        
        <div onClick={handleCardClick} className="block">
          <div className="relative">
            <p
              className={`absolute text-sm w-20 text-center p-1 text-white rounded-full top-2 left-2 z-10 ${
                property.forSale ? "bg-green-600" : "bg-blue-600"
              }`}
            >
              {property.forRent ? "For Rent" : "For Sale"}
            </p>
            <img
              src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&auto=format&fit=crop&q=60"
              alt={property.title}
              className="rounded-t-2xl w-full h-48 object-cover"
            />
          </div>

          <div className="p-5">
              <h3 className="text-lg font-semibold">{property.title}</h3>
            
            <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
              <MapPin className="w-4 h-4" />
              <span>{property.location}</span>
            </div>

            <div className="flex items-center space-x-3 text-gray-600 text-sm">
              <div className="flex items-center gap-1">
                <BedIcon className="w-4 h-4" /> {property.bedrooms} Beds
              </div>
              <span>|</span>
              <div className="flex items-center gap-1">
                <BathIcon className="w-4 h-4" /> {property.bathrooms} Baths
              </div>
              <span>|</span>
              <div className="flex items-center gap-1">
                <Ruler className="w-4 h-4" /> {property.area} m²
              </div>
            </div>
            <hr className="my-3"/>
            <p className="text-xl font-bold text-[#1bada2]">
                ${property.forSale ? property.salePrice?.toLocaleString() : property.rentPrice?.toLocaleString()}
                {property.forRent && "/mo"}
              </p>
          </div>
        </div>
{/* Login modal  */}
<Dialog open={openLoginModal} onOpenChange={setOpenLoginModal}>
  <DialogContent>
    <form className="flex flex-col space-y-5" onSubmit={signInWithEmail}>
    <DialogHeader>
      <DialogTitle>Login</DialogTitle>
    </DialogHeader>
        {error && <p className="text-red-600 text-sm">{error}</p>}

    <div className="flex flex-col space-y-3">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" value={loginEmail} onChange={(e)=> setLoginEmail(e.target.value)} required/>
    </div>
    <div className="flex flex-col space-y-3">
      <Label htmlFor="password">Password</Label>
      <Input id="password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required/>
    </div>

    <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" disabled={authing} >Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={authing} className="bg-[#1bada2] text-white hover:bg-[#15948b] ">Submit</Button>
              </DialogFooter>
              <div className="flex items-center justify-center">
              <p>Don't have an account? </p>
              <Button type="button" onClick={()=>{setOpenSignupModal(true);
    setOpenLoginModal(false)}} className="hover:underline bg-white hover:bg-white text-blue-700">Sign up</Button>
</div>
    </form>
  </DialogContent>
</Dialog>



{/* signup modal */}

<Dialog open={openSignupModal} onOpenChange={setOpenSignupModal}>
  <DialogContent>
    <form className="flex flex-col space-y-5" onSubmit={signUpWithEmail}>
    <DialogHeader>
      <DialogTitle>Signup</DialogTitle>
    </DialogHeader>
                <p className="text-red-600 text-sm">{error}</p>
                    <div className='flex items-center gap-3 self-end'>
              <span className={isSeller ? 'text-gray-500' : 'font-medium'}>Buyer</span>
              <Switch checked={isSeller} onCheckedChange={setIsSeller} />
              <span className={isSeller ? 'font-medium' : 'text-gray-500'}>Seller</span>
            </div>
    <div>
      <Label htmlFor="name">Full Name</Label>
      <Input id="name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}/>
    </div>
    <div>
      <Label htmlFor="email">email</Label>
      <Input id="email" type="email" value={signUpEmail} onChange={(e)=>setSignUpEmail(e.target.value)} required/>
    </div>
<div>
      <Label htmlFor="phone">Phone</Label>
      <Input id="phone" type="number" value={phone} onChange={(e)=> setPhone(e.target.value)}/>
    </div>
    <div>
      <Label htmlFor="password">Password</Label>
      <Input id="password" type="password"value={signUpPassword} onChange={(e)=> setSignUpPassword(e.target.value)} required/>
    </div>
    <DialogFooter>
      
      
                <DialogClose asChild>
                  <Button variant="outline" disabled={authing} >Cancel</Button>
                </DialogClose>
                <Button type="submit"disabled={authing} className="bg-[#1bada2] text-white hover:bg-[#15948b]">
Submit                </Button>
</DialogFooter>
              <div className="flex items-center justify-center">
              <p>Already have an account? </p>
              <Button type="button" onClick={()=>{setOpenSignupModal(false);
    setOpenLoginModal(true)}} className="hover:underline bg-white hover:bg-white text-blue-700">Login</Button>
</div>
    </form>
  </DialogContent>
</Dialog>

        <div className="px-5 pb-5 flex justify-between items-center">
          {role === "seller" ? (
            <div className="flex gap-3">
              {/* Edit Modal */}
              <EditListing
                trigger={
                  <Button
                    onClick={(e) => e.stopPropagation()} 
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 bg-green-50 transition"
                    title="Edit property"
                  >
                    <PencilIcon className="w-5 h-5 text-gray-700" />
                  </Button>
                }
                property={property}
                onUpdate={handleUpdate}
              />

              {/* Delete Button */}
              <Button
  onClick={(e) => {
    e.stopPropagation();
    handleDelete();
  }}
  className="p-2 rounded-lg border border-red-300 hover:bg-red-50 bg-green-50 transition"
  title="Delete property"
>
  <TrashIcon className="w-5 h-5 text-red-600" />
</Button>

            </div>
          ) : (
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(property.id);
              }}
              className="p-2 bg-green-50 hover:bg-red-100"
            >
              <HeartIcon
                className={`w-5 h-5 transition-colors ${
                  isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"
                }`}
              />
            </Button>
          )}
        </div>
      </div>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Delete Property&nbsp;<i>{property.title}</i></DialogTitle>
    </DialogHeader>

    <div className="py-4">
      <p className="text-gray-600">
This action can't be undone      </p>
    </div>

    <DialogFooter className="gap-3 sm:gap-4">
      <Button
        variant="outline"
        onClick={() => setDeleteDialogOpen(false)}
        disabled={deleting}
      >
        Cancel
      </Button>
      <Button
        variant="destructive"
        onClick={confirmDelete}
        disabled={deleting}
        className="bg-red-600 hover:bg-red-700"
      >
        {deleting ? "Deleting..." : "Delete Property"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </div>
  );
}

export default PropertyCard;