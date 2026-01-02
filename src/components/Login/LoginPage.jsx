import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    // const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (email === "admin" && password === "mark@2025") {
            navigate("/admin-dashboard");
        } else {
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 relative overflow-hidden">

            {/* Background Elements */}
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] 
rounded-full mix-blend-screen filter blur-3xl opacity-25 animate-blob"
style={{ backgroundColor: "#00E5FF" }}></div>

<div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] 
rounded-full mix-blend-screen filter blur-3xl opacity-25 animate-blob animation-delay-2000"
style={{ backgroundColor: "#00BFFF" }}></div>

<div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] 
rounded-full mix-blend-screen filter blur-3xl opacity-25 animate-blob animation-delay-4000"
style={{ backgroundColor: "#38E8FF" }}></div>


            <div className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-md border border-blue/20 rounded-2xl shadow-2xl">

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-gray-300">Login to access the Admin Dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            placeholder="Enter your username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-400">
                    Forgot your password? <a href="#" className="text-indigo-400 hover:underline">Contact Support</a>
                </p>
            </div>
        </div>
    );
}
