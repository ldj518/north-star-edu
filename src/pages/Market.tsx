import React from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { ShoppingBag, Gamepad2, Smartphone, Utensils, Sparkles } from 'lucide-react';

const items = [
  { id: 1, name: '游戏时间 30分钟', cost: 100, icon: Gamepad2, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 2, name: '手机使用权 1小时', cost: 200, icon: Smartphone, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 3, name: '免做家务卡', cost: 500, icon: Sparkles, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { id: 4, name: '肯德基豪华套餐', cost: 1000, icon: Utensils, color: 'text-red-400', bg: 'bg-red-500/10' },
];

export function Market() {
  const { coins, removeCoins } = useStore();

  const handleBuy = (cost: number) => {
    if (coins >= cost) {
      if (confirm(`确认花费 ${cost} 星币兑换吗？`)) {
        removeCoins(cost);
      }
    } else {
      alert("星币不足！快去完成任务吧！");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">补给站 Marketplace</h2>
        <p className="text-slate-400">用你的汗水换取奖励！</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -10 }}
            className="bg-space-900/50 backdrop-blur-sm border border-space-800 rounded-2xl p-6 flex flex-col items-center text-center group hover:border-neon-blue/50 transition-colors"
          >
            <div className={`w-20 h-20 rounded-full ${item.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <item.icon className={`w-10 h-10 ${item.color}`} />
            </div>
            
            <h3 className="font-bold text-lg mb-2">{item.name}</h3>
            <div className="text-neon-yellow font-bold text-xl mb-6 flex items-center gap-1">
              {item.cost} 🪙
            </div>
            
            <button
              onClick={() => handleBuy(item.cost)}
              disabled={coins < item.cost}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                coins >= item.cost 
                  ? 'bg-space-800 hover:bg-neon-blue hover:text-white text-slate-300' 
                  : 'bg-space-900/50 text-space-700 cursor-not-allowed'
              }`}
            >
              {coins >= item.cost ? '立即兑换' : '星币不足'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
