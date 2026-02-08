import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Eye, AlertCircle, Timer as TimerIcon, Zap, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { TaskSubmission } from '../components/TaskSubmission';
import { useNavigate } from 'react-router-dom';
import { saveTaskHistory, saveTransaction } from '../lib/storage';

export function Focus() {
  const { activeTaskId, tasks, moveTask, setActiveTask, addCoins: addReward } = useStore();
  const navigate = useNavigate();
  
  const currentTask = tasks.find(t => t.id === activeTaskId);
  
  const [isActive, setIsActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showGhost, setShowGhost] = useState(false);
  const [showSubmission, setShowSubmission] = useState(false);

  // Auto-start if task is active
  useEffect(() => {
    if (activeTaskId) {
      setIsActive(true);
    }
  }, [activeTaskId]);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setElapsed((prev) => prev + 1);
        
        // Real Ghost Check - every 10-20 minutes randomly
        if (elapsed > 0 && elapsed % (5 * 60) === 0 && Math.random() < 0.3) {
          generateGhostCheck();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, elapsed]);

  const generateGhostCheck = () => {
    setShowGhost(true);
    setIsActive(false);
  };

  const handleGhostSuccess = () => {
    setShowGhost(false);
    addReward(20); // Ghost check bonus
    saveTransaction({
      id: Date.now().toString(),
      type: 'earn',
      amount: 20,
      description: 'Ghost Check 验证成功',
      timestamp: new Date(),
      category: 'focus'
    });
    setIsActive(true);
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinish = () => {
    setIsActive(false);
    setShowSubmission(true);
  };
  
  const handleTaskComplete = () => {
    if (currentTask) {
      const timeBonus = Math.floor(elapsed / 60) * 2; // 2 coins per minute
      const totalReward = currentTask.reward + timeBonus;
      
      // Move task
      moveTask(currentTask.id, 'done');
      
      // Add reward
      addReward(totalReward);
      
      // Save transaction
      saveTransaction({
        id: Date.now().toString(),
        type: 'earn',
        amount: totalReward,
        description: `完成：${currentTask.title}`,
        timestamp: new Date(),
        category: 'task'
      });
      
      // Save task history
      saveTaskHistory({
        id: Date.now().toString(),
        taskId: currentTask.id,
        taskName: currentTask.title,
        status: 'completed',
        duration: elapsed,
        reward: totalReward,
        timestamp: new Date()
      });
      
      setActiveTask(null);
    }
    setShowSubmission(false);
    navigate('/missions');
  };
  
  const handleStop = () => {
    setIsActive(false);
    if (confirm('确定要放弃当前专注吗？进度将不会保存。')) {
      if (currentTask) {
        saveTaskHistory({
          id: Date.now().toString(),
          taskId: currentTask.id,
          taskName: currentTask.title,
          status: 'abandoned',
          duration: elapsed,
          reward: 0,
          timestamp: new Date()
        });
      }
      setActiveTask(null);
      navigate('/missions');
    }
  };

  const avgTime = currentTask ? currentTask.duration * 60 : 1800;
  const progressPercent = Math.min(100, (elapsed / avgTime) * 100);
  const ghostProgress = Math.min(100, (elapsed / (avgTime * 0.9)) * 100); 

  if (!currentTask && !activeTaskId) {
      return (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <TimerIcon className="w-16 h-16 mb-4 opacity-50" />
              <p>暂无进行中的任务。</p>
              <button 
                onClick={() => navigate('/missions')}
                className="mt-4 px-6 py-2 bg-neon-blue text-white rounded-xl hover:bg-neon-blue/80"
              >
                  去规划任务
              </button>
          </div>
      );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center relative">
      <div className="absolute top-0 left-0 w-full flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
             鹰眼监督 Eagle Eye
             {isActive && <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-green"></span>
              </span>}
          </h2>
          <p className="text-slate-400">正在专注执行任务：<span className="text-white font-bold">{currentTask?.title}</span></p>
        </div>
        
        {/* Smart Insights */}
        <div className="bg-space-900/50 backdrop-blur-sm border border-space-800 rounded-xl p-4 w-64">
           <div className="text-xs text-slate-500 font-bold uppercase mb-2">Smart Insights</div>
           
           <div className="space-y-3">
               <div>
                   <div className="flex justify-between text-xs mb-1">
                       <span className="text-slate-400">当前进度</span>
                       <span className="text-white font-mono">{Math.round(progressPercent)}%</span>
                   </div>
                   <div className="h-1.5 bg-space-800 rounded-full overflow-hidden">
                       <motion.div animate={{ width: `${progressPercent}%` }} className="h-full bg-neon-blue" />
                   </div>
               </div>
               
               <div>
                   <div className="flex justify-between text-xs mb-1">
                       <span className="text-slate-400 flex items-center gap-1">
                           <Zap className="w-3 h-3 text-neon-yellow" /> 影子竞速 (Vs Yesterday)
                       </span>
                       <span className={ghostProgress > progressPercent ? "text-red-400" : "text-neon-green"}>
                           {ghostProgress > progressPercent ? `- ${Math.round(ghostProgress - progressPercent)}%` : `+ ${Math.round(progressPercent - ghostProgress)}%`}
                       </span>
                   </div>
                   {/* Visual Race Track could go here */}
                   <p className="text-[10px] text-slate-500 mt-1">
                       {ghostProgress > progressPercent 
                         ? "加油！昨天的你比现在稍微快一点点。" 
                         : "太棒了！你正在超越昨天的记录！"}
                   </p>
               </div>
           </div>
        </div>
      </div>

      {/* Timer Circle */}
      <div className="relative w-80 h-80 flex items-center justify-center mb-12 mt-8">
        {/* Pulsing Rings */}
        {isActive && (
          <>
            <div className="absolute inset-0 rounded-full border border-neon-blue/30 animate-ping" />
            <div className="absolute inset-[-20px] rounded-full border border-neon-blue/10 animate-pulse" />
          </>
        )}
        
        <div className="w-full h-full rounded-full border-4 border-space-800 flex items-center justify-center bg-space-900/50 backdrop-blur-xl relative z-10 flex-col">
          <div className="text-6xl font-mono font-bold text-white tracking-wider mb-2">
            {formatTime(elapsed)}
          </div>
          <div className="text-sm text-slate-500 uppercase tracking-widest">Focus Time</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-6 items-center">
        <button 
          onClick={handleStop}
          className="w-12 h-12 rounded-full bg-space-800 text-slate-400 flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-colors"
          title="放弃任务"
        >
          <Square className="w-5 h-5" />
        </button>
        
        <button 
          onClick={toggleTimer}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            isActive 
              ? 'bg-space-800 text-slate-300 hover:bg-space-700' 
              : 'bg-neon-blue text-white shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-110'
          }`}
        >
          {isActive ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
        </button>
        
        <button 
          onClick={handleFinish}
          className="w-12 h-12 rounded-full bg-space-800 text-neon-green flex items-center justify-center hover:bg-neon-green/20 transition-colors"
          title="完成任务"
        >
          <CheckCircle2 className="w-6 h-6" />
        </button>
      </div>

      <div className="mt-8 flex items-center gap-2 text-slate-500 text-sm">
        <Eye className="w-4 h-4 text-neon-green" />
        <span>摄像头监控运行中 (Live)</span>
      </div>

      {/* Ghost Modal */}
      <AnimatePresence>
        {showGhost && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <div className="bg-space-900 border border-red-500/50 p-8 rounded-2xl max-w-md w-full text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse" />
              
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">随机验证！</h3>
              <p className="text-slate-400 mb-8">请在一分钟内回答以下问题，证明你没有离开座位。</p>
              
              <div className="bg-space-800 p-4 rounded-xl mb-6 text-lg font-medium">
                "apple" 的中文意思是？
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleGhostSuccess}
                  className="bg-space-800 hover:bg-space-700 py-3 rounded-xl transition-colors"
                >
                  香蕉
                </button>
                <button 
                  onClick={handleGhostSuccess}
                  className="bg-neon-blue hover:bg-neon-blue/80 text-white py-3 rounded-xl transition-colors font-bold"
                >
                  苹果
                </button>
              </div>
            </div>
          </motion.div>
        )}
        
        {showSubmission && currentTask && (
            <TaskSubmission 
                task={currentTask} 
                onClose={() => setShowSubmission(false)}
                onComplete={handleTaskComplete}
            />
        )}
      </AnimatePresence>
    </div>
  );
}
