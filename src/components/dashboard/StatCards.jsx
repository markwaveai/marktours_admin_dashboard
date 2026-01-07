import React from 'react';
import {
    Users,
    CreditCard,
    BarChart3,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

const StatCard = ({ label, value, trend, icon }) => (
    <div className="bg-white border border-white/40 rounded-[28px] p-7 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.2)] min-h-[160px] flex flex-col col-span-12 sm:col-span-6 lg:col-span-3">
        <div className="flex justify-between items-start mb-6">
            <div className="p-3 rounded-[14px] bg-sky-50 text-sky-500 flex items-center justify-center">
                {icon}
            </div>
            {trend !== undefined && (
                <div className={`flex items-center text-[0.85rem] font-bold ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {trend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {Math.abs(trend)}%
                </div>
            )}
        </div>
        <div className="mt-auto">
            <p className="uppercase text-[0.75rem] font-semibold text-slate-400 tracking-wider mb-1">{label}</p>
            <h3 className="text-[1.8rem] font-extrabold text-[#0369a1]">{value}</h3>
        </div>
    </div>
);

const StatCards = ({ data }) => {
    return (
        <>
            <StatCard
                label="Total Users"
                value={data.totalUsers?.toLocaleString()}
                trend={4.5}
                icon={<Users size={20} />}
            />
            <StatCard
                label="EMI Collection"
                value={`${data.emiCollectionPercentage}%`}
                trend={-1.2}
                icon={<CreditCard size={20} />}
            />
            <StatCard
                label="Overall Performance"
                value={`${data.overallPerformance}%`}
                trend={3.2}
                icon={<BarChart3 size={20} />}
            />
            <StatCard
                label="Avg Satisfaction"
                value={`${data.ratingsAndSatisfaction?.satisfactionPercentage}%`}
                trend={0.8}
                icon={<TrendingUp size={20} />}
            />
        </>
    );
};

export default StatCards;
