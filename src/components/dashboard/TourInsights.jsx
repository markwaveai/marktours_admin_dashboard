import React from 'react';
import { Clock, Star, MapPin, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TourInsights = ({ data }) => {
    return (
        <div className="bg-white border border-white/40 rounded-[28px] p-5 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.2)] min-h-[400px] flex flex-col col-span-12 lg:col-span-4">
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
        <div className="bg-white border border-white/40 rounded-[28px] p-5 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.2)] min-h-[400px] flex flex-col col-span-12 lg:col-span-6">
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
        <div className="bg-white border border-white/40 rounded-[28px] p-5 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.2)] min-h-[400px] flex flex-col col-span-12 lg:col-span-4">
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
        { name: 'Dubai', coords: [30, 35], status: 'Active', bookings: 245, color: '#6366f1' },
        { name: 'Kerala', coords: [35, 50], status: 'Trending', bookings: 189, color: '#8b5cf6' },
        { name: 'Sri Lanka', coords: [38, 55], status: 'Active', bookings: 156, color: '#6366f1' },
        { name: 'Thailand', coords: [50, 45], status: 'Busy', bookings: 312, color: '#ec4899' },
        { name: 'Malaysia', coords: [55, 55], status: 'Active', bookings: 198, color: '#6366f1' },
        { name: 'Vietnam', coords: [52, 38], status: 'Upcoming', bookings: 87, color: '#10b981' },
        { name: 'Bali', coords: [60, 58], status: 'Active', bookings: 223, color: '#6366f1' }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Trending': return '#8b5cf6';
            case 'Busy': return '#ec4899';
            case 'Upcoming': return '#10b981';
            default: return '#6366f1';
        }
    };

    return (
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-100/50 rounded-[28px] p-6 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.15)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.25)] min-h-[400px] flex flex-col col-span-12 lg:col-span-6 overflow-hidden">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.25rem' }}>Regional View</h3>
                    <p style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>Live tour destinations across Asia</p>
                </div>
                <div
                    onClick={() => window.open('https://www.google.com/maps/dir/Dubai/Kerala/Sri+Lanka/Thailand/Malaysia/Bali/Vietnam', '_blank')}
                    style={{
                        padding: '8px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        borderRadius: '12px',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                    }}
                    className="hover:scale-110 active:scale-95"
                    title="View International Route on Google Maps"
                >
                    <Navigation size={16} />
                </div>
            </div>

            {/* Modern Map Container */}
            <div style={{
                width: '100%',
                height: '220px',
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 50%, #f3e8ff 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                border: '2px solid rgba(99, 102, 241, 0.1)',
                overflow: 'hidden',
                boxShadow: 'inset 0 2px 10px rgba(99, 102, 241, 0.05)'
            }}>
                {/* Decorative Background Elements */}
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0.3 }}>
                    {/* Continents silhouette */}
                    <path d="M20,30 Q25,25 30,30 L35,28 Q40,30 42,35 L45,33 Q48,35 50,40 L52,38 Q55,40 58,45 L60,42 Q65,45 68,50 L70,48 Q75,50 78,55"
                        fill="none" stroke="#6366f1" strokeWidth="0.5" opacity="0.4" />
                    <circle cx="30" cy="35" r="15" fill="#c7d2fe" opacity="0.2" />
                    <circle cx="55" cy="48" r="18" fill="#ddd6fe" opacity="0.2" />
                    <circle cx="70" cy="55" r="12" fill="#e9d5ff" opacity="0.2" />
                </svg>

                {/* Connection Lines */}
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', position: 'absolute', pointerEvents: 'none' }}>
                    {hubs.map((hub, idx) => {
                        if (idx < hubs.length - 1) {
                            const next = hubs[idx + 1];
                            return (
                                <motion.line
                                    key={idx}
                                    x1={hub.coords[0]}
                                    y1={hub.coords[1]}
                                    x2={next.coords[0]}
                                    y2={next.coords[1]}
                                    stroke="url(#lineGradient)"
                                    strokeWidth="0.3"
                                    strokeDasharray="2,2"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 0.6 }}
                                    transition={{ duration: 2, delay: idx * 0.2 }}
                                />
                            );
                        }
                        return null;
                    })}
                    <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Location Pins */}
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
                        {/* Pulse Animation */}
                        <motion.div
                            animate={{
                                scale: [1, 2.5, 1],
                                opacity: [0.6, 0, 0.6]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: idx * 0.4
                            }}
                            style={{
                                position: 'absolute',
                                width: '20px',
                                height: '20px',
                                background: getStatusColor(hub.status),
                                borderRadius: '50%',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)'
                            }}
                        />

                        {/* Pin Dot */}
                        <motion.div
                            whileHover={{ scale: 1.3 }}
                            style={{
                                width: '12px',
                                height: '12px',
                                background: `linear-gradient(135deg, ${getStatusColor(hub.status)} 0%, ${getStatusColor(hub.status)}dd 100%)`,
                                borderRadius: '50%',
                                border: '2px solid white',
                                boxShadow: `0 0 12px ${getStatusColor(hub.status)}88, 0 4px 8px rgba(0,0,0,0.1)`,
                                position: 'relative',
                                cursor: 'pointer',
                                zIndex: 10
                            }}
                            className="group"
                        >
                            {/* Tooltip */}
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                whileHover={{ opacity: 1, y: 0 }}
                                className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 pointer-events-none"
                            >
                                <div style={{
                                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                                    color: 'white',
                                    padding: '8px 12px',
                                    borderRadius: '12px',
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '2px' }}>{hub.name}</p>
                                    <p style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{hub.bookings} bookings</p>
                                    <div style={{
                                        fontSize: '0.6rem',
                                        padding: '2px 6px',
                                        background: getStatusColor(hub.status),
                                        borderRadius: '6px',
                                        marginTop: '4px',
                                        display: 'inline-block'
                                    }}>
                                        {hub.status}
                                    </div>
                                </div>
                                {/* Arrow */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '-4px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 0,
                                    height: 0,
                                    borderLeft: '5px solid transparent',
                                    borderRight: '5px solid transparent',
                                    borderTop: '5px solid #1e293b'
                                }} />
                            </motion.div>
                        </motion.div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                    {hubs.map((hub, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 1.05, y: -2 }}
                            style={{
                                fontSize: '0.7rem',
                                padding: '6px 12px',
                                background: 'white',
                                color: '#475569',
                                borderRadius: '12px',
                                fontWeight: 700,
                                border: '1.5px solid #e2e8f0',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <div style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: getStatusColor(hub.status)
                            }} />
                            {hub.name}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const TopTours = ({ data }) => {
    return (
        <div className="bg-white border border-white/40 rounded-[28px] p-5 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.2)] min-h-[400px] flex flex-col col-span-12 lg:col-span-6">
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
