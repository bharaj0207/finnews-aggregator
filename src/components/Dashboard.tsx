"use client";

import React, { useState } from 'react';
import MarketIndices from './MarketIndices';
import PortfolioTracker from './PortfolioTracker';
import { Newspaper, TrendingUp, PieChart } from 'lucide-react';

type Tab = 'news' | 'markets' | 'portfolio';

export default function Dashboard({ newsContent }: { newsContent: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tab>('news');

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
        <button
          onClick={() => setActiveTab('news')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
            activeTab === 'news'
              ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'
              : 'bg-black/40 text-neutral-400 hover:text-white hover:bg-black/60 border border-white/10'
          }`}
        >
          <Newspaper className="w-5 h-5" />
          News Feed
        </button>
        <button
          onClick={() => setActiveTab('markets')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
            activeTab === 'markets'
              ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'
              : 'bg-black/40 text-neutral-400 hover:text-white hover:bg-black/60 border border-white/10'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          Market Indices
        </button>
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
            activeTab === 'portfolio'
              ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'
              : 'bg-black/40 text-neutral-400 hover:text-white hover:bg-black/60 border border-white/10'
          }`}
        >
          <PieChart className="w-5 h-5" />
          Portfolio Tracker
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-12">
        {activeTab === 'news' && newsContent}
        {activeTab === 'markets' && <MarketIndices />}
        {activeTab === 'portfolio' && <PortfolioTracker />}
      </div>
    </div>
  );
}
