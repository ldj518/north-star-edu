import React from 'react';
import { StatsRadar } from '../components/StatsRadar';
import { motion } from 'framer-motion';
import { CheckCircle2, Timer, TrendingUp, AlertTriangle, TrendingDown, Gamepad2, Flame, Trophy, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useStore } from '../store/useStore';
import { BossBattleCard } from '../components/BossBattleCard';

const incomeData = [
  { name: 'Mon', income: 150, expense: 50 },
  { name: 'Tue', income: 230, expense: 100 },
  { name: 'Wed', income: 180, expense: 0 },
  { name: 'Thu', income: 320, expense: 200 },
  { name: 'Fri', income: 290, expense: 50 },
  { name: 'Sat', income: 450, expense: 300 },
  { name: 'Sun', income: 380, expense: 100 },
];

const sourceData = [
  { name: '作业奖励', value: 65, color: '#3b82f6' },
  { name: '专注加成', value: 20, color: '#8b5cf6' },
  { name: '额外嘉奖', value: 15, color: '#eab308' },
];

const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-space-900/50 backdrop-blur-sm p-4 lg:p-6 rounded-xl lg:rounded-2xl border border-space-800 relative overflow-hidden group"
  >
    <div className={`absolute -right-4 -top-4 w-16 lg:w-24 h-16 lg:h-24 bg-${color}-500/10 rounded-full blur-2xl group-hover:bg-${color}-500/20 transition-all`} />
    
    <div className="flex justify-between items-start mb-3 lg:mb-4">
      <div className="flex-1">
        <h3 className="text-slate-400 text-xs lg:text-sm font-medium">{title}</h3>
        <div className="text-2xl lg:text-3xl font-bold text-white mt-1">{value}</div>
      </div>
      <div className={`p-2 lg:p-3 rounded-xl bg-${color}-500/10 text-${color}-500`}>
        <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
      </div>
    </div>
    
    <div className="text-[10px] lg:text-xs text-slate-500 font-medium">
      {sub}
    </div>
  </motion.div>
);

export function Dashboard() {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const { coins } = useStore();
  
  // Mock Motivation Data
  const targetReward = { name: '游戏时间 30min', cost: 1300, icon: Gamepad2 };
  const coinsNeeded = Math.max(0, targetReward.cost - coins);
  const progress = Math.min(100, (coins / targetReward.cost) * 100);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-2">战况室 Dashboard</h2>
          <p className="text-slate-400 text-sm lg:text-base">欢迎回来，领航员！今日表现优异，继续加油！</p>
        </div>
      </div>

      {/* Boss Battle & Motivation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Boss Card */}
        <div className="lg:col-span-1">
           <BossBattleCard />
        </div>
        
        {/* Motivation Zone */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          {/* ... existing motivation cards ... */}
          {/* 1. Reward Proximity */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-space-900 to-space-800 rounded-2xl p-6 border border-neon-blue/30 relative overflow-hidden flex flex-col justify-center"
          >
            {/* ... content ... */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Gamepad2 className="w-24 h-24 text-white" />
            </div>
            <div className="relative z-10">
              <h3 className="text-neon-blue font-bold flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4" /> 奖励冲刺
              </h3>
              <p className="text-slate-300 text-xs mb-3">
                再赚 <span className="text-white font-bold">{coinsNeeded}币</span> 兑换<br/>
                <span className="text-neon-yellow font-bold">{targetReward.name}</span>
              </p>
              <div className="h-2 bg-space-950 rounded-full overflow-hidden border border-space-700">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-neon-blue relative"
                />
              </div>
            </div>
          </motion.div>

          {/* 2. Streak Fire */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-space-900 to-space-800 rounded-2xl p-6 border border-orange-500/30 relative overflow-hidden flex flex-col justify-center"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Flame className="w-24 h-24 text-orange-500" />
            </div>
            <div className="relative z-10">
              <h3 className="text-orange-400 font-bold flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4" /> 连胜纪录
              </h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-white">4</span>
                <span className="text-sm text-slate-400">天</span>
              </div>
              <p className="text-slate-300 text-xs">
                再坚持 <span className="text-white font-bold">3 天</span> 解锁<br/>
                <span className="text-orange-400 font-bold">【免做家务卡】</span>
              </p>
            </div>
          </motion.div>

          {/* 3. Record Breaker */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-space-900 to-space-800 rounded-2xl p-6 border border-neon-purple/30 relative overflow-hidden flex flex-col justify-center"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Trophy className="w-24 h-24 text-purple-500" />
            </div>
            <div className="relative z-10">
              <h3 className="text-neon-purple font-bold flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4" /> 突破自我
              </h3>
              <p className="text-slate-300 text-xs mb-2">
                今日专注 <span className="text-white font-bold">45m</span>
              </p>
              <div className="bg-space-950/50 rounded-lg p-2 border border-space-700">
                <p className="text-[10px] text-slate-400">
                  <span className="text-neon-green font-bold">再坚持 10m</span> 打破记录!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* KPI Grid (Existing) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="今日任务" 
          value="8/12" 
          sub="进度领先 15%" 
          icon={CheckCircle2} 
          color="neon-blue" 
        />
        <StatCard 
          title="专注时长" 
          value="45m" 
          sub="距离目标还差 15m" 
          icon={Timer} 
          color="neon-purple" 
        />
        <StatCard 
          title="准确率" 
          value="92%" 
          sub="较上周提升 4%" 
          icon={TrendingUp} 
          color="neon-green" 
        />
        <StatCard 
          title="待修复" 
          value="3" 
          sub="英语错题待订正" 
          icon={AlertTriangle} 
          color="neon-pink" 
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Radar */}
        <div className="lg:col-span-1">
          <StatsRadar />
        </div>

        {/* Center: Coin Trend */}
        <div className="lg:col-span-2 bg-space-900/50 backdrop-blur-sm rounded-2xl border border-space-800 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white">星币收支趋势 (近7天)</h3>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1 text-neon-green"><span className="w-2 h-2 rounded-full bg-neon-green"></span> 收入</span>
              <span className="flex items-center gap-1 text-red-400"><span className="w-2 h-2 rounded-full bg-red-400"></span> 支出</span>
            </div>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={incomeData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="income" stroke="#22c55e" fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#f87171" fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Income Source Pie */}
        <div className="bg-space-900/50 backdrop-blur-sm rounded-2xl border border-space-800 p-6 flex flex-col">
          <h3 className="font-bold text-white mb-2">财富来源分析</h3>
          <p className="text-xs text-slate-400 mb-6">做作业是最稳定的收入来源</p>
          
          <div className="flex-1 flex items-center justify-center relative">
             <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
               <span className="text-3xl font-bold text-white">{activeIndex !== null ? sourceData[activeIndex].value : '100'}%</span>
               <span className="text-xs text-slate-500">{activeIndex !== null ? sourceData[activeIndex].name : '总计'}</span>
             </div>
             <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {sourceData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        stroke="none"
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    ))}
                  </Pie>
                </PieChart>
             </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {sourceData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}
              </div>
            ))}
          </div>
        </div>

        {/* Action Log */}
        <div className="lg:col-span-2 bg-space-900/50 backdrop-blur-sm rounded-2xl border border-space-800 p-6">
          <h3 className="font-bold mb-6">最新动态</h3>
          <div className="space-y-4">
            {[
              { time: '10:30', title: '完成生物作业 P10-15', coin: '+50', type: 'in' },
              { time: 'Yesterday', title: '兑换游戏时间 30分钟', coin: '-100', type: 'out' },
              { time: 'Yesterday', title: '专注验证失败 (Type A)', coin: '-20', type: 'loss' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-space-800/30 rounded-xl hover:bg-space-800 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.type === 'in' ? 'bg-neon-green/10 text-neon-green' : 
                    item.type === 'out' ? 'bg-neon-blue/10 text-neon-blue' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {item.type === 'in' ? <TrendingUp className="w-5 h-5" /> : 
                     item.type === 'out' ? <CheckCircle2 className="w-5 h-5" /> :
                     <TrendingDown className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-medium text-white">{item.title}</div>
                    <div className="text-xs text-slate-500">{item.time}</div>
                  </div>
                </div>
                <div className={`font-bold font-mono group-hover:scale-110 transition-transform ${
                  item.type === 'in' ? 'text-neon-green' : 
                  item.type === 'out' ? 'text-slate-400' :
                  'text-red-500'
                }`}>
                  {item.coin}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
