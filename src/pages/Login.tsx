import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, ShieldCheck, User, LogIn, Lock } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [role, setRole] = useState<'student' | 'parent' | 'admin' | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username)) {
      // In a real app, we'd check password too
      const user = useStore.getState().currentUser;
      if (user?.role === 'admin') navigate('/admin');
      else if (user?.role === 'parent') navigate('/commander');
      else navigate('/');
    } else {
      setError('用户名不存在');
    }
  };

  const selectRole = (r: 'student' | 'parent' | 'admin') => {
    setRole(r);
    setError('');
    // Pre-fill for demo convenience
    if (r === 'admin') setUsername('admin');
    if (r === 'parent') setUsername('parent');
    if (r === 'student') setUsername('student');
  };

  return (
    <div className="min-h-screen bg-space-950 flex items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-neon-blue/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-neon-purple/10 rounded-full blur-[150px]" />

      <div className="relative z-10 w-full max-w-4xl px-4">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-neon-blue to-neon-purple p-[2px] mx-auto mb-4 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <div className="w-full h-full rounded-full bg-space-950 flex items-center justify-center text-3xl font-bold text-white">
                N
              </div>
            </div>
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
          >
            NORTH STAR
            <span className="block text-lg font-normal text-slate-400 mt-2 tracking-widest uppercase text-sm">Growth Navigation System v6.0</span>
          </motion.h1>
        </div>

        {!role ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Student */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => selectRole('student')}
              className="group relative h-64 rounded-3xl border border-space-800 bg-space-900/50 hover:bg-space-800 transition-all flex flex-col items-center justify-center gap-4 hover:border-neon-blue hover:scale-105"
            >
              <div className="w-16 h-16 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue group-hover:bg-neon-blue group-hover:text-white transition-colors">
                <Rocket className="w-8 h-8" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white">我是领航员</h3>
                <p className="text-slate-500 text-xs mt-1">学生入口</p>
              </div>
            </motion.button>

            {/* Parent */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => selectRole('parent')}
              className="group relative h-64 rounded-3xl border border-space-800 bg-space-900/50 hover:bg-space-800 transition-all flex flex-col items-center justify-center gap-4 hover:border-neon-purple hover:scale-105"
            >
              <div className="w-16 h-16 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple group-hover:bg-neon-purple group-hover:text-white transition-colors">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white">我是指挥官</h3>
                <p className="text-slate-500 text-xs mt-1">家长入口</p>
              </div>
            </motion.button>

            {/* Admin */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => selectRole('admin')}
              className="group relative h-64 rounded-3xl border border-space-800 bg-space-900/50 hover:bg-space-800 transition-all flex flex-col items-center justify-center gap-4 hover:border-red-500 hover:scale-105"
            >
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                <Lock className="w-8 h-8" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white">系统管理员</h3>
                <p className="text-slate-500 text-xs mt-1">后台维护</p>
              </div>
            </motion.button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-space-900 border border-space-800 rounded-3xl p-8 shadow-2xl relative"
          >
            <button onClick={() => setRole(null)} className="absolute top-4 left-4 text-slate-500 hover:text-white text-sm">
              &larr; 返回
            </button>
            
            <div className="text-center mb-8 mt-4">
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${
                role === 'student' ? 'bg-neon-blue/20 text-neon-blue' :
                role === 'parent' ? 'bg-neon-purple/20 text-neon-purple' :
                'bg-red-500/20 text-red-500'
              }`}>
                {role === 'student' ? <Rocket className="w-8 h-8" /> :
                 role === 'parent' ? <ShieldCheck className="w-8 h-8" /> :
                 <Lock className="w-8 h-8" />}
              </div>
              <h2 className="text-2xl font-bold text-white">登录系统</h2>
              <p className="text-slate-400 text-sm">请输入您的身份凭证</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1 ml-1">账号</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input 
                    type="text" 
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-space-950 border border-space-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-neon-blue focus:outline-none"
                    placeholder="Username"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-slate-400 mb-1 ml-1">密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-space-950 border border-space-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-neon-blue focus:outline-none"
                    placeholder="Password"
                  />
                </div>
              </div>

              {error && <div className="text-red-400 text-sm text-center">{error}</div>}

              <button className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
                role === 'student' ? 'bg-neon-blue hover:bg-neon-blue/80' :
                role === 'parent' ? 'bg-neon-purple hover:bg-neon-purple/80' :
                'bg-red-600 hover:bg-red-500'
              }`}>
                进入系统
              </button>
            </form>
            
            <div className="mt-6 text-center text-xs text-slate-600">
              Demo 默认密码: 任意输入
            </div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-slate-600 text-xs"
        >
          Protected by Quantum Encryption • ID: 47.89.191.58
        </motion.div>
      </div>
    </div>
  );
}
