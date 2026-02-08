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
    { icon: Sparkles, label: '星图', path: '/galaxy' },
    { icon: Users, label: '战队', path: '/squad' },
  ];

  if (currentUser?.role === 'parent') return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-space-950/95 backdrop-blur-xl border-t border-space-800 z-50 safe-area-bottom">
      <div className="flex justify-around items-center px-2 py-1 pb-safe">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center gap-0.5 px-3 py-2 min-h-[44px] rounded-xl transition-all relative touch-manipulation no-select",
              isActive ? "text-neon-blue" : "text-slate-500"
            )}
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  "p-1.5 rounded-full transition-all",
                  isActive ? "bg-neon-blue/10 -translate-y-0.5" : ""
                )}>
                  <item.icon className="w-6 h-6" strokeWidth={2} />
                </div>
                <span className="text-[10px] font-medium leading-tight">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute -bottom-1 w-1 h-1 bg-neon-blue rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
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
