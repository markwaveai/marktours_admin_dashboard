import React from 'react';
import { Clock, Star, MapPin, Navigation } from 'lucide-react';

export const TourInsights = ({ data }) => {
    return (
        <div className="bg-white border border-white/40 rounded-[28px] p-6 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.2)] min-h-[420px] flex flex-col col-span-12 lg:col-span-6">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Tour Occupancy</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {data.tourOccupancy?.slice(0, 4).map((tour, idx) => (
                    <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                            <span style={{ fontWeight: 500 }}>{tour.tourName}</span>
                            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{tour.percentage}%</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
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
        <div className="bg-white border border-white/40 rounded-[28px] p-6 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.2)] min-h-[420px] flex flex-col col-span-12 lg:col-span-6">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Upcoming Tours</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.upcomingTours?.map((tour, idx) => (
                    <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        border: '1px solid #f1f5f9',
                        borderRadius: '12px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ padding: '8px', background: '#f0f9ff', color: 'var(--primary)', borderRadius: '8px' }}>
                                <Clock size={18} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{tour.tourName}</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tour.date}</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{tour.bookings} Bookings</p>
                            <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: '#dcfce7', color: '#166534', borderRadius: '10px' }}>Confirmed</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const TrendingPlaces = ({ data }) => {
    return (
        <div className="bg-white border border-white/40 rounded-[28px] p-6 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.2)] min-h-[420px] flex flex-col col-span-12 lg:col-span-6">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Most Visited Places</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {data.mostVisitedPlaces?.slice(0, 4).map((item, idx) => (
                    <div key={idx} style={{
                        padding: '16px',
                        background: 'linear-gradient(45deg, #f8fafc 0%, #ffffff 100%)',
                        borderRadius: '16px',
                        border: '1px solid #f1f5f9',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <MapPin size={18} style={{ color: 'var(--primary)' }} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>#{idx + 1}</span>
                        </div>
                        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.place}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.visits.toLocaleString()} Visits</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const TourMap = () => {
    const hubs = [
        { name: 'Dubai', status: 'Active' },
        { name: 'Bali', status: 'Active' },
        { name: 'Thailand', status: 'Busy' },
        { name: 'Vietnam', status: 'Upcoming' },
        { name: 'Sri Lanka', status: 'Active' },
        { name: 'Malaysia', status: 'Active' },
        { name: 'Kerala', status: 'Trending' }
    ];

    return (
        <div className="bg-white border border-white/40 rounded-[28px] p-6 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.2)] min-h-[420px] flex flex-col col-span-12 lg:col-span-6 overflow-hidden">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Regional Tour Connectivity</h3>
                <Navigation size={18} style={{ color: 'var(--primary)' }} />
            </div>
            <div style={{
                width: '100%',
                height: '240px',
                background: '#f8fafc',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                border: '1px solid #e2e8f0'
            }}>
                {/* Stylized SVG Map for Asian Region */}
                <svg viewBox="0 0 800 400" style={{ width: '90%', height: '90%', opacity: 0.15 }}>
                    <path d="M400,100 Q500,50 600,150 T750,250" fill="none" stroke="var(--primary)" strokeWidth="2" strokeDasharray="5,5" />
                    <path d="M350,200 Q450,250 550,200 T700,300" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3,3" />
                    <circle cx="400" cy="150" r="4" fill="var(--primary)" />
                    <circle cx="600" cy="200" r="4" fill="var(--primary)" />
                    <circle cx="500" cy="250" r="4" fill="#10b981" />
                </svg>

                {/* Floating Labels for requested locations */}
                <div style={{ position: 'absolute', top: '10%', left: '15%', padding: '6px 12px', background: 'white', borderRadius: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid #eee', fontSize: '0.75rem', fontWeight: 700 }}>
                    Dubai Hub
                </div>
                <div style={{ position: 'absolute', bottom: '20%', right: '15%', padding: '6px 12px', background: 'white', borderRadius: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid #eee', fontSize: '0.75rem', fontWeight: 700 }}>
                    Bali & Malaysia
                </div>
                <div style={{ position: 'absolute', bottom: '40%', left: '30%', padding: '6px 12px', background: 'white', borderRadius: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid #eee', fontSize: '0.75rem', fontWeight: 700, borderColor: 'var(--primary-light)' }}>
                    Kerala & Sri Lanka
                </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>Active Market Hubs</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {hubs.map((hub, idx) => (
                        <span key={idx} style={{
                            fontSize: '0.7rem',
                            padding: '4px 10px',
                            background: hub.status === 'Trending' ? '#f0f9ff' : '#f1f5f9',
                            color: hub.status === 'Trending' ? 'var(--primary)' : '#475569',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            fontWeight: 600
                        }}>
                            {hub.name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const TopTours = ({ data }) => {
    return (
        <div className="bg-white border border-white/40 rounded-[28px] p-6 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.2)] min-h-[420px] flex flex-col col-span-12 lg:col-span-6">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Top Performing Tours</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.tourOccupancy?.slice(0, 3).map((tour, idx) => (
                    <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        background: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                        border: '1px solid #f1f5f9'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{
                                fontSize: '1.2rem',
                                fontWeight: 800,
                                color: idx === 0 ? '#fbbf24' : '#94a3b8',
                                width: '30px'
                            }}>
                                {idx + 1}
                            </span>
                            <div>
                                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{tour.tourName}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Star size={12} fill="#fbbf24" stroke="#fbbf24" />
                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>4.9 (120+ reviews)</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' }}>{tour.percentage}%</p>
                            <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Occupancy</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
