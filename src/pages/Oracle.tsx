import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, Send, Bot, User, Check, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useOracle } from '../lib/oracle-api';

export function Oracle() {
  const { messages, isAnalyzing, sendMessage } = useOracle();
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!inputText.trim() && !selectedImage) return;
    
    sendMessage(inputText || '请帮我看看这道题', selectedImage || undefined);
    setInputText('');
    setSelectedImage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Chat Area */}
      <div className="flex-1 bg-space-900/50 backdrop-blur-sm rounded-2xl border border-space-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-space-800 bg-space-900 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center border border-neon-purple/50">
              <Bot className="w-6 h-6 text-neon-purple" />
            </div>
            <div>
              <h3 className="font-bold text-white">GLM-4.7 导师</h3>
              <p className="text-xs text-neon-green flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                Online
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-500 bg-space-950 px-2 py-1 rounded border border-space-800">
            苏格拉底模式: ON
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-[80%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === 'ai' ? "bg-neon-purple/20 text-neon-purple" : "bg-neon-blue/20 text-neon-blue"
              )}>
                {msg.role === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === 'ai' 
                  ? "bg-space-800 text-slate-200 rounded-tl-none border border-space-700" 
                  : "bg-neon-blue text-white rounded-tr-none shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              )}>
                {msg.type === 'image' ? (
                  <div className="rounded-lg overflow-hidden border border-white/20">
                    <img src={msg.content} alt="Homework" className="max-w-full h-auto opacity-90" />
                  </div>
                ) : (
                  msg.content
                )}
                
                {msg.type === 'analysis' && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex gap-2">
                    <button className="px-3 py-1.5 rounded bg-space-950/50 hover:bg-space-900 text-xs transition-colors">
                      🤔 它是转折关系
                    </button>
                    <button className="px-3 py-1.5 rounded bg-space-950/50 hover:bg-space-900 text-xs transition-colors">
                      📜 它是因果关系
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-neon-purple" />
              </div>
              <div className="bg-space-800 p-4 rounded-2xl rounded-tl-none border border-space-700 flex items-center gap-2 text-slate-400 text-sm">
                <span className="w-2 h-2 bg-neon-purple rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-neon-purple rounded-full animate-bounce delay-75" />
                <span className="w-2 h-2 bg-neon-purple rounded-full animate-bounce delay-150" />
                正在分析字迹...
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-space-900 border-t border-space-800">
          {selectedImage && (
            <div className="mb-3 relative inline-block">
              <img src={selectedImage} alt="Upload" className="max-h-32 rounded-lg" />
              <button 
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <input 
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-xl bg-space-800 hover:bg-space-700 text-slate-400 hover:text-white transition-colors border border-space-700"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button className="p-3 rounded-xl bg-space-800 hover:bg-space-700 text-slate-400 hover:text-white transition-colors border border-space-700">
              <Camera className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="输入你的问题..." 
              className="flex-1 bg-space-950 border border-space-800 rounded-xl px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-neon-purple transition-colors"
            />
            <button 
              onClick={handleSend}
              className="p-3 rounded-xl bg-neon-purple hover:bg-neon-purple/80 text-white transition-colors shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Side Panel: Guidelines */}
      <div className="w-80 space-y-6 hidden lg:block">
        <div className="bg-space-900/50 backdrop-blur-sm rounded-2xl border border-space-800 p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-neon-green" />
            提问原则
          </h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5" />
              AI 不会直接给出答案，而是提供解题思路。
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5" />
              请先尝试自己做，再上传错题。
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5" />
              模糊的图片可能导致识别错误。
            </li>
          </ul>
        </div>

        <div className="bg-space-900/50 backdrop-blur-sm rounded-2xl border border-neon-yellow/20 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-neon-yellow/10 rounded-bl-full" />
          <h3 className="font-bold text-white mb-2 text-neon-yellow">今日挑战</h3>
          <p className="text-sm text-slate-300 mb-4">
            上传 3 道英语错题并完成订正。
          </p>
          <div className="w-full bg-space-800 rounded-full h-2 mb-2">
            <div className="w-1/3 h-full bg-neon-yellow rounded-full" />
          </div>
          <p className="text-xs text-right text-slate-500">1/3 Completed</p>
        </div>
      </div>
    </div>
  );
}
