import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { Gamepad2, Smartphone, Utensils, Sparkles, History } from 'lucide-react';
import { savePurchase, saveTransaction, getPurchases } from '../lib/storage';
import { useState, useEffect } from 'react';

const items = [
  { id: 1, name: '游戏时间 30分钟', cost: 100, icon: Gamepad2, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 2, name: '手机使用权 1小时', cost: 200, icon: Smartphone, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 3, name: '免做家务卡', cost: 500, icon: Sparkles, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { id: 4, name: '肯德基豪华套餐', cost: 1000, icon: Utensils, color: 'text-red-400', bg: 'bg-red-500/10' },
];

export function Market() {
  const { coins, removeCoins } = useStore();
  const [purchases, setPurchases] = useState(getPurchases());
  const [showHistory, setShowHistory] = useState(false);

  const handleBuy = (item: typeof items[0]) => {
    if (coins >= item.cost) {
      if (confirm(`确认花费 ${item.cost} 星币兑换 ${item.name} 吗？`)) {
        // Deduct coins
        removeCoins(item.cost);
        
        // Save purchase
        savePurchase(item);
        
        // Save transaction
        saveTransaction({
          id: Date.now().toString(),
          type: 'spend',
          amount: item.cost,
          description: `兑换：${item.name}`,
          timestamp: new Date(),
          category: 'market'
        });
        
        // Refresh purchases list
        setPurchases(getPurchases());
        
        alert(`✅ 兑换成功！${item.name}`);
      }
    } else {
      alert("星币不足！快去完成任务吧！");
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-2">补给站 Marketplace</h2>
          <p className="text-slate-400">用你的汗水换取奖励！</p>
        </div>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 px-4 py-2 bg-space-800 hover:bg-space-700 rounded-xl text-sm transition-colors"
        >
          <History className="w-4 h-4" />
          {showHistory ? '隐藏历史' : '兑换历史'}
        </button>
      </div>

      {showHistory && (
        <div className="mb-6 bg-space-900/50 backdrop-blur-sm rounded-xl border border-space-800 p-4">
          <h3 className="font-bold text-white mb-3">最近兑换</h3>
          {purchases.length === 0 ? (
            <p className="text-slate-500 text-sm">暂无兑换记录</p>
          ) : (
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {purchases.slice(0, 10).map(p => (
                <div key={p.id} className="flex justify-between items-center text-sm bg-space-800/50 p-2 rounded-lg">
                  <span className="text-slate-300">{p.name}</span>
                  <div className="text-right">
                    <div className="text-neon-yellow font-bold">{p.cost} 🪙</div>
                    <div className="text-[10px] text-slate-500">
                      {new Date(p.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {items.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -10 }}
            className="bg-space-900/50 backdrop-blur-sm border border-space-800 rounded-xl lg:rounded-2xl p-4 lg:p-6 flex flex-col items-center text-center group hover:border-neon-blue/50 transition-colors"
          >
            <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-full ${item.bg} flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <item.icon className={`w-8 h-8 lg:w-10 lg:h-10 ${item.color}`} />
            </div>
            
            <h3 className="font-bold text-base lg:text-lg mb-2">{item.name}</h3>
            <div className="text-neon-yellow font-bold text-lg lg:text-xl mb-4 lg:mb-6 flex items-center gap-1">
              {item.cost} 🪙
            </div>
            
            <button
              onClick={() => handleBuy(item)}
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
