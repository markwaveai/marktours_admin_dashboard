import React from 'react';
import { Star, Quote } from 'lucide-react';

export const FeedbackCarousel = ({ feedbacks }) => {
    return (
        <div className="bg-white border border-white/40 rounded-[28px] p-6 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.2)] min-h-[300px] flex flex-col col-span-12">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-[1.1rem] font-bold text-[#1e293b]">User Feedback</h3>
                <div className="flex items-center gap-2 text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full text-xs font-bold">
                    <Quote size={12} />
                    <span>Real-time Reviews</span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {feedbacks.slice(0, 6).map((fb, idx) => (
                    <div key={idx} className="bg-[#f8fafc] p-5 rounded-2xl border border-f1f5f9 transition-all hover:border-indigo-200 hover:bg-white hover:shadow-md">
                        <div className="flex gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} fill={i < fb.rating ? "#fbbf24" : "none"} stroke={i < fb.rating ? "#fbbf24" : "#cbd5e1"} />
                            ))}
                        </div>
                        <p className="text-[0.85rem] italic text-[#475569] mb-4 font-medium leading-relaxed">"{fb.feedback}"</p>
                        <div className="flex items-center gap-3 mt-auto">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                {fb.userName.charAt(0)}
                            </div>
                            <div>
                                <p className="text-[0.75rem] font-bold text-[#1e293b]">{fb.userName}</p>
                                <p className="text-[0.65rem] text-slate-400">Verified Customer</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
