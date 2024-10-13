/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useState } from "react";
// Firebase v9 modular imports
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate(); // Initialize useNavigate

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
        const { email, password } = formData; // Destructure email and password from formData

        try {
            // Sign in with Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // Get the Firebase ID token
            const idToken = await userCredential.user.getIdToken();

            // Send the ID token to your backend for verification
            const response = await axios.post("http://localhost:3000/api/auth/login", {
                idToken,
            });

            console.log(response.data);

            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("uid", response.data.uid);

            // Show success notification
            toast.success("Login successful!");

            // Navigate to the dashboard after successful login
            setTimeout(() => {
                navigate("/dashboard");
            }, 1500); // Change to your dashboard route

        } catch (error) {
            console.error("Login failed:", error);
            const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
            // Show error notification with message from backend or a default message
            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4 py-8">
            <div className="bg-zinc-800 p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-3xl font-bold text-zinc-100 mb-6 text-center">
                    Login
                </h2>
                <form onSubmit={handleSubmit}> {/* Change the button type to submit */}
                    <div className="mb-4">
                        <label
                            className="block text-zinc-400 text-sm font-semibold mb-2"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            type="email"  // Corrected type from text to email
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-zinc-700 text-zinc-100 border border-zinc-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-zinc-400 text-sm font-semibold mb-2"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            type="password"  // Secure the password field
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-zinc-700 text-zinc-100 border border-zinc-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit" // Changed to type "submit"
                        className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Login
                    </button>
                </form>
            </div>
            <ToastContainer /> {/* Add ToastContainer for notifications */}
        </div>
    );
};

export default Login;
