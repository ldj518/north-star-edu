import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Map, ShoppingBag, Target, Bot, LogOut, History, 
  ShieldCheck, GraduationCap, Scale, Brain, Activity
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export function Sidebar() {
  const { currentUser, logout } = useStore();
  const navigate = useNavigate();

  // Define nav items based on role
  const navItems = currentUser?.role === 'parent' ? [
    { icon: ShieldCheck, label: '指挥官控制台', path: '/commander' },
    { icon: LayoutDashboard, label: '学生视图预览', path: '/' },
    { icon: GraduationCap, label: '学业档案', path: '/academics' },
    { icon: Scale, label: '奖惩记录', path: '/tribunal' },
    { icon: History, label: '档案馆', path: '/vault' },
  ] : [
    { icon: LayoutDashboard, label: '战况室', path: '/' },
    { icon: Map, label: '任务规划', path: '/missions' },
    { icon: Target, label: '鹰眼监督', path: '/focus' },
    { icon: Bot, label: 'AI 导师', path: '/oracle' },
    { icon: GraduationCap, label: '学业档案', path: '/academics' },
    { icon: Activity, label: '预言家', path: '/prophet' }, // Added
    { icon: Brain, label: '错题枢纽', path: '/nexus' },
    { icon: Scale, label: '奖惩记录', path: '/tribunal' },
    { icon: History, label: '档案馆', path: '/vault' },
    { icon: ShoppingBag, label: '补给站', path: '/market' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside 
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-screen w-20 md:w-64 bg-space-900/50 backdrop-blur-xl border-r border-space-800 flex flex-col z-50"
    >
      <div className="p-6 flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center font-bold text-white ${
          currentUser?.role === 'parent' ? 'bg-neon-purple' : 'bg-neon-blue'
        }`}>
          {currentUser?.role === 'parent' ? 'C' : 'N'}
        </div>
        <span className="hidden md:block font-bold text-lg tracking-wider text-white">
          {currentUser?.role === 'parent' ? 'COMMANDER' : 'NORTH STAR'}
        </span>
      </div>

      <div className="px-6 mb-4">
        <div className="bg-space-800/50 rounded-xl p-3 flex items-center gap-3 border border-space-700">
          <img src={currentUser?.avatar} className="w-8 h-8 rounded-full bg-space-950" alt="Avatar" />
          <div className="hidden md:block overflow-hidden">
            <div className="text-sm font-bold text-white truncate">{currentUser?.name}</div>
            <div className="text-xs text-slate-500 capitalize">{currentUser?.role}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative",
              isActive 
                ? "bg-neon-blue/10 text-neon-blue shadow-[0_0_20px_rgba(59,130,246,0.1)]" 
                : "text-slate-400 hover:bg-space-800 hover:text-white"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span className="hidden md:block font-medium text-sm">{item.label}</span>
            
            {/* Active Indicator */}
            <NavLink to={item.path}>
              {({ isActive }) => isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-6 bg-neon-blue rounded-r-full"
                />
              )}
            </NavLink>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-space-800">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 w-full transition-colors rounded-xl hover:bg-red-500/10"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="hidden md:block font-medium">退出登录</span>
        </button>
      </div>
    </motion.aside>
  );
}
