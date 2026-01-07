import React from 'react';
import { Star, Quote } from 'lucide-react';

export const FeedbackCarousel = ({ feedbacks }) => {
    return (
        <div className="bg-white border border-white/40 rounded-[28px] p-6 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.2)] min-h-[420px] flex flex-col col-span-12 lg:col-span-6">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>User Feedback</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {feedbacks.slice(0, 2).map((fb, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', position: 'relative' }}>
                        <Quote size={20} style={{ position: 'absolute', top: '10px', right: '10px', opacity: 0.1 }} />
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill={i < fb.rating ? "#fbbf24" : "none"} stroke={i < fb.rating ? "#fbbf24" : "#cbd5e1"} />
                            ))}
                        </div>
                        <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#475569', marginBottom: '12px' }}>"{fb.feedback}"</p>
                        <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>- {fb.userName}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
