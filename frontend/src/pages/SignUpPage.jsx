import {useState} from "react";
import {Link} from "react-router-dom";
import {Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User} from "lucide-react";
import {useAuthStore} from "../store/useAuthStore.js";
import AuthImagePattern from "../components/AuthImagePattern.jsx";
import toast from "react-hot-toast";

function SignUpPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const { signup, isSigningUp } = useAuthStore();

    const validateForm = () => {
        if(!formData.fullName.trim()) return toast.error("Full name is required");
        if(!formData.email.trim()) return toast.error("Email is required");
        if(!/\S+@\S+\.\S+/.test(formData.email.trim())) return toast.error("Invalid email format");
        if(!formData.password.trim()) return toast.error("Password is required");
        if(formData.password.length < 6) return toast.error("Password must be at least 6 characters");

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const success = validateForm();

        if(success === true) signup(formData);
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* left side */}
            <div className="flex flex-col justify-center items-center sm:p-12">

                {/*Logo*/}
                <div className="w-full max-w-md space-y-8">
                    <div className="flex flex-col justify-center items-center mb-8">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <MessageSquare className="size-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                        <p className="text-base-content/60">Get started with your free account</p>
                    </div>
                </div>

                {/*Form*/}
                <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
                    <div className="form-control">
                        <label htmlFor="fullName" className="label">
                            <span className="label-text font-medium">Full Name</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="size-5 text-base-content/40"/>
                            </div>
                            <input
                                type="text"
                                className="input input-bordered w-full pl-10"
                                placeholder="John Doe"
                                id="fullName"
                                value={formData.fullName}
                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label htmlFor="email" className="label">
                            <span className="label-text font-medium">Email</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="size-5 text-base-content/40"/>
                            </div>
                            <input
                                type="email"
                                className="input input-bordered w-full pl-10"
                                placeholder="johndoe@gmail.com"
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label htmlFor="password" className="label">
                            <span className="label-text font-medium">Password</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="size-5 text-base-content/40"/>
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="input input-bordered w-full pl-10"
                                placeholder="********"
                                id="password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? (
                                    <EyeOff className="size-5 text-base-content/40" />
                                ) : (
                                    <Eye className="size-5 text-base-content/40" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
                        {isSigningUp ? (<>
                            <Loader2 className="size-5 animate-spin" />
                            Loading...
                        </>) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-base-content/60">
                        Already have an account?{" "}
                        <Link to="/login" className="link link-primary">Sign in</Link>
                    </p>
                </div>
            </div>

            {/* Right */}
            <AuthImagePattern
                title="Join our community"
                subtitle="Connect with friends, share moments, and stay in touch with your loved ones"
            />
        </div>
    )
}

export default SignUpPage;