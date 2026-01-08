import React, { useState } from 'react';
import StatCards from './StatCards';
import { MonthlyReportChart, DailyActivityChart, BranchRankChart } from './Charts';
import AgentLeaderboard from './Leaderboards';
import { TourInsights, UpcomingTours, TourMap, TopTours, TrendingPlaces } from './TourInsights';
import { FeedbackCarousel } from './Feedback';
import data from '../../dashboard_data.json';
import { Search, Bell, Calendar } from 'lucide-react';

const Dashboard = () => {
    const [dateFilter] = useState('2026-01-07');

    return (
        <div className="max-w-[1600px] mx-auto p-6 bg-[#eefaff] w-full">
            <div>
                {/* Header Bar */}
                <header className="flex justify-between items-center mb-8 flex-wrap gap-6">
                    {/* <div>
                        <h1 className="text-2xl font-bold">Welcome back, John!</h1>
                        <p className="text-slate-500 text-sm">Here's what's happening with your tours today.</p>
                    </div> */}

                    <div className="flex items-center gap-6">
                        {/* <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" placeholder="Search tours, agents..." className="bg-white border border-slate-200 rounded-xl py-2.5 px-4 pl-10 w-full max-w-[300px] text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all" />
                        </div> */}

                        <div className="flex gap-2.5">
                            {/* <button className="flex items-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-white cursor-pointer text-sm font-medium hover:bg-slate-50 transition-colors">
                                <Calendar size={16} />
                                {dateFilter}
                            </button> */}
                            {/* <button className="p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition-colors">
                                <Bell size={18} />
                            </button> */}
                        </div>

                        {/* <div className="flex items-center gap-2.5 pl-4 border-l border-slate-200">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="avatar" className="w-full h-full" />
                            </div>
                            <div>
                                <p className="text-[0.85rem] font-semibold">John Doe</p>
                                <p className="text-[0.75rem] text-slate-500">Admin</p>
                            </div>
                        </div> */}
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

                    {/* Unified Performance Row (One line, one format) */}
                    <TrendingPlaces data={data} title="Most Visited" />
                    <TourInsights data={data} title="Tour Occupancy" />
                    <AgentLeaderboard agents={data.agentLeadBoard} />
                    <BranchRankChart data={data.branchRank} title="Branch Performance" />

                    {/* Secondary Metrics Unified Row (One line, one format) */}
                    <TourMap data={data} />
                    <TopTours data={data} />
                    <UpcomingTours data={data} />
                    <FeedbackCarousel feedbacks={data.feedbacks} />
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
