import { useStore } from '../store/useStore';
import { Coins, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

export function TopBar() {
  const { coins } = useStore();

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-space-800 bg-space-950/50 backdrop-blur-md sticky top-0 z-40 md:ml-64">
      <div className="flex items-center gap-4">
        <h1 className="text-lg md:text-xl font-bold text-white truncate max-w-[200px] md:max-w-none">
          <span className="text-slate-400 font-normal hidden md:inline">Welcome back,</span> 领航员路则昊
        </h1>
        <div className="px-2 py-0.5 rounded text-xs bg-neon-blue/20 text-neon-blue border border-neon-blue/50 shrink-0">
          LV. 12
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <motion.div 
          className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-space-900 rounded-full border border-neon-yellow/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
          whileHover={{ scale: 1.05 }}
        >
          <Coins className="w-4 h-4 md:w-5 md:h-5 text-neon-yellow fill-neon-yellow" />
          <span className="font-bold text-neon-yellow text-sm md:text-base">{coins.toLocaleString()}</span>
        </motion.div>

        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </button>
        
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neon-blue to-neon-purple p-[2px]">
          <div className="w-full h-full rounded-full bg-space-950 flex items-center justify-center overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
          </div>
        </div>
      </div>
    </header>
  );
}
