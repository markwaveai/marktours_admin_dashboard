import React from 'react';
import { Clock, Star, MapPin, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TourInsights = ({ data }) => {
    return (
        <div className="bg-white border border-white/40 rounded-[28px] p-5 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.2)] min-h-[400px] flex flex-col col-span-12 lg:col-span-3">
            <h3 style={{ marginBottom: '1.2rem', fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Tour Occupancy</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {data.tourOccupancy?.slice(0, 5).map((tour, idx) => (
                    <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8rem' }}>
                            <span style={{ fontWeight: 600, color: '#64748b' }}>{tour.tourName}</span>
                            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{tour.percentage}%</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{
                                width: `${tour.percentage}%`,
                                height: '100%',
                                background: 'var(--primary)',
                                borderRadius: '10px'
                            }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const UpcomingTours = ({ data }) => {
    return (
        <div className="bg-white border border-white/40 rounded-[28px] p-5 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.2)] min-h-[400px] flex flex-col col-span-12 lg:col-span-3">
            <h3 style={{ marginBottom: '1.2rem', fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Upcoming Tours</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data.upcomingTours?.slice(0, 4).map((tour, idx) => (
                    <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 14px',
                        border: '1px solid #f1f5f9',
                        borderRadius: '16px',
                        background: '#f8fafc'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ padding: '6px', background: '#f0f9ff', color: 'var(--primary)', borderRadius: '10px' }}>
                                <Clock size={14} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>{tour.tourName.split(' ')[0]}...</p>
                                <p style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>{tour.date}</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e293b' }}>{tour.bookings}</p>
                            <span style={{ fontSize: '0.65rem', padding: '1px 6px', background: '#dcfce7', color: '#166534', borderRadius: '6px', fontWeight: 700 }}>Active</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const TrendingPlaces = ({ data }) => {
    return (
        <div className="bg-white border border-white/40 rounded-[28px] p-5 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.2)] min-h-[400px] flex flex-col col-span-12 lg:col-span-3">
            <h3 style={{ marginBottom: '1.2rem', fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Most Visited Places</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data.mostVisitedPlaces?.slice(0, 5).map((item, idx) => (
                    <div key={idx} style={{
                        padding: '12px 14px',
                        background: '#f8fafc',
                        borderRadius: '16px',
                        border: '1px solid #f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ color: 'var(--primary)' }}>
                                <MapPin size={16} />
                            </div>
                            <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e293b' }}>{item.place}</p>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>{item.visits.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const TourMap = () => {
    const hubs = [
        { name: 'Dubai', coords: [25, 45], status: 'Active' },
        { name: 'Kerala', coords: [48, 72], status: 'Trending' },
        { name: 'Sri Lanka', coords: [55, 85], status: 'Active' },
        { name: 'Thailand', coords: [75, 55], status: 'Busy' },
        { name: 'Malaysia', coords: [82, 75], status: 'Active' },
        { name: 'Vietnam', coords: [88, 45], status: 'Upcoming' },
        { name: 'Bali', coords: [92, 85], status: 'Active' }
    ];

    return (
        <div className="bg-white border border-white/40 rounded-[28px] p-5 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.2)] min-h-[400px] flex flex-col col-span-12 lg:col-span-3 overflow-hidden">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Regional View</h3>
                <div
                    onClick={() => window.open('https://www.google.com/maps/dir/Dubai/Kerala/Sri+Lanka/Thailand/Malaysia/Bali/Vietnam', '_blank')}
                    style={{
                        padding: '6px',
                        background: '#f8f9ff',
                        borderRadius: '10px',
                        color: '#6366f1',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    className="hover:bg-indigo-50 hover:scale-110 active:scale-95"
                    title="View International Route on Google Maps"
                >
                    <Navigation size={14} />
                </div>
            </div>

            <div style={{
                width: '100%',
                height: '180px',
                background: 'linear-gradient(135deg, #f8faff 0%, #f1f5f9 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                border: '1px solid #e2e8f0',
                overflow: 'hidden'
            }}>
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <path d="M5,40 Q15,30 25,45 T45,55 T65,45 T85,35 L90,90 L5,90 Z" fill="#e0e7ff" opacity="0.6" />
                    <path d="M10,45 Q20,35 30,50 T50,60 T70,50 T90,40 L95,95 L10,95 Z" fill="#dee2e6" opacity="0.4" />
                </svg>

                {hubs.map((hub, idx) => (
                    <div
                        key={idx}
                        style={{
                            position: 'absolute',
                            left: `${hub.coords[0]}%`,
                            top: `${hub.coords[1]}%`,
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        <motion.div
                            animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2.5, repeat: Infinity, delay: idx * 0.3 }}
                            style={{ position: 'absolute', width: '10px', height: '10px', background: '#6366f1', borderRadius: '50%' }}
                        />
                        <div style={{
                            width: '6px',
                            height: '6px',
                            background: '#4f46e5',
                            borderRadius: '50%',
                            border: '1px solid white',
                            boxShadow: '0 0 5px rgba(79, 70, 229, 0.4)',
                            position: 'relative',
                            cursor: 'pointer'
                        }} className="group">
                            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white px-2 py-1 rounded-md shadow-lg -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 text-[0.6rem] font-bold">
                                {hub.name}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {hubs.map((hub, idx) => (
                        <div key={idx} style={{
                            fontSize: '0.65rem',
                            padding: '4px 8px',
                            background: 'white',
                            color: '#475569',
                            borderRadius: '10px',
                            fontWeight: 700,
                            border: '1px solid #f1f5f9'
                        }}>
                            {hub.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const TopTours = ({ data }) => {
    return (
        <div className="bg-white border border-white/40 rounded-[28px] p-5 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.2)] min-h-[400px] flex flex-col col-span-12 lg:col-span-3">
            <h3 style={{ marginBottom: '1.2rem', fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Top Performing</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data.tourOccupancy?.slice(0, 4).map((tour, idx) => (
                    <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 14px',
                        background: 'white',
                        borderRadius: '16px',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1rem', fontWeight: 800, color: idx === 0 ? '#fbbf24' : '#94a3b8', width: '24px' }}>{idx + 1}</span>
                            <div>
                                <p style={{ fontWeight: 700, fontSize: '0.8rem', color: '#1e293b' }}>{tour.tourName.split(' ')[0]}...</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                    <Star size={10} fill="#fbbf24" stroke="#fbbf24" />
                                    <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>4.9</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' }}>{tour.percentage}%</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
