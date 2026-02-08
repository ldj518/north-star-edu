import { motion } from 'framer-motion';
import { XAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Camera, Ruler, Weight, History, Download } from 'lucide-react';

const growthData = [
  { month: 'Sep', height: 162, weight: 48 },
  { month: 'Oct', height: 162.5, weight: 48.5 },
  { month: 'Nov', height: 163, weight: 49 },
  { month: 'Dec', height: 163.2, weight: 49.2 },
  { month: 'Jan', height: 163.5, weight: 50 },
  { month: 'Feb', height: 164, weight: 50.5 },
];

const memories = [
  { id: 1, date: '2026-02-01', title: '英语测验首次及格', type: 'milestone', image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80' },
  { id: 2, date: '2026-01-25', title: '寒假计划启动仪式', type: 'photo', image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80' },
  { id: 3, date: '2026-01-15', title: '生物满分试卷存档', type: 'doc', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80' },
];

export function Vault() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold mb-2">家族档案馆 The Vault</h2>
          <p className="text-slate-400">记录每一个成长的脚印。</p>
        </div>
        <button className="bg-space-800 hover:bg-space-700 text-white px-4 py-2 rounded-xl border border-space-700 flex items-center gap-2 text-sm">
          <Download className="w-4 h-4" /> 导出成长报告
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Physical Stats */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-space-900/50 backdrop-blur-sm p-6 rounded-2xl border border-space-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Ruler className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-slate-400">当前身高</div>
                <div className="text-2xl font-bold text-white">164 <span className="text-sm font-normal text-slate-500">cm</span></div>
              </div>
            </div>
            <div className="bg-space-900/50 backdrop-blur-sm p-6 rounded-2xl border border-space-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                <Weight className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-slate-400">当前体重</div>
                <div className="text-2xl font-bold text-white">50.5 <span className="text-sm font-normal text-slate-500">kg</span></div>
              </div>
            </div>
          </div>

          <div className="bg-space-900/50 backdrop-blur-sm p-6 rounded-2xl border border-space-800 h-[300px]">
            <h3 className="font-bold mb-4 text-sm text-slate-300">生长曲线 (近6个月)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorHeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="height" stroke="#3b82f6" fillOpacity={1} fill="url(#colorHeight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time Capsule */}
        <div className="bg-space-900/50 backdrop-blur-sm rounded-2xl border border-space-800 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-neon-yellow" />
              时光胶囊
            </h3>
            <button className="p-2 rounded-lg hover:bg-space-800 text-slate-400 transition-colors">
              <Camera className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
            {memories.map((memory) => (
              <motion.div 
                key={memory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer"
              >
                <img 
                  src={memory.image} 
                  alt={memory.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                  <div className="text-xs text-neon-yellow mb-1 font-mono">{memory.date}</div>
                  <h4 className="font-bold text-white">{memory.title}</h4>
                </div>
              </motion.div>
            ))}
            
            <button className="w-full py-8 border-2 border-dashed border-space-700 rounded-xl text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-colors flex flex-col items-center gap-2">
              <PlusCircle className="w-6 h-6" />
              <span>添加新的回忆</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlusCircle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
  );
}
