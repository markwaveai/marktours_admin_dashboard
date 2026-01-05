import React, { useState, useEffect } from "react";
import { useToast } from "../../context/ToastContext";
import { FaApple, FaGoogle, FaLinkedinIn } from "react-icons/fa";
import { RiSmartphoneLine, RiLockPasswordLine } from "react-icons/ri";

export default function LoginPage({ setShowLogin }) {
    const { addToast } = useToast();
    const [step, setStep] = useState(1); // 1: Mobile, 2: OTP
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    
    // Animation state
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        setLoaded(true);
    }, []);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!mobile || mobile.length !== 10) {
            addToast("Please enter a valid 10-digit mobile number.", "error");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("https://marktours-services-jn6cma3vvq-el.a.run.app/otp/send-whatsapp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mobile: mobile,
                    appName: "Mark Tours Admin",
                    first_name: "Admin",
                    last_name: "User"
                })
            });

            if (res.ok) {
                addToast("OTP sent successfully via WhatsApp!", "success");
                setStep(2);
            } else {
                addToast("Failed to send OTP. Please try again.", "error");
            }
        } catch (err) {
            console.error(err);
            addToast("Network error. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp || otp.length < 4) {
            addToast("Please enter the valid OTP.", "error");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("https://marktours-services-jn6cma3vvq-el.a.run.app/otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mobile: mobile,
                    otp: otp
                })
            });

            if (res.ok) {
                const data = await res.json().catch(() => ({})); 
                addToast("Login Successful", "success");
                setShowLogin(false); 
            } else {
                addToast("Invalid OTP. Please try again.", "error");
            }
        } catch (err) {
            console.error("Verification Error", err);
            addToast("Verification failed. Please check your connection.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-blue-300 font-sans">
            {/* Sky Background with Clouds */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-sky-300 via-sky-200 to-white/80"></div>
            
            {/* Cloud Decorations (simulated with CSS) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                 <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-white rounded-full mix-blend-screen filter blur-[80px] opacity-80 animate-cloud-slow"></div>
                 <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-white rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-cloud-slower"></div>
                 <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[400px] bg-white rounded-full mix-blend-screen filter blur-[100px] opacity-90"></div>
                 
                 {/* Subtle Concentric Circles Overlay */}
                 <div className="absolute inset-0 opacity-20" style={{ 
                     backgroundImage: 'repeating-radial-gradient(circle at center bottom, transparent 0, transparent 40px, #ffffff 41px, transparent 42px)',
                     backgroundSize: '100% 100%',
                     maskImage: 'linear-gradient(to top, black, transparent)'
                 }}></div>
            </div>

            {/* Glass Card */}
            <div 
                className={`
                    relative z-10 w-full max-w-[420px] mx-4
                    bg-white/40 backdrop-blur-xl border border-white/60
                    rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 px-10
                    flex flex-col items-center
                    transition-all duration-700 ease-out transform
                    ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                `}
            >
                {/* Header Icon */}
                <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 p-4">
                    <img src="/images/favicon.png" alt="Logo" className="w-full h-full object-contain" />
                </div>

                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back</h1>
                    <p className="text-gray-500 text-sm">Please enter your detail to sign in.</p>
                </div>

                {/* Form */}
                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="w-full space-y-5">
                        <div className="space-y-2">
                             <label className="text-sm font-semibold text-gray-700 ml-1">Mobile Number</label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    className="block w-full px-4 py-3 pl-4 bg-gray-100/50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all font-medium"
                                    placeholder="Enter your mobile..."
                                    value={mobile}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        if(val.length <= 10) setMobile(val);
                                    }}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <RiSmartphoneLine size={18} />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                <span className="ml-2 text-xs text-gray-500 font-medium">Remember me</span>
                            </label>
                            <a href="#" className="text-xs text-gray-500 hover:text-gray-700 font-medium underline-offset-2 hover:underline">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || mobile.length !== 10}
                            className={`
                                w-full py-3.5 px-6 rounded-xl font-bold text-white shadow-lg text-sm tracking-wide
                                bg-gray-900 hover:bg-black
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900
                                transition-all duration-300 transform hover:-translate-y-0.5
                                disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
                                mt-2
                            `}
                        >
                            {loading ? "Sending..." : "Sign in"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between bg-blue-50/50 rounded-lg p-3 mb-2 border border-blue-100">
                             <span className="text-gray-700 font-medium tracking-wide text-sm">+91 {mobile}</span>
                            <button 
                                type="button" 
                                onClick={() => setStep(1)}
                                className="text-xs text-blue-600 hover:text-blue-700 font-bold"
                            >
                                Edit
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">One Time Password</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="block w-full px-4 py-3 bg-gray-100/50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-center tracking-[0.5em] font-bold focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all shadow-sm"
                                    placeholder="••••"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        if(val.length <= 6) setOtp(val);
                                    }}
                                    autoFocus
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <RiLockPasswordLine size={18} />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.length < 4}
                             className={`
                                w-full py-3.5 px-6 rounded-xl font-bold text-white shadow-lg text-sm tracking-wide
                                bg-gray-900 hover:bg-black
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900
                                transition-all duration-300 transform hover:-translate-y-0.5
                                disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
                                mt-2
                            `}
                        >
                             {loading ? "Verifying..." : "Verify & Login"}
                        </button>
                         <div className="text-center pt-2">
                              <button 
                                type="button"
                                className="text-xs text-gray-500 hover:text-gray-800 transition-colors font-medium"
                                onClick={handleSendOtp}
                            >
                                Resend OTP
                            </button>
                         </div>
                    </form>
                )}

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500">
                        Don't have an account yet? <a href="#" className="font-bold text-gray-800 hover:underline">Sign up</a>
                    </p>
                </div>
            </div>
            
            <style jsx>{`
                @keyframes cloud-slow {
                    0% { transform: translateX(0); }
                    50% { transform: translateX(20px); }
                    100% { transform: translateX(0); }
                }
                .animate-cloud-slow {
                    animation: cloud-slow 10s infinite ease-in-out;
                }
                 .animate-cloud-slower {
                    animation: cloud-slow 15s infinite ease-in-out reverse;
                }
            `}</style>
        </div>
    );
}
