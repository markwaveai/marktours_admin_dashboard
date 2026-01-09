import React from 'react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
    LineChart,
    Line,
    Legend,
    PieChart,
    Pie,
    BarChart,
    Bar
} from 'recharts';

const COLORS = ['#0088cc', '#0099e6', '#33adff', '#66c2ff', '#99d6ff'];

export const MonthlyReportChart = ({ data, title }) => (
    <div className="bg-white border border-white/40 rounded-[28px] p-6 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.2)] min-h-[420px] flex flex-col col-span-12 lg:col-span-6">
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>{title}</h3>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="users" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export const DailyActivityChart = ({ data, title }) => (
    <div className="bg-white border border-white/40 rounded-[28px] p-6 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.2)] min-h-[420px] flex flex-col col-span-12 lg:col-span-6">
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>{title}</h3>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" hide />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Line type="monotone" dataKey="activeUsers" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export const BranchRankChart = ({ data, title }) => (
    <div className="bg-white border border-white/40 rounded-[28px] p-5 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.2)] min-h-[400px] flex flex-col col-span-12 lg:col-span-6">
        <h3 style={{ marginBottom: '1.2rem', fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>{title}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.slice(0, 5).map((branch, index) => {
                const colors = ['#0ea5e9', '#10b981', '#6366f1', '#f59e0b', '#ec4899'];
                return (
                    <div key={index} style={{
                        padding: '12px 14px',
                        background: '#f8fafc',
                        borderRadius: '16px',
                        border: '1px solid #f1f5f9'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e293b' }}>{branch.branchName}</span>
                            <span style={{ fontWeight: 800, fontSize: '0.85rem', color: colors[index % colors.length] }}>{branch.userCount}</span>
                        </div>
                        <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{
                                width: `${(branch.userCount / Math.max(...data.map(d => d.userCount))) * 100}%`,
                                height: '100%',
                                background: colors[index % colors.length],
                                borderRadius: '10px'
                            }} />
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);
