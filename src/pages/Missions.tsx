import { useState } from 'react';
import { useStore } from '../store/useStore';
import type { Task } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Plus, UserCircle, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function Missions() {
  const { tasks, addTask, currentUser, setActiveTask } = useStore();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);

  // Derive schedule from store tasks
  // In a real app, this filtering would be more robust
  const getTasksForDay = (day: string) => {
      // Mock distribution logic based on ID for demo stability
      // Real logic: filter by date or assigned day field
      if (day === 'Monday') return tasks.filter(t => t.id === '1');
      if (day === 'Tuesday') return tasks.filter(t => t.id === '4');
      if (day === 'Saturday') return tasks.filter(t => t.id === '2');
      return [];
  };
  
  const poolTasks = tasks.filter(t => !['1','4','2'].includes(t.id));

  // Local state for drag and drop visual simulation
  // We initialize it once based on store, but for prototype we just use local state to keep it simple
  // To fix the crash, we will simplify the drag logic to just visual for now
  // and rely on onClick for the main interaction.

  const handleStartTask = (task: Task) => {
    // If task is done, show submission/review modal instead of starting focus
    if (task.status === 'done') {
        alert("该任务已完成！");
        return;
    }
    
    setActiveTask(task.id);
    navigate('/focus');
  };

  const handleCreateTask = (task: Task) => {
    addTask(task);
    setShowAddModal(false);
  };

  return (
    <div className="h-full flex flex-col space-y-6 relative">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold mb-2">任务规划局 Mission Control</h2>
          <p className="text-slate-400">点击任务 <span className="text-neon-blue font-bold">开始执行</span>，系统将自动跳转至鹰眼监督模式。</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-neon-blue hover:bg-neon-blue/80 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" /> 
          {currentUser?.role === 'student' ? '自定义任务' : '指派新任务'}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        {/* Task Pool */}
        <div className="col-span-3 bg-space-900/50 backdrop-blur-sm rounded-2xl border border-space-800 p-4 flex flex-col">
          <h3 className="font-bold text-slate-300 mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-slate-500" />
            待排期作业
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3 min-h-[200px]">
            {poolTasks.map(task => (
              <div key={task.id} onClick={() => handleStartTask(task)}>
                <TaskCard task={task} />
              </div>
            ))}
            {poolTasks.length === 0 && (
              <div className="text-center text-slate-600 py-10 text-sm border-2 border-dashed border-space-800 rounded-xl">
                作业池空空如也<br/>任务已全部指派
              </div>
            )}
          </div>
        </div>

        {/* Weekly Grid */}
        <div className="col-span-9 grid grid-cols-7 gap-3">
          {DAYS.map((day) => (
            <div 
              key={day}
              className="bg-space-900/30 rounded-xl border border-space-800 flex flex-col overflow-hidden"
            >
              <div className={cn(
                "p-3 text-center border-b border-space-800 font-medium text-sm",
                day === 'Tuesday' ? "bg-neon-blue/10 text-neon-blue" : "text-slate-400"
              )}>
                {day}
              </div>
              
              <div className="flex-1 p-2 space-y-2 min-h-[400px]">
                {getTasksForDay(day).map((task) => (
                  <div key={task.id} onClick={() => handleStartTask(task)}>
                    <TaskCard task={task} compact />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <CreateTaskModal 
            onClose={() => setShowAddModal(false)} 
            onCreate={handleCreateTask}
            isStudent={currentUser?.role === 'student'}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateTaskModal({ onClose, onCreate, isStudent }: { onClose: () => void, onCreate: (t: Task) => void, isStudent: boolean }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Math');
  const [duration, setDuration] = useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      id: Date.now().toString(),
      title,
      subject: subject as any,
      duration,
      reward: isStudent ? 30 : 50,
      status: 'todo',
      date: new Date().toISOString().split('T')[0],
      isCustom: true,
      createdBy: isStudent ? 'student' : 'parent'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-space-900 border border-space-700 rounded-2xl w-full max-w-md p-6 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        
        <h3 className="text-xl font-bold text-white mb-1">
          {isStudent ? '✨ 自定义挑战' : '📝 指派新任务'}
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          {isStudent ? '主动给自己加餐！完成后将获得"自驱力"奖励。' : '给孩子布置一项新的学习任务。'}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">任务名称</label>
            <input 
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-space-950 border border-space-700 rounded-lg p-3 text-white focus:border-neon-blue focus:outline-none"
              placeholder={isStudent ? "例如：自学 Python 30分钟" : "例如：完成英语试卷 B 卷"}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">科目 / 类型</label>
              <select 
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full bg-space-950 border border-space-700 rounded-lg p-3 text-white focus:border-neon-blue focus:outline-none"
              >
                <option value="Math">数学</option>
                <option value="English">英语</option>
                <option value="Physics">物理</option>
                <option value="Biology">生物</option>
                <option value="Self">自主学习 (Self)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">预计耗时 (分)</label>
              <input 
                type="number"
                value={duration}
                onChange={e => setDuration(parseInt(e.target.value))}
                className="w-full bg-space-950 border border-space-700 rounded-lg p-3 text-white focus:border-neon-blue focus:outline-none"
              />
            </div>
          </div>
          
          <div className="bg-space-800/50 p-4 rounded-xl flex items-center gap-3 border border-space-800">
            <div className="w-10 h-10 rounded-full bg-neon-yellow/20 flex items-center justify-center text-neon-yellow font-bold">
              +{isStudent ? 30 : 50}
            </div>
            <div className="text-sm">
              <div className="text-slate-300 font-bold">预计奖励</div>
              <div className="text-slate-500 text-xs">{isStudent ? '自主任务基础奖励' : '标准任务奖励'}</div>
            </div>
          </div>
          
          <button type="submit" className="w-full bg-neon-blue hover:bg-neon-blue/80 text-white font-bold py-3 rounded-xl transition-colors">
            确认创建
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function TaskCard({ task, compact }: { task: Task, compact?: boolean }) {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      className={cn(
        "bg-space-800 rounded-lg border border-space-700 cursor-pointer group relative overflow-hidden hover:border-neon-blue/50 transition-colors",
        compact ? "p-2" : "p-3",
        task.isCustom ? "border-neon-purple/30 bg-neon-purple/5" : ""
      )}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
        task.subject === 'Math' ? 'bg-blue-500' :
        task.subject === 'English' ? 'bg-purple-500' :
        task.subject === 'Self' ? 'bg-pink-500' :
        'bg-green-500'
      }`} />
      
      <div className="pl-2">
        {!compact && (
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-mono text-slate-500 bg-space-950 px-1.5 py-0.5 rounded">
              {task.subject}
            </span>
            {task.isCustom && (
              <span className="text-[10px] text-neon-purple flex items-center gap-0.5 bg-neon-purple/10 px-1.5 py-0.5 rounded border border-neon-purple/20">
                <UserCircle className="w-3 h-3" />
                自定
              </span>
            )}
          </div>
        )}
        
        <h4 className={cn("font-medium text-slate-200 leading-tight", compact ? "text-xs mb-1" : "text-sm mb-2")}>
          {task.title}
        </h4>
        
        <div className="flex justify-between items-center text-[10px] text-slate-500">
          <span>{task.duration}m</span>
          <span className="text-neon-yellow">{task.reward} 🪙</span>
        </div>
      </div>
    </motion.div>
  );
}
