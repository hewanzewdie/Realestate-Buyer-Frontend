import logo from '../../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { createUserProfile } from '@/lib/createUserProfile';
import { auth } from '../../../firebase';
import  toast  from "react-hot-toast";

export default function Signup({ setIsAuthenticated }: { setIsAuthenticated: (val: boolean) => void }) {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [isSeller, setIsSeller] = useState(false); 
    const [authing, setAuthing] = useState(false);
    const [error, setError] = useState("");

    const signUpWithEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthing(true);
        setError("");

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const role = isSeller ? 'seller' : 'buyer';

            await createUserProfile(user, {
                name: fullName,
                phone,
                email,
                role,
                createdAt: new Date(),
                favorites: [],
                propertiesListed: []
            });

            setIsAuthenticated(true);
            toast.success('Successfully Signed Up!')
            navigate("/");
        } catch (error: any) {
            setError(error.message);
            setAuthing(false);
        }
    };

    return (
        <div className="flex py-10 h-160 w-200 m-auto">
            <div className='bg-[#50b6c1] w-1/2 flex items-center justify-center hidden sm:flex shadow-xl'>
                <img src={logo} alt="Logo" className='w-40' />
            </div>

            <form 
                onSubmit={signUpWithEmail} 
                className='flex flex-col w-full shadow-xl md:w-1/2 p-8 justify-center gap-3 sm:static sm:translate-x-0 sm:translate-y-0 
                           relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 sm:left-0 sm:top-0'
            >
                <div className='flex justify-between items-center'>
                    <p className='text-2xl font-bold text-[#50b6c1]'>Sign Up</p>
                    <div className='flex space-x-2 items-center'>
                        <p>Seller</p>
                        <Switch checked={isSeller} onCheckedChange={setIsSeller} />
                    </div>
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <p>Full Name</p>
                <Input
                    type='text'
                    placeholder='Enter your name'
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className='border border-gray-300 rounded-md p-2 mb-4'
                />

                <p>Email <span className='text-red-600 font-bold'>*</span></p>
                <Input
                    type="email"
                    placeholder='Enter your email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className='border border-gray-300 rounded-md p-2 mb-4'
                />

                <p>Phone Number</p>
                <Input
                    type="tel"
                    placeholder='Enter your phone number'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className='border border-gray-300 rounded-md p-2 mb-4'
                />

                <p>Password <span className='text-red-600 font-bold'>*</span></p>
                <Input
                    type="password"
                    placeholder='Enter your password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className='border border-gray-300 rounded-md p-2 mb-4'
                />

                <Button type="submit" className='bg-[#50b6c1] p-1.5 text-white rounded-md' disabled={authing}>
                    {authing ? "Creating Account..." : "Sign Up"}
                </Button>

                <p className='text-center'>
                    Already have an account?{" "}
                    <Link to="/login" className='hover:underline text-blue-600'>Login</Link>
                </p>
            </form>
        </div>
    );
}
