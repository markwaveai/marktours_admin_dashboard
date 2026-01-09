import React, { useState } from 'react';
import StatCards from './StatCards';
import { MonthlyReportChart, DailyActivityChart, BranchRankChart } from './Charts';
import AgentLeaderboard from './Leaderboards';
import { TourInsights, UpcomingTours, TourMap, TopTours, TrendingPlaces } from './TourInsights';
import { FeedbackCarousel } from './Feedback';
import data from '../../dashboard_data.json';
import { Search, Bell, Calendar } from 'lucide-react';

const Dashboard = ({ isSidebarOpen }) => {
    const [dateFilter] = useState(new Date().toLocaleDateString('en-GB').replace(/\//g, '-'));

    return (
        <div className="max-w-[1600px] mx-auto p-6 bg-[#eefaff] w-full">
            <div>
                {/* Branded Header */}
                <header className={`flex justify-between items-center mb-8 gap-6 transition-all duration-300 ${!isSidebarOpen ? 'pl-12' : ''}`}>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/60 shadow-sm">
                            <img
                                src="/images/Layer 2.png"
                                alt="Mark Tours"
                                className="w-[84px]"
                            />
                            <h1 className="text-xl font-extrabold text-[#1e293b] tracking-tight">Dashboard</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-white/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/60 text-slate-500 text-sm font-medium shadow-sm flex items-center gap-2">
                            <Calendar size={16} className="text-indigo-600" />
                            <span className="text-indigo-600 font-bold">Quick Status:</span>
                            <span className="font-bold text-slate-700">{dateFilter}</span>
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <section className="grid grid-cols-12 gap-6 mb-8">
                    <StatCards data={data} />
                </section>

                {/* Main Charts & Unified Metrics Row */}
                <section className="grid grid-cols-12 gap-6">
                    {/* Primary Engagement Charts */}
                    <MonthlyReportChart data={data.monthlyReport} title="Monthly Growth & Revenue" />
                    <DailyActivityChart data={data.dailyActivity} title="User Engagement (Daily)" />

                    {/* Row 1: Unified Performance (3 items) */}
                    <TrendingPlaces data={data} title="Most Visited" />
                    <TourInsights data={data} title="Tour Occupancy" />
                    <AgentLeaderboard agents={data.agentLeadBoard} />

                    {/* Row 2: Operational Overview (2 items) */}
                    <BranchRankChart data={data.branchRank} title="Branch Performance" />
                    <TourMap data={data} />

                    {/* Row 3: Insights (2 items) */}
                    <TopTours data={data} />
                    <UpcomingTours data={data} />

                    {/* Row 4: User Feedback Big Box (1 item) */}
                    <FeedbackCarousel feedbacks={data.feedbacks} />
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
