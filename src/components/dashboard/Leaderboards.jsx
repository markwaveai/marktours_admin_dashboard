import React from 'react';
import { Award, Users } from 'lucide-react';

const AgentLeaderboard = ({ agents }) => {
    return (
        <div className="bg-white border border-white/40 rounded-[28px] p-6 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.2)] min-h-[420px] flex flex-col col-span-12 lg:col-span-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Agent Leaderboard</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Top 5 Performance</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {agents.slice(0, 5).map((agent, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            background: index === 0 ? '#f0f9ff' : 'transparent',
                            borderRadius: '12px',
                            border: index === 0 ? '1px solid #e0f2fe' : '1px solid transparent'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: index === 0 ? '#fbbf24' : '#f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: index === 0 ? 'white' : '#94a3b8',
                                fontSize: '0.8rem',
                                fontWeight: 700
                            }}>
                                {index === 0 ? <Award size={16} /> : index + 1}
                            </div>
                            <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{agent.name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Users size={14} className="text-muted" />
                            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{agent.usersCount}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AgentLeaderboard;
