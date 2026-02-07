import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, CheckCircle2, AlertTriangle, X, Send, Bot, ScanLine, Loader2, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Task } from '../store/useStore';
import { cn } from '../lib/utils';

interface TaskSubmissionProps {
  task: Task;
  onClose: () => void;
  onComplete: () => void;
}

type Step = 'upload' | 'analyzing' | 'review' | 'socratic' | 'success';

export function TaskSubmission({ task, onClose, onComplete }: TaskSubmissionProps) {
  const [step, setStep] = useState<Step>('upload');
  const [image, setImage] = useState<string | null>(null);
  
  const handleUpload = () => {
    // Mock upload
    setImage('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80');
    setStep('analyzing');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-space-900 w-full max-w-4xl h-[600px] rounded-2xl border border-space-700 flex overflow-hidden shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full hover:bg-red-500/20 hover:text-red-500 transition-colors">
          <X className="w-5 h-5" />
        </button>

        {step === 'upload' && <UploadStep onUpload={handleUpload} />}
        {step === 'analyzing' && <AnalyzingStep image={image!} onFinish={() => setStep('review')} />}
        {step === 'review' && <ReviewStep image={image!} onFix={() => setStep('socratic')} />}
        {step === 'socratic' && <SocraticStep image={image!} onFinish={() => setStep('success')} />}
        {step === 'success' && <SuccessStep task={task} onClose={onComplete} />}

      </motion.div>
    </div>
  );
}

// 1. Upload Step
function UploadStep({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center p-8">
      <div className="w-20 h-20 bg-space-800 rounded-full flex items-center justify-center mb-6 border border-space-700 shadow-inner">
        <Camera className="w-10 h-10 text-slate-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">提交作业成果</h2>
      <p className="text-slate-400 mb-8 max-w-md">
        请拍摄清晰的作业照片。AI 导师将即时检查字迹清晰度与答案正确性。
      </p>
      
      <div className="flex gap-4">
        <button className="px-6 py-3 rounded-xl bg-space-800 hover:bg-space-700 text-white font-medium flex items-center gap-2 transition-colors">
          <Upload className="w-5 h-5" /> 本地上传
        </button>
        <button 
          onClick={onUpload}
          className="px-6 py-3 rounded-xl bg-neon-blue hover:bg-neon-blue/80 text-white font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
        >
          <Camera className="w-5 h-5" /> 拍照 (模拟)
        </button>
      </div>
    </div>
  );
}

// 2. Analyzing Step
function AnalyzingStep({ image, onFinish }: { image: string, onFinish: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full relative">
      <img src={image} alt="Task" className="w-full h-full object-cover opacity-50" />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="relative">
          <ScanLine className="w-24 h-24 text-neon-blue animate-pulse" />
          <motion.div 
            initial={{ top: 0 }}
            animate={{ top: '100%' }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-1 bg-neon-blue shadow-[0_0_15px_#3b82f6]"
          />
        </div>
        <h3 className="text-xl font-bold text-white mt-6 mb-2">AI 智能批改中...</h3>
        <div className="flex flex-col gap-2 text-sm text-slate-300 w-64">
          <div className="flex justify-between">
            <span>清晰度检测</span>
            <span className="text-neon-green">98% ✅</span>
          </div>
          <div className="flex justify-between">
            <span>字迹识别</span>
            <span className="text-neon-green">完成 ✅</span>
          </div>
          <div className="flex justify-between">
            <span>逻辑校验</span>
            <span className="text-neon-yellow flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> 计算中
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Review Step
function ReviewStep({ image, onFix }: { image: string, onFix: () => void }) {
  return (
    <div className="w-full flex h-full">
      <div className="w-1/2 relative border-r border-space-800">
        <img src={image} alt="Task" className="w-full h-full object-cover" />
        {/* Error Highlight */}
        <div className="absolute top-[40%] left-[30%] w-32 h-20 border-4 border-red-500 rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse bg-red-500/10">
          <div className="absolute -top-8 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
            错误点 #1
          </div>
        </div>
      </div>
      
      <div className="w-1/2 p-8 flex flex-col justify-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">发现 1 处错误</h2>
        <p className="text-slate-400 mb-6">
          虽然大部分做得很好，但在 <strong className="text-white">第 3 题 (几何面积计算)</strong> 似乎有些问题。AI 导师已准备好引导你修正它。
        </p>
        
        <div className="bg-space-800 p-4 rounded-xl border border-space-700 mb-8">
          <h4 className="font-bold text-slate-300 text-sm mb-2">批改报告</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-neon-green">
              <CheckCircle2 className="w-4 h-4" /> 第 1-2 题 正确
            </li>
            <li className="flex items-center gap-2 text-red-400">
              <X className="w-4 h-4" /> 第 3 题 计算错误
            </li>
            <li className="flex items-center gap-2 text-neon-green">
              <CheckCircle2 className="w-4 h-4" /> 第 4-5 题 正确
            </li>
          </ul>
        </div>
        
        <button 
          onClick={onFix}
          className="w-full bg-neon-blue hover:bg-neon-blue/80 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          <Bot className="w-5 h-5" />
          进入订正模式 (Socratic Mode)
        </button>
      </div>
    </div>
  );
}

// 4. Socratic Step
function SocraticStep({ image, onFinish }: { image: string, onFinish: () => void }) {
  const [messages, setMessages] = useState<any[]>([
    { role: 'ai', content: '让我们看看第 3 题。你用了 `底 × 高` 来计算三角形面积。再仔细回想一下三角形面积公式，是不是漏了什么？' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    const userText = input.toLowerCase();
    setInput('');

    setTimeout(() => {
      if (userText.includes('除以2') || userText.includes('/2') || userText.includes('half')) {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          content: '没错！三角形是平行四边形的一半，所以必须除以 2。现在的答案是多少？',
          success: true
        }]);
      } else if (userText === '15') {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          content: 'Bingo! 30 ÷ 2 = 15。你掌握了！👏',
          completed: true
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: '不完全对。试着想一下，两个完全一样的三角形拼在一起是什么形状？' }]);
      }
    }, 1000);
  };

  const isCompleted = messages.some(m => m.completed);

  return (
    <div className="w-full flex h-full">
      {/* Visual Context */}
      <div className="w-1/3 border-r border-space-800 bg-black flex flex-col">
        <div className="flex-1 relative overflow-hidden">
          <img src={image} alt="Problem" className="absolute top-[-30%] left-[-20%] w-[150%] max-w-none opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-space-900 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
             <div className="text-xs text-neon-yellow font-bold uppercase mb-2">Current Problem</div>
             <div className="text-xl font-mono font-bold text-white bg-black/50 p-2 rounded border border-white/20 inline-block">
               Area = 6 × 5 = 30 (?)
             </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="w-2/3 flex flex-col bg-space-900">
        <div className="p-4 border-b border-space-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-neon-purple" />
            <div>
              <div className="font-bold text-white text-sm">AI 引导订正</div>
              <div className="text-xs text-neon-purple">苏格拉底模式运行中...</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-4 max-w-[90%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === 'ai' ? "bg-neon-purple/20 text-neon-purple" : "bg-space-700 text-white"
              )}>
                {msg.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className={cn(
                "p-3 rounded-2xl text-sm leading-relaxed",
                msg.role === 'ai' ? "bg-space-800 text-slate-200 rounded-tl-none border border-space-700" : "bg-neon-blue text-white rounded-tr-none"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-4 border-t border-space-800 bg-space-950/30">
          {isCompleted ? (
            <button 
              onClick={onFinish}
              className="w-full py-4 bg-neon-green hover:bg-neon-green/90 text-space-950 font-bold rounded-xl flex items-center justify-center gap-2 animate-bounce"
            >
              <CheckCircle2 className="w-5 h-5" />
              订正完成，提交任务！
            </button>
          ) : (
            <div className="flex gap-2 relative">
               <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="输入你的思考..."
                className="flex-1 bg-space-950 border border-space-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple"
               />
               <button 
                onClick={handleSend}
                className="bg-neon-purple hover:bg-neon-purple/80 text-white p-3 rounded-xl transition-colors"
               >
                 <Send className="w-5 h-5" />
               </button>
               
               {/* Hints for Demo */}
               {messages.length === 1 && (
                 <motion.div 
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }} 
                   className="absolute -top-10 left-0 flex gap-2"
                 >
                   <button onClick={() => setInput('啊，是不是要除以2？')} className="bg-space-800 text-xs text-slate-400 px-3 py-1.5 rounded-full hover:text-white border border-space-700">
                     💡 提示: 试试回答 "要除以2"
                   </button>
                 </motion.div>
               )}
               {messages.length === 3 && (
                 <motion.div 
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }} 
                   className="absolute -top-10 left-0 flex gap-2"
                 >
                   <button onClick={() => setInput('15')} className="bg-space-800 text-xs text-slate-400 px-3 py-1.5 rounded-full hover:text-white border border-space-700">
                     💡 提示: 输入正确答案 "15"
                   </button>
                 </motion.div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 5. Success Step
function SuccessStep({ task, onClose }: { task: Task, onClose: () => void }) {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-space-900 to-neon-green/5">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        type="spring"
        className="w-24 h-24 bg-neon-green rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.5)]"
      >
        <CheckCircle2 className="w-12 h-12 text-space-950" />
      </motion.div>
      
      <h2 className="text-3xl font-bold text-white mb-2">任务完美达成！</h2>
      <p className="text-slate-400 mb-8">
        你不仅完成了任务，还通过 AI 引导攻克了难点。<br/>
        这种"知错能改"的精神最值得奖励！
      </p>
      
      <div className="bg-space-950/50 p-6 rounded-2xl border border-space-800 flex items-center gap-8 mb-8">
        <div className="text-center">
          <div className="text-xs text-slate-500 uppercase font-bold">Base Reward</div>
          <div className="text-2xl font-bold text-white">+{task.reward}</div>
        </div>
        <div className="w-px h-10 bg-space-800" />
        <div className="text-center">
          <div className="text-xs text-slate-500 uppercase font-bold">Correction Bonus</div>
          <div className="text-2xl font-bold text-neon-yellow">+20</div>
        </div>
      </div>
      
      <button 
        onClick={onClose}
        className="px-8 py-3 rounded-xl bg-space-800 hover:bg-space-700 text-white font-bold flex items-center gap-2 transition-colors border border-space-700"
      >
        返回任务中心
      </button>
    </div>
  );
}
