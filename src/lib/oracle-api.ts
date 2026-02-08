import { useState } from 'react';

type Message = {
  id: string;
  role: 'ai' | 'user';
  content: string;
  type?: 'text' | 'image' | 'analysis';
  timestamp?: Date;
};

export function useOracle() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'ai' as const, 
      content: '你好，路则昊！我是你的 AI 导师。遇到不会的题了吗？拍照发给我，我们一起找思路。', 
      type: 'text',
      timestamp: new Date()
    }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const sendMessage = async (userMessage: string, imageBase64?: string) => {
    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: userMessage,
      type: imageBase64 ? 'image' : 'text',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsAnalyzing(true);

    try {
      // Call real API
      const response = await fetch('/api/oracle/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          image: imageBase64,
          studentName: '路则昊',
          context: 'homework_help'
        })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: data.reply || '让我想想...',
        type: 'text',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Oracle API error:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: '抱歉，我现在无法回应。请稍后再试。',
        type: 'text',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { messages, isAnalyzing, sendMessage };
}
