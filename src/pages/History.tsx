import { useState, useEffect } from 'react';
import { History, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getTransactions, getTaskHistory, getStats } from '../lib/storage';

export function History() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'tasks'>('transactions');
  const transactions = getTransactions();
  const taskHistory = getTaskHistory();
  const stats = getStats();

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl lg:text-3xl font-bold mb-2 flex items-center gap-3">
          <History className="w-6 h-6 lg:w-8 lg:h-8" />
          历史记录
        </h2>
        <p className="text-slate-400">查看你的所有活动和成就</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-space-900/50 border border-space-800 rounded-xl p-4">
          <div className="text-neon-green text-2xl font-bold">{stats.totalEarned} 🪙</div>
          <div className="text-xs text-slate-500 mt-1">总收入</div>
        </div>
        <div className="bg-space-900/50 border border-space-800 rounded-xl p-4">
          <div className="text-red-400 text-2xl font-bold">{stats.totalSpent} 🪙</div>
          <div className="text-xs text-slate-500 mt-1">总支出</div>
        </div>
        <div className="bg-space-900/50 border border-space-800 rounded-xl p-4">
          <div className="text-neon-blue text-2xl font-bold">{formatDuration(stats.totalFocusTime)}</div>
          <div className="text-xs text-slate-500 mt-1">总专注时长</div>
        </div>
        <div className="bg-space-900/50 border border-space-800 rounded-xl p-4">
          <div className="text-neon-yellow text-2xl font-bold">{stats.completedTasks}</div>
          <div className="text-xs text-slate-500 mt-1">完成任务</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'transactions'
              ? 'bg-neon-blue text-white'
              : 'bg-space-800 text-slate-400 hover:text-white'
          }`}
        >
          交易记录
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'tasks'
              ? 'bg-neon-blue text-white'
              : 'bg-space-800 text-slate-400 hover:text-white'
          }`}
        >
          任务历史
        </button>
      </div>

      {/* Content */}
      {activeTab === 'transactions' && (
        <div className="bg-space-900/50 border border-space-800 rounded-xl overflow-hidden">
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              暂无交易记录
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-space-950 border-b border-space-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">时间</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">类型</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">描述</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">金额</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-space-800">
                  {transactions.map(t => (
                    <tr key={t.id} className="hover:bg-space-800/50">
                      <td className="px-4 py-3 text-sm text-slate-400">
                        {new Date(t.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                          t.type === 'earn' 
                            ? 'bg-neon-green/10 text-neon-green' 
                            : 'bg-red-500/10 text-red-500'
                        }`}>
                          {t.type === 'earn' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {t.type === 'earn' ? '收入' : '支出'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300">{t.description}</td>
                      <td className={`px-4 py-3 text-right font-mono font-bold ${
                        t.type === 'earn' ? 'text-neon-green' : 'text-red-500'
                      }`}>
                        {t.type === 'earn' ? '+' : '-'}{t.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-3">
          {taskHistory.length === 0 ? (
            <div className="bg-space-900/50 border border-space-800 rounded-xl p-8 text-center text-slate-500">
              暂无任务历史
            </div>
          ) : (
            taskHistory.map(task => (
              <div key={task.id} className="bg-space-900/50 border border-space-800 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    task.status === 'completed' ? 'bg-neon-green/10' : 'bg-red-500/10'
                  }`}>
                    {task.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-neon-green" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{task.taskName}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(task.duration)}
                      </span>
                      <span>{new Date(task.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {task.status === 'completed' && (
                    <div className="text-neon-yellow font-bold">+{task.reward} 🪙</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
