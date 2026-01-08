import React from 'react';
import { Star, Quote } from 'lucide-react';

export const FeedbackCarousel = ({ feedbacks }) => {
    return (
        <div className="bg-white border border-white/40 rounded-[28px] p-5 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.2)] min-h-[400px] flex flex-col col-span-12 lg:col-span-3">
            <h3 style={{ marginBottom: '1.2rem', fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>User Feedback</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {feedbacks.slice(0, 3).map((fb, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '16px', position: 'relative', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', gap: '2px', marginBottom: '6px' }}>
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={10} fill={i < fb.rating ? "#fbbf24" : "none"} stroke={i < fb.rating ? "#fbbf24" : "#cbd5e1"} />
                            ))}
                        </div>
                        <p style={{ fontSize: '0.75rem', fontStyle: 'italic', color: '#475569', marginBottom: '6px', lineHeight: '1.4' }}>"{fb.feedback.length > 60 ? fb.feedback.substring(0, 60) + '...' : fb.feedback}"</p>
                        <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1e293b' }}>- {fb.userName.split(' ')[0]}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
