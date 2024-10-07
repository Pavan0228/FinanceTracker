/* eslint-disable no-unused-vars */
import React, { useState } from "react";

const Login = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Perform login logic here
        console.log(formData);
    };

    return (
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4 py-8">
            <div className="bg-zinc-800 p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-3xl font-bold text-zinc-100 mb-6 text-center">
                    Login
                </h2>
                <div className="mb-4">
                    <label
                        className="block text-zinc-400 text-sm font-semibold mb-2"
                        htmlFor="username"
                    >
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
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
                        type="text"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-zinc-700 text-zinc-100 border border-zinc-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default Login;
