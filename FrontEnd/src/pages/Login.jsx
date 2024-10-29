/* eslint-disable no-unused-vars */
import React, { useState } from "react";
// Firebase v9 modular imports
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast notifications
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { login } from "../store/authSlice";
import { useDispatch } from "react-redux";
import {
    MessageSquare,
    Receipt,
    Smartphone,
    CreditCard,
    ChevronRight,
    Mail,
    Lock,
} from "lucide-react";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize useNavigate
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    

    const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    };

    // Initialize Firebase app (run only once)
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const { email, password } = formData; // Destructure email and password from formData

        try {
            // Sign in with Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            // Get the Firebase ID token
            const idToken = await userCredential.user.getIdToken();

            // Dispatch login action to Redux
            dispatch(login({ idToken }));

            setTimeout(() => {
                setIsLoading(false);
                navigate("/dashboard");
            }, 2000); // Change to your dashboard route

        } catch (error) {
            console.error("Login failed:", error);
            const errorMessage =
                error.response?.data?.message ||
                "please enter a valid credentials";
            // Show error notification with message from backend or a default message
            toast.error(errorMessage);
            setIsLoading(false);
        }
    };

    const FloatingMessage = ({ icon: Icon, color, className }) => (
        <div className={`absolute ${className} animate-bounce opacity-20`}>
            <div className={`p-2 rounded-lg ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md">
                {/* Animated floating messages using Tailwind's built-in animations */}
                <FloatingMessage
                    icon={MessageSquare}
                    color="text-green-400"
                    className="top-0 -left-8 animate-[bounce_3s_ease-in-out_infinite]"
                />
                <FloatingMessage
                    icon={Receipt}
                    color="text-blue-400"
                    className="top-20 -right-8 animate-[bounce_3s_ease-in-out_infinite_0.5s]"
                />
                <FloatingMessage
                    icon={CreditCard}
                    color="text-purple-400"
                    className="bottom-20 -left-8 animate-[bounce_3s_ease-in-out_infinite_1s]"
                />

                <div className="relative bg-zinc-800/90 p-6 rounded-2xl shadow-xl backdrop-blur-sm border border-zinc-700">
                    {/* App Header with subtle animation */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="bg-blue-500/10 p-3 rounded-xl mb-4 hover:scale-110 transition-transform duration-300">
                            <Smartphone className="w-8 h-8 text-blue-400 animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-100 text-center">
                            SMS Expense Tracker
                        </h2>
                        <p className="text-zinc-400 text-sm mt-2 text-center">
                            Automatically track expenses from your messages
                        </p>
                    </div>

                    {/* Message Sources with hover animations */}
                    <div className="flex justify-around mb-8 px-4">
                        <div className="flex flex-col items-center group">
                            <div className="bg-green-500/10 p-2 rounded-lg mb-2 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-green-500/20">
                                <MessageSquare className="w-5 h-5 text-green-400" />
                            </div>
                            <span className="text-xs text-zinc-400">SMS</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-600 mt-3 animate-pulse" />
                        <div className="flex flex-col items-center group">
                            <div className="bg-blue-500/10 p-2 rounded-lg mb-2 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-500/20">
                                <Receipt className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="text-xs text-zinc-400">GPay</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-600 mt-3 animate-pulse" />
                        <div className="flex flex-col items-center group">
                            <div className="bg-purple-500/10 p-2 rounded-lg mb-2 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-purple-500/20">
                                <CreditCard className="w-5 h-5 text-purple-400" />
                            </div>
                            <span className="text-xs text-zinc-400">Bank</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="transform transition-all duration-300 hover:scale-[1.02]">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-zinc-700/50 text-zinc-100 border border-zinc-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="transform transition-all duration-300 hover:scale-[1.02]">
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-zinc-700/50 text-zinc-100 border border-zinc-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                "Login to Track Expenses"
                            )}
                        </button>

                        <div className="flex items-center justify-between text-sm pt-2">
                            <label className="flex items-center text-zinc-400 hover:text-zinc-300 transition-colors">
                                <input type="checkbox" className="mr-2" />
                                Remember me
                            </label>
                            <Link
                                to="/"
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </form>

                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Login;
