import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  FileText, 
  Image as ImageIcon, 
  Mic, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Trash2, 
  Loader2, 
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Task } from '../store/useStore';

// Simulated AI Parsing Response
const mockParseResult = [
  { id: 't1', title: '完成数学《优加》P30-32', subject: 'Math', duration: 45, reward: 50, type: 'homework' },
  { id: 't2', title: '背诵英语 Unit3 单词', subject: 'English', duration: 20, reward: 30, type: 'memorize' },
  { id: 't3', title: '准备明天科学实验材料', subject: 'Biology', duration: 10, reward: 10, type: 'prep' },
];

export function SmartAssign() {
  const { addTask } = useStore();
  const [inputMode, setInputMode] = useState<'text' | 'image' | 'voice'>('text');
  const [rawInput, setRawInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedTasks, setParsedTasks] = useState<any[]>([]);
  const [step, setStep] = useState<'input' | 'review' | 'success'>('input');

  const handleProcess = () => {
    if (!rawInput.trim()) return;
    
    setIsProcessing(true);
    // Simulate AI delay
    setTimeout(() => {
      setIsProcessing(false);
      setParsedTasks(mockParseResult);
      setStep('review');
    }, 2000);
  };

  const handlePublish = () => {
    parsedTasks.forEach(pt => {
      const newTask: Task = {
        id: Date.now().toString() + Math.random(),
        title: pt.title,
        subject: pt.subject as any,
        duration: pt.duration,
        reward: pt.reward,
        status: 'todo',
        date: new Date().toISOString().split('T')[0],
        createdBy: 'parent-ai'
      };
      addTask(newTask);
    });
    setStep('success');
    setRawInput('');
    setTimeout(() => {
      setStep('input');
      setParsedTasks([]);
    }, 3000);
  };

  const removeParsedTask = (id: string) => {
    setParsedTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="bg-space-900/50 backdrop-blur-sm border border-space-800 rounded-2xl p-6 min-h-[500px] flex flex-col">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Bot className="w-6 h-6 text-neon-blue" />
          智能作业解析 Smart Parser
        </h3>
        <p className="text-slate-400 text-sm">
          复制微信群消息、上传图片或文件，AI 将自动拆解并发布任务。
        </p>
      </div>

      <div className="flex-1 flex flex-col">
        {step === 'input' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-4 flex-1 flex flex-col"
          >
            {/* Input Tabs */}
            <div className="flex gap-2">
              <button 
                onClick={() => setInputMode('text')}
                className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                  inputMode === 'text' ? 'bg-space-800 text-white border border-space-700' : 'text-slate-500 hover:bg-space-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" /> 文本/消息
              </button>
              <button 
                onClick={() => setInputMode('image')}
                className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                  inputMode === 'image' ? 'bg-space-800 text-white border border-space-700' : 'text-slate-500 hover:bg-space-900'
                }`}
              >
                <ImageIcon className="w-4 h-4" /> 图片/截图
              </button>
              <button 
                onClick={() => setInputMode('voice')}
                className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                  inputMode === 'voice' ? 'bg-space-800 text-white border border-space-700' : 'text-slate-500 hover:bg-space-900'
                }`}
              >
                <Mic className="w-4 h-4" /> 语音转录
              </button>
            </div>

            {/* Input Area */}
            <div className="flex-1 bg-space-950 border border-space-800 rounded-2xl p-4 relative">
              {inputMode === 'text' && (
                <textarea 
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                  placeholder="在此粘贴老师发的作业消息...
例如：
1. 数学完成优加P30-32
2. 英语背诵Unit3单词
3. 明天带科学实验材料"
                  className="w-full h-full bg-transparent border-none focus:outline-none text-slate-300 resize-none placeholder:text-slate-600"
                />
              )}
              {inputMode === 'image' && (
                <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-space-800 rounded-xl text-slate-500 hover:text-slate-400 hover:border-space-600 transition-colors cursor-pointer" onClick={() => setRawInput('image-placeholder')}>
                  <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
                  <p>点击或拖拽上传作业截图</p>
                  <p className="text-xs mt-2 opacity-50">支持 JPG, PNG, PDF</p>
                  {rawInput && <div className="mt-4 text-neon-green text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> 已选择 1 张图片</div>}
                </div>
              )}
              
              {isProcessing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" />
                    <Bot className="w-6 h-6 text-neon-blue absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-neon-blue mt-4 font-medium animate-pulse">AI 正在分析作业内容...</p>
                  <p className="text-slate-500 text-xs mt-1">识别学科 • 估算耗时 • 制定奖励</p>
                </div>
              )}
            </div>

            <button 
              onClick={handleProcess}
              disabled={!rawInput || isProcessing}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                !rawInput || isProcessing
                  ? 'bg-space-800 text-slate-500 cursor-not-allowed'
                  : 'bg-neon-blue hover:bg-neon-blue/80 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              开始智能解析
            </button>
          </motion.div>
        )}

        {step === 'review' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col"
          >
            <div className="bg-space-950/50 rounded-xl p-3 border border-space-800 mb-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">解析结果：<span className="text-white font-bold">{parsedTasks.length}</span> 项任务</span>
              <button onClick={() => setStep('input')} className="text-xs text-neon-blue hover:underline">重新识别</button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar mb-4">
              {parsedTasks.map((task) => (
                <div key={task.id} className="bg-space-800 p-4 rounded-xl border border-space-700 flex gap-4 group">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        task.subject === 'Math' ? 'bg-blue-500/20 text-blue-400' :
                        task.subject === 'English' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {task.subject}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Loader2 className="w-3 h-3" /> {task.duration}m
                      </span>
                    </div>
                    <div className="text-white font-medium">{task.title}</div>
                  </div>
                  
                  <div className="flex flex-col items-end justify-between">
                    <div className="text-neon-yellow font-bold font-mono">+{task.reward}</div>
                    <button 
                      onClick={() => removeParsedTask(task.id)}
                      className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setParsedTasks(prev => [...prev, { id: Date.now(), title: '新任务', subject: 'Math', duration: 30, reward: 30 }])}
                className="px-4 py-3 rounded-xl bg-space-800 hover:bg-space-700 text-slate-300 border border-space-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button 
                onClick={handlePublish}
                className="flex-1 bg-neon-green hover:bg-neon-green/90 text-space-950 font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all"
              >
                确认发布 ({parsedTasks.length}) <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <div className="w-20 h-20 bg-neon-green/20 rounded-full flex items-center justify-center mb-6 text-neon-green border-2 border-neon-green/50">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">发布成功！</h3>
            <p className="text-slate-400">
              任务已同步至孩子的【任务规划局】。<br/>
              AI 已为您节省约 <span className="text-white font-bold">5分钟</span> 的整理时间。
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
