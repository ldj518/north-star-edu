import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, ExternalLink } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export function AiCompanion() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("我是你的领航员 AI。准备好开始今天的冒险了吗？");
  const [showBubble, setShowBubble] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, coins, tasks } = useStore();

  // Context-aware reactions
  useEffect(() => {
    if (!currentUser) return;

    const todoCount = tasks.filter(t => t.status === 'todo').length;
    
    // Scenario 1: Dashboard
    if (location.pathname === '/') {
       if (todoCount > 0) {
           setMessage(`指挥官 ${currentUser.name}，侦测到今日还有 ${todoCount} 个敌军据点（任务）未清除！建议优先攻击【数学】。`);
       } else {
           setMessage("全图清空！战况完美！要去【补给站】犒劳一下自己吗？");
       }
    }
    // Scenario 2: Missions
    else if (location.pathname === '/missions') {
       setMessage("拖拽任务建立防线！记得，合理的排兵布阵是胜利的关键。");
    }
    // Scenario 3: Focus
    else if (location.pathname === '/focus') {
       setMessage("鹰眼系统已启动。全神贯注，此时此刻，你就是战场的主宰！");
       // Auto-hide bubble in focus mode to reduce distraction
       setTimeout(() => setShowBubble(false), 3000); 
    }
    // Scenario 4: Market
    else if (location.pathname === '/market') {
       if (coins > 500) {
           setMessage(`拥有 ${coins} 星币的巨款！甚至可以考虑兑换那个【免做家务卡】...`);
       } else {
           setMessage("囊中羞涩？快去任务中心赚点赏金吧！");
       }
    }

    setShowBubble(true);
    const timer = setTimeout(() => setShowBubble(false), 8000); // Hide after 8s
    return () => clearTimeout(timer);
  }, [location.pathname, currentUser, coins, tasks]);

  if (!currentUser) return null; // Hide on login screen

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Bubble */}
      <AnimatePresence>
        {(showBubble || isOpen) && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="mb-4 mr-2 bg-space-900/90 backdrop-blur-md border border-neon-blue/30 p-4 rounded-2xl rounded-br-none max-w-xs shadow-2xl pointer-events-auto relative"
          >
            <button 
              onClick={() => setShowBubble(false)} 
              className="absolute top-2 right-2 text-slate-500 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="flex gap-3">
               <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center shrink-0 border border-neon-blue/50">
                 <Bot className="w-6 h-6 text-neon-blue" />
               </div>
               <div>
                 <h4 className="font-bold text-neon-blue text-xs mb-1 uppercase tracking-wider">AI Navigator</h4>
                 <p className="text-sm text-slate-200 leading-relaxed">{message}</p>
                 
                 {/* Quick Actions based on context */}
                 {location.pathname === '/' && tasks.filter(t => t.status === 'todo').length > 0 && (
                   <button 
                     onClick={() => navigate('/missions')}
                     className="mt-3 text-xs bg-neon-blue hover:bg-neon-blue/80 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                   >
                     前往战场 <ExternalLink className="w-3 h-3" />
                   </button>
                 )}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Orb (The Avatar) */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => { setIsOpen(!isOpen); setShowBubble(true); }}
        className="w-16 h-16 rounded-full bg-space-900 border-2 border-neon-blue/50 shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center justify-center pointer-events-auto relative group"
      >
        {/* Breathing Effect */}
        <div className="absolute inset-0 rounded-full bg-neon-blue/20 animate-pulse-slow" />
        <div className="absolute inset-1 rounded-full border border-neon-blue/30 border-dashed animate-[spin_10s_linear_infinite]" />
        
        <Bot className="w-8 h-8 text-white group-hover:text-neon-blue transition-colors relative z-10" />
        
        {/* Notification Dot */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-space-900" />
      </motion.button>
    </div>
  );
}
