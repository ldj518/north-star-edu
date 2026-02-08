import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

export function StatsRadar() {
  const { stats } = useStore();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-[300px] bg-space-900/50 backdrop-blur-sm rounded-2xl border border-space-800 p-4 relative overflow-hidden"
    >
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-lg font-bold text-white">能力雷达</h3>
        <p className="text-xs text-slate-400">基于近期测验数据</p>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="55%" outerRadius="70%" data={stats}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="#8b5cf6"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
