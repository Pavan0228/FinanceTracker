/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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
    <div className="min-h-screen bg-gradient-to-r from-zinc-900 to-gray-800 flex items-center justify-center px-4 py-8">
      <div className="bg-zinc-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-4xl font-extrabold text-white mb-6 text-center">Login</h2>
        <p className="text-zinc-400 text-sm text-center mb-8">
          Welcome back! Please enter your credentials.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-zinc-300 text-sm font-medium mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-700 text-zinc-100 placeholder-zinc-500 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-zinc-300 text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-700 text-zinc-100 placeholder-zinc-500 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-blue-400 hover:underline">
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
