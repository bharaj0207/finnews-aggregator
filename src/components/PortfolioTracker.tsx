"use client";

import React, { useState, useEffect } from 'react';
import TradingViewWidget from './TradingViewWidget';
import { Plus, X } from 'lucide-react';

export default function PortfolioTracker() {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem('portfolio_symbols');
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSymbols(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse symbols", e);
      }
    } else {
        // default symbol
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSymbols(["NSE:RELIANCE"]);
    }
  }, []);

  const saveSymbols = (newSymbols: string[]) => {
    setSymbols(newSymbols);
    localStorage.setItem('portfolio_symbols', JSON.stringify(newSymbols));
  };

  const addSymbol = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const upperSymbol = inputValue.trim().toUpperCase();
    if (!symbols.includes(upperSymbol)) {
      saveSymbols([upperSymbol, ...symbols]);
    }
    setInputValue("");
  };

  const removeSymbol = (symbolToRemove: string) => {
    saveSymbols(symbols.filter(s => s !== symbolToRemove));
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-6 border border-white/5 bg-black/50 backdrop-blur-xl rounded-2xl">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent">Track Custom Stocks / Mutual Funds</h2>
        <p className="text-muted mb-6">Enter a TradingView symbol (e.g. BSE:HDFCBANK, NASDAQ:AAPL) to add to your live tracker.</p>
        
        <form onSubmit={addSymbol} className="flex gap-4 max-w-md">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g. NSE:TCS" 
            className="flex-grow bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30 transition-colors"
          />
          <button type="submit" className="bg-white text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-neutral-200 transition-colors">
            <Plus className="w-5 h-5" /> Add
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {symbols.map((symbol) => (
          <div key={symbol} className="glass-card flex flex-col h-[500px] overflow-hidden p-4 relative group border border-white/5 bg-black/50 backdrop-blur-xl rounded-2xl">
             <button 
               onClick={() => removeSymbol(symbol)}
               className="absolute top-4 right-4 z-10 p-2 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neutral-800"
               title="Remove from portfolio"
             >
               <X className="w-4 h-4" />
             </button>
            <h2 className="text-xl font-bold mb-4 pr-10">{symbol}</h2>
            <div className="flex-grow rounded-lg overflow-hidden border border-white/5">
               <TradingViewWidget symbol={symbol} />
            </div>
          </div>
        ))}
        {symbols.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center p-12 glass-card border-dashed rounded-2xl border-white/10 bg-black/20">
            <p className="text-muted">No symbols in your portfolio. Add one above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
