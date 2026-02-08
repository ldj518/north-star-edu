import { Sidebar } from './Sidebar';
import { BottomBar } from './BottomBar';
import { TopBar } from './TopBar';
import { Outlet } from 'react-router-dom';
import { AiCompanion } from './AiCompanion';

export function Layout() {
  return (
    <div className="min-h-screen bg-space-950 text-white font-sans selection:bg-neon-blue/30 pb-16 md:pb-0 overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-purple/5 rounded-full blur-[128px]" />
      </div>

      <div className="hidden md:block">
        <Sidebar />
      </div>
      <BottomBar />
      
      <TopBar />
      
      <main className="md:ml-64 p-3 md:p-8 relative z-10 min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>

      <div className="hidden md:block">
        <AiCompanion />
      </div>
    </div>
  );
}
