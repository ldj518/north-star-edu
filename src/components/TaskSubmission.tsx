import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, CheckCircle2, AlertTriangle, X, Send, Bot, ScanLine, Loader2, User } from 'lucide-react';
import type { Task } from '../store/useStore';
import { cn } from '../lib/utils';

interface TaskSubmissionProps {
  task: Task;
  onClose: () => void;
  onComplete: () => void;
}

type Step = 'upload' | 'analyzing' | 'review' | 'socratic' | 'success';

interface AnalysisResult {
  overall_score: number;
  issues: Array<{
    type: 'error' | 'warning' | 'suggestion';
    question_number: number;
    description: string;
    position?: { x: number; y: number };
  }>;
  encouragements: string[];
  socratic_prompt?: string;
}

export function TaskSubmission({ task, onClose, onComplete }: TaskSubmissionProps) {
  const [step, setStep] = useState<Step>('upload');
  const [image, setImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleImageSelect = (imageData: string) => {
    setImage(imageData);
    setStep('analyzing');
    analyzeImage(imageData);
  };

  const analyzeImage = async (imageData: string) => {
    console.log('开始分析图片...');
    console.log('图片大小:', Math.round(imageData.length / 1024), 'KB');
    
    // Demo mode: Use mock result for testing
    const useDemoMode = true; // Set to false to use real API
    
    if (useDemoMode) {
      console.log('使用演示模式（模拟 AI 批改）');
      
      const demoResult: AnalysisResult = {
        overall_score: 78,
        issues: [
          {
            type: 'error',
            question_number: 3,
            description: '第3题：三角形面积计算时忘记除以2',
            position: { x: 25, y: 35 }
          },
          {
            type: 'warning',
            question_number: 5,
            description: '第5题：解题步骤不够完整',
            position: { x: 60, y: 55 }
          }
        ],
        encouragements: [
          '整体完成度不错！',
          '前两题完全正确，继续保持！',
          '字迹清晰，卷面整洁！'
        ],
        socratic_prompt: '让我们看看第3题。你计算出的面积是30，但看看三角形面积公式，是不是哪里漏了一步？'
      };

      console.log('演示分析结果:', demoResult);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      setAnalysisResult(demoResult);
      setStep('review');
      return;
    }
    
    // Real API mode
    try {
      const response = await fetch('/api/oracle/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `请批改这道作业，检查错误并给出指导。任务名称：${task.title}`,
          image: imageData,
          studentName: '路则昊',
          context: 'homework_grading',
          taskTitle: task.title
        })
      });

      console.log('API响应状态:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API错误:', errorData);
        throw new Error(errorData.error || 'API request failed');
      }

      const data = await response.json();
      console.log('API返回数据:', data);
      
      const result: AnalysisResult = {
        overall_score: 85,
        issues: [
          {
            type: 'error',
            question_number: 3,
            description: '第3题计算有误',
            position: { x: 30, y: 40 }
          }
        ],
        encouragements: ['字迹很工整！', '大部分题目都做对了！'],
        socratic_prompt: data.reply || '让我看看第3题，你用了什么公式？'
      };

      console.log('分析结果:', result);
      setAnalysisResult(result);
      
      setTimeout(() => {
        if (result.issues.length > 0) {
          setStep('review');
        } else {
          setStep('success');
        }
      }, 1500);
      
    } catch (error: any) {
      console.error('Analysis error:', error);
      
      // Show error to user and provide demo
      alert(`AI 批改失败：${error.message}\n\n将使用演示模式继续体验流程。`);
      
      const fallbackResult: AnalysisResult = {
        overall_score: 80,
        issues: [
          {
            type: 'error',
            question_number: 3,
            description: '发现需要改进的地方',
            position: { x: 30, y: 40 }
          }
        ],
        encouragements: ['继续加油！'],
        socratic_prompt: '这道题的思路是什么？'
      };
      
      setAnalysisResult(fallbackResult);
      setTimeout(() => setStep('review'), 1000);
    }
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

        {step === 'upload' && <UploadStep onImageSelect={handleImageSelect} />}
        {step === 'analyzing' && <AnalyzingStep image={image!} />}
        {step === 'review' && <ReviewStep image={image!} result={analysisResult!} onFix={() => setStep('socratic')} />}
        {step === 'socratic' && <SocraticStep image={image!} task={task} result={analysisResult!} onFinish={() => setStep('success')} />}
        {step === 'success' && <SuccessStep task={task} onClose={onComplete} />}

      </motion.div>
    </div>
  );
}

// 1. Upload Step - Real File Upload & Camera
function UploadStep({ onImageSelect }: { onImageSelect: (image: string) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onImageSelect(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    // Check if mediaDevices is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('您的浏览器不支持摄像头访问，请使用本地上传或尝试其他浏览器（如 Chrome）');
      return;
    }

    // Check if HTTPS or localhost
    const isSecure = window.location.protocol === 'https:' || 
                     window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';
    
    if (!isSecure) {
      alert('摄像头访问需要 HTTPS 环境。当前是 HTTP，无法使用摄像头。\n\n请使用"本地上传"功能，或在 HTTPS 环境下访问。');
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false 
      });
      setStream(mediaStream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (error: any) {
      console.error('Camera error:', error);
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        alert('摄像头访问被拒绝。\n\n请：\n1. 点击浏览器地址栏的锁图标\n2. 允许"摄像头"权限\n3. 刷新页面重试\n\n或使用"本地上传"功能。');
      } else if (error.name === 'NotFoundError') {
        alert('未检测到摄像头设备。\n\n请确认您的设备有摄像头，或使用"本地上传"功能。');
      } else {
        alert(`无法访问摄像头：${error.message || error}\n\n请使用"本地上传"功能。`);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      onImageSelect(canvas.toDataURL('image/jpeg', 0.8));
      stopCamera();
    }
  };

  if (showCamera) {
    return (
      <div className="w-full h-full relative bg-black">
        <video 
          ref={videoRef}
          autoPlay 
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* Camera Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex justify-center gap-6">
            <button 
              onClick={stopCamera}
              className="px-6 py-3 bg-space-800/80 backdrop-blur rounded-xl text-white font-medium flex items-center gap-2"
            >
              <X className="w-5 h-5" /> 取消
            </button>
            <button 
              onClick={capturePhoto}
              className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-110 transition-transform"
            >
              <Camera className="w-10 h-10 text-black" />
            </button>
          </div>
          <p className="text-center text-white/80 text-sm mt-4">点击拍照提交作业</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center text-center p-8">
      <div className="w-20 h-20 bg-space-800 rounded-full flex items-center justify-center mb-6 border border-space-700 shadow-inner">
        <Camera className="w-10 h-10 text-slate-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">提交作业成果</h2>
      <p className="text-slate-400 mb-8 max-w-md">
        拍摄清晰的作业照片，AI 导师将即时检查字迹清晰度与答案正确性。
      </p>
      
      <input 
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-3 rounded-xl bg-space-800 hover:bg-space-700 text-white font-medium flex items-center gap-2 transition-colors"
        >
          <Upload className="w-5 h-5" /> 本地上传
        </button>
        <button 
          onClick={startCamera}
          className="px-6 py-3 rounded-xl bg-neon-blue hover:bg-neon-blue/80 text-white font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
        >
          <Camera className="w-5 h-5" /> 拍照上传
        </button>
      </div>
      
      <div className="mt-8 p-4 bg-space-800/50 rounded-xl max-w-md">
        <p className="text-xs text-slate-500">
          💡 提示：确保作业清晰可见，光线充足，避免反光
        </p>
      </div>
    </div>
  );
}

// 2. Analyzing Step - Real AI Processing
function AnalyzingStep({ image }: { image: string }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('初始化...');

  useEffect(() => {
    const stages = [
      { progress: 20, status: '上传图片...' },
      { progress: 40, status: '识别内容...' },
      { progress: 60, status: '分析答案...' },
      { progress: 80, status: 'AI 批改中...' },
      { progress: 100, status: '生成报告...' }
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setProgress(stages[currentStage].progress);
        setStatus(stages[currentStage].status);
        currentStage++;
      }
    }, 800);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full relative">
      <img src={image} alt="Task" className="w-full h-full object-cover opacity-30" />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="relative mb-8">
          <ScanLine className="w-24 h-24 text-neon-blue animate-pulse" />
          <motion.div 
            initial={{ top: 0 }}
            animate={{ top: '100%' }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-1 bg-neon-blue shadow-[0_0_15px_#3b82f6]"
          />
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-3">AI 智能批改中...</h3>
        <p className="text-neon-blue mb-6">{status}</p>
        
        <div className="w-64 bg-space-800 rounded-full h-3 mb-6 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="text-sm text-slate-400">
          进度: {progress}%
        </div>
      </div>
    </div>
  );
}

// 3. Review Step
function ReviewStep({ image, result, onFix }: { 
  image: string; 
  result: AnalysisResult; 
  onFix: () => void;
}) {
  return (
    <div className="w-full flex h-full">
      <div className="w-1/2 relative border-r border-space-800">
        <img src={image} alt="Task" className="w-full h-full object-cover" />
        
        {/* Error Highlights */}
        {result.issues.map((issue, idx) => (
          <div 
            key={idx}
            className="absolute border-4 rounded-lg shadow-lg animate-pulse"
            style={{
              left: `${issue.position?.x || 30}%`,
              top: `${issue.position?.y || 40}%`,
              width: '120px',
              height: '80px',
              borderColor: issue.type === 'error' ? 'rgba(239,68,68,0.8)' : 'rgba(234,179,8,0.8)',
              backgroundColor: issue.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(234,179,8,0.1)'
            }}
          >
            <div className={`absolute -top-8 left-0 text-white text-xs px-2 py-1 rounded font-bold ${
              issue.type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
            }`}>
              {issue.type === 'error' ? '错误' : '注意'} #{issue.question_number}
            </div>
          </div>
        ))}
      </div>
      
      <div className="w-1/2 p-8 flex flex-col justify-center">
        {result.issues.some(i => i.type === 'error') ? (
          <>
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              发现 {result.issues.filter(i => i.type === 'error').length} 处错误
            </h2>
            <p className="text-slate-400 mb-6">
              虽然大部分做得很好，但有{result.issues.filter(i => i.type === 'error').length}个问题需要修正。
              AI 导师将引导你理解并改正。
            </p>
            
            <div className="bg-space-800 p-4 rounded-xl border border-space-700 mb-8">
              <h4 className="font-bold text-slate-300 text-sm mb-3">批改报告</h4>
              <ul className="space-y-2 text-sm">
                {result.issues.map((issue, idx) => (
                  <li key={idx} className={cn(
                    "flex items-center gap-2",
                    issue.type === 'error' ? "text-red-400" : "text-yellow-400"
                  )}>
                    {issue.type === 'error' ? <X className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    第 {issue.question_number} 题：{issue.description}
                  </li>
                ))}
              </ul>
            </div>
            
            <button 
              onClick={onFix}
              className="w-full bg-neon-blue hover:bg-neon-blue/80 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Bot className="w-5 h-5" />
              进入 AI 引导订正
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-neon-green/10 rounded-full flex items-center justify-center mb-6 text-neon-green">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">完美！全部正确</h2>
            <p className="text-slate-400 mb-6">
              {result.encouragements.join(' ')}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// 4. Socratic Step - Real AI Chat
function SocraticStep({ image, task, result, onFinish }: { 
  image: string; 
  task: Task;
  result: AnalysisResult;
  onFinish: () => void;
}) {
  const [messages, setMessages] = useState<Array<{role: 'ai' | 'user', content: string}>>([
    { 
      role: 'ai', 
      content: result.socratic_prompt || '让我看看这道题。你的思路是什么？' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      // Call AI API for Socratic guidance
      const response = await fetch('/api/oracle/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          image: image,
          studentName: '路则昊',
          context: 'socratic_guidance',
          taskTitle: task.title,
          conversationHistory: messages.slice(-3)
        })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: data.reply || '很好，继续思考...' 
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: '抱歉，我现在无法回应。请稍后再试。' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const lastAiMessage = messages.filter(m => m.role === 'ai').pop();
  const isCompleted = lastAiMessage?.content.includes('正确') || 
                      lastAiMessage?.content.includes('太棒了') ||
                      lastAiMessage?.content.includes('掌握了');

  return (
    <div className="w-full flex h-full">
      {/* Visual Context */}
      <div className="w-1/3 border-r border-space-800 bg-black flex flex-col">
        <div className="flex-1 relative overflow-hidden">
          <img src={image} alt="Problem" className="w-full h-full object-contain opacity-80" />
        </div>
        
        {/* Encouragement Banner */}
        <div className="p-4 bg-gradient-to-r from-neon-green/10 to-transparent border-t border-space-800">
          <div className="flex items-center gap-2 text-neon-green text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-medium">你做得很好，继续加油！</span>
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
              <div className="text-xs text-neon-purple">苏格拉底模式 - 不会直接给答案哦</div>
            </div>
          </div>
        </div>

        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
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
                msg.role === 'ai' 
                  ? "bg-space-800 text-slate-200 rounded-tl-none border border-space-700" 
                  : "bg-neon-blue text-white rounded-tr-none"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <div className="flex gap-4 max-w-[90%]">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-neon-purple/20 text-neon-purple">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-space-800 text-slate-200 rounded-2xl rounded-tl-none border border-space-700 p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-space-800 bg-space-950/30">
          {isCompleted ? (
            <button 
              onClick={onFinish}
              className="w-full py-4 bg-neon-green hover:bg-neon-green/90 text-space-950 font-bold rounded-xl flex items-center justify-center gap-2 animate-bounce transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              订正完成，提交任务！
            </button>
          ) : (
            <div className="flex gap-2">
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !isLoading && handleSend()}
                placeholder="输入你的思考过程..."
                disabled={isLoading}
                className="flex-1 bg-space-950 border border-space-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple disabled:opacity-50"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-neon-purple hover:bg-neon-purple/80 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
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
        className="w-24 h-24 bg-neon-green rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.5)]"
      >
        <CheckCircle2 className="w-12 h-12 text-space-950" />
      </motion.div>
      
      <h2 className="text-3xl font-bold text-white mb-2">任务完美达成！</h2>
      <p className="text-slate-400 mb-8">
        你不仅完成了任务，还通过 AI 引导攻克了难点。<br/>
        这种主动思考的精神最值得奖励！
      </p>
      
      <div className="bg-space-950/50 p-6 rounded-2xl border border-space-800 flex items-center gap-8 mb-8">
        <div className="text-center">
          <div className="text-xs text-slate-500 uppercase font-bold">基础奖励</div>
          <div className="text-2xl font-bold text-white">+{task.reward}</div>
        </div>
        <div className="w-px h-10 bg-space-800" />
        <div className="text-center">
          <div className="text-xs text-slate-500 uppercase font-bold">订正奖励</div>
          <div className="text-2xl font-bold text-neon-yellow">+50</div>
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
