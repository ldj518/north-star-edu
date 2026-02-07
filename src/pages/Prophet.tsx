import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target, 
  Brain, 
  ArrowRight,
  Activity,
  Zap
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  AreaChart,
  Area
} from 'recharts';

const predictionData = [
  { month: 'Sep', actual: 65, predicted: 65 },
  { month: 'Oct', actual: 68, predicted: 68 },
  { month: 'Nov', actual: 72, predicted: 72 },
  { month: 'Dec', actual: 70, predicted: 70 },
  { month: 'Jan', actual: 75, predicted: 75 },
  { month: 'Feb', actual: undefined, predicted: 78 }, // Changed null to undefined for Recharts safety
  { month: 'Mar', actual: undefined, predicted: 82 },
  { month: 'Apr', actual: undefined, predicted: 85 },
];

const risks = [
  { id: 1, subject: 'English', prob: 85, msg: '单词量增长停滞，期中考及格率预测仅为 60%。', action: '增加每日单词任务' },
  { id: 2, subject: 'Physics', prob: 40, msg: '力学单元错题率上升。', action: '专项复习：受力分析' },
];

export function Prophet() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Target className="w-8 h-8 text-neon-purple" />
            预言家系统 The Prophet
          </h2>
          <p className="text-slate-400">基于 AI 大数据的学业趋势预测。</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Prediction Chart */}
        <div className="lg:col-span-2 bg-space-900/50 backdrop-blur-sm border border-space-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-neon-blue" />
              总成绩走势预测
            </h3>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1 text-slate-400"><div className="w-3 h-1 bg-neon-blue rounded-full"/> 历史实绩</span>
              <span className="flex items-center gap-1 text-neon-purple"><div className="w-3 h-1 bg-neon-purple border border-dashed rounded-full"/> AI 预测</span>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictionData}>
                <defs>
                  <linearGradient id="gradientPredict" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="60%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tick={{fill: '#94a3b8'}} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{fill: '#94a3b8'}} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <ReferenceLine x="Jan" stroke="#64748b" strokeDasharray="3 3" label={{ position: 'top', value: 'Today', fill: '#64748b', fontSize: 12 }} />

                {/* Historical Line */}
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                  connectNulls
                />
                {/* Predicted Line */}
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ r: 4, fill: '#8b5cf6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-4 bg-neon-purple/10 border border-neon-purple/20 rounded-xl flex items-start gap-3">
            <Brain className="w-5 h-5 text-neon-purple shrink-0 mt-0.5" />
            <div>
              <div className="text-neon-purple font-bold text-sm mb-1">AI 分析报告</div>
              <p className="text-slate-300 text-xs leading-relaxed">
                基于当前的勤奋度（每日专注+45m），预计在 4 月份的期中考试中，你的总分将突破 **85分** 大关。
                但请注意，数学曲线呈现放缓趋势，建议加大投入。
              </p>
            </div>
          </div>
        </div>

        {/* Risk Monitor */}
        <div className="space-y-6">
          <div className="bg-space-900/50 backdrop-blur-sm border border-space-800 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              风险预警 Risk Radar
            </h3>

            <div className="space-y-4">
              {risks.map((risk) => (
                <motion.div
                  key={risk.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-space-800/50 p-4 rounded-xl border border-red-500/20 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-bl-lg">
                    风险度 {risk.prob}%
                  </div>

                  <div className="font-bold text-white mb-1">{risk.subject}</div>
                  <p className="text-xs text-red-300 mb-3">{risk.msg}</p>

                  <button className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-lg border border-red-500/30 flex items-center justify-center gap-1 transition-colors">
                    <Zap className="w-3 h-3" />
                    立即干预：{risk.action}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-neon-blue/20 to-space-900 border border-neon-blue/30 rounded-2xl p-6 text-center">
            <h3 className="text-neon-blue font-bold mb-2">模拟人生</h3>
            <p className="text-xs text-slate-400 mb-4">如果每天多背 20 个单词...</p>
            <div className="text-3xl font-bold text-white mb-2">Top 5</div>
            <p className="text-xs text-slate-300">期末预计排名</p>
            <button className="mt-4 w-full py-2 bg-neon-blue hover:bg-neon-blue/80 text-white font-bold rounded-xl text-sm shadow-lg">
              查看推演过程
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
