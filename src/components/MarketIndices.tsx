"use client";

import React from 'react';
import TradingViewWidget from './TradingViewWidget';

export default function MarketIndices() {
  const indices = [
    { name: "NIFTY 50", symbol: "NSE:NIFTY" },
    { name: "SENSEX", symbol: "BSE:SENSEX" },
    { name: "NASDAQ 100", symbol: "NASDAQ:NDX" },
    { name: "S&P 500", symbol: "SP:SPX" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {indices.map((idx) => (
        <div key={idx.symbol} className="glass-card flex flex-col h-[500px] overflow-hidden p-4">
          <h2 className="text-xl font-bold mb-4">{idx.name}</h2>
          <div className="flex-grow rounded-lg overflow-hidden border border-white/5">
             <TradingViewWidget symbol={idx.symbol} />
          </div>
        </div>
      ))}
    </div>
  );
}
