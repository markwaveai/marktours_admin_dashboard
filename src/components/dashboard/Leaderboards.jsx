import React from 'react';
import { Award, Users } from 'lucide-react';

const AgentLeaderboard = ({ agents }) => {
    return (
        <div className="bg-white border border-white/40 rounded-[28px] p-5 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.2)] min-h-[400px] flex flex-col col-span-12 lg:col-span-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Agent Leaderboard</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {agents.slice(0, 5).map((agent, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            background: index === 0 ? '#f0f9ff' : '#f8fafc',
                            borderRadius: '14px',
                            border: index === 0 ? '1px solid #e0f2fe' : '1px solid #f1f5f9'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: index === 0 ? '#fbbf24' : '#e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: index === 0 ? 'white' : '#94a3b8',
                                fontSize: '0.75rem',
                                fontWeight: 800
                            }}>
                                {index === 0 ? <Award size={14} /> : index + 1}
                            </div>
                            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e293b' }}>{agent.name.split(' ')[0]}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Users size={12} className="text-slate-400" />
                            <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.85rem' }}>{agent.usersCount}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AgentLeaderboard;
