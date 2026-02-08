import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  Target, 
  Sparkles, // Galaxy
  Users,    // Squad
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';

export function BottomBar() {
  const { currentUser } = useStore();

  const navItems = [
    { icon: LayoutDashboard, label: '战况', path: '/' },
    { icon: Map, label: '任务', path: '/missions' },
    { icon: Target, label: '专注', path: '/focus' },
    { icon: Sparkles, label: '星图', path: '/galaxy' }, // New
    { icon: Users, label: '战队', path: '/squad' },     // New
  ];

  if (currentUser?.role === 'parent') return null; // Parents mostly use desktop

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-space-950/90 backdrop-blur-xl border-t border-space-800 pb-safe z-50">
      <div className="flex justify-around items-center p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all relative",
              isActive ? "text-neon-blue" : "text-slate-500"
            )}
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  "p-1.5 rounded-full transition-all",
                  isActive ? "bg-neon-blue/10 translate-y-[-5px]" : ""
                )}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute -bottom-2 w-1 h-1 bg-neon-blue rounded-full"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
