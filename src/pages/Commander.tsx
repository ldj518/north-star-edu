import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { 
  Bot, 
  ShieldCheck, 
  Gavel, 
  Settings, 
  CheckCircle2, 
  XCircle, 
  AlertOctagon,
  Award,
  Clock,
  ChevronRight,
  Save,
  History,
  Coins,
  Search,
  Target,
  Users,
  UserPlus,
  Key
} from 'lucide-react';
import { SmartAssign } from '../components/SmartAssign';
import { Strategy } from '../components/Strategy';

export function Commander() {
  const [activeTab, setActiveTab] = useState<'strategy' | 'family' | 'assign' | 'audit' | 'rewards' | 'rules' | 'logs'>('strategy');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-neon-blue">指挥官控制台 Commander 2.0</h2>
          <p className="text-slate-400">系统最高权限：经济调控、任务审批与行为审计。</p>
        </div>
        <div className="flex bg-space-900 rounded-lg p-1 border border-space-800 overflow-x-auto max-w-full custom-scrollbar">
          {[
            { id: 'strategy', label: '战略指挥', icon: Target },
            { id: 'family', label: '家庭成员', icon: Users }, // New
            { id: 'assign', label: '智能指派', icon: Bot },
            { id: 'audit', label: '任务审批', icon: ShieldCheck },
            { id: 'rewards', label: '奖惩裁决', icon: Gavel },
            { id: 'rules', label: '规则配置', icon: Settings },
            { id: 'logs', label: '审计日志', icon: History },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-neon-blue text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-space-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'strategy' && (
          <motion.div key="strategy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Strategy />
          </motion.div>
        )}
        {activeTab === 'family' && <FamilyPanel key="family" />}
        {activeTab === 'assign' && (
          <motion.div key="assign" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <SmartAssign />
          </motion.div>
        )}
        {activeTab === 'audit' && <AuditPanel key="audit" />}
        {activeTab === 'rewards' && <RewardsPanel key="rewards" />}
        {activeTab === 'rules' && <RulesPanel key="rules" />}
        {activeTab === 'logs' && <LogsPanel key="logs" />}
      </AnimatePresence>
    </div>
  );
}

function FamilyPanel() {
  const { users, currentUser, addUser, updateUser, deleteUser } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter students linked to this parent
  const students = users.filter(u => u.role === 'student' && u.parentId === currentUser?.id);

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;

    addUser({
      id: `s-${Date.now()}`,
      username,
      name,
      role: 'student',
      parentId: currentUser?.id,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      status: 'active'
    });
    setShowAddModal(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="bg-space-900/50 backdrop-blur-sm border border-space-800 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-neon-blue" />
              领航员管理 (Students)
            </h3>
            <p className="text-sm text-slate-400">管理孩子的账号、密码及个性化设置。</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-neon-blue hover:bg-neon-blue/80 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shadow-lg"
          >
            <UserPlus className="w-4 h-4" /> 添加孩子账号
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {students.map((student) => (
            <div key={student.id} className="bg-space-800 p-6 rounded-xl border border-space-700 flex items-center gap-6 group">
              <img src={student.avatar} className="w-16 h-16 rounded-full border-2 border-space-600 group-hover:border-neon-blue transition-colors" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-white text-lg">{student.name}</h4>
                  <span className="text-xs bg-space-950 px-2 py-1 rounded text-slate-400 font-mono">{student.username}</span>
                </div>
                <p className="text-xs text-slate-500 mb-4">Linked to: {currentUser?.name}</p>
                
                <div className="flex gap-2">
                  <button className="flex-1 bg-space-900 hover:bg-space-700 py-2 rounded-lg text-xs text-slate-300 transition-colors border border-space-700 flex items-center justify-center gap-2">
                    <Key className="w-3 h-3" /> 重置密码
                  </button>
                  <button className="flex-1 bg-space-900 hover:bg-space-700 py-2 rounded-lg text-xs text-slate-300 transition-colors border border-space-700">
                    编辑资料
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {students.length === 0 && (
            <div className="col-span-2 text-center py-12 border-2 border-dashed border-space-800 rounded-xl text-slate-500">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              暂无关联的学生账号，请点击右上角添加。
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-space-900 border border-space-700 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-white mb-4">添加新的领航员</h3>
            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">孩子姓名</label>
                <input name="name" required className="w-full bg-space-950 border border-space-700 rounded-lg p-3 text-white" placeholder="例如：路则昊" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">登录账号</label>
                <input name="username" required className="w-full bg-space-950 border border-space-700 rounded-lg p-3 text-white" placeholder="例如：zehao" />
              </div>
              <button className="w-full bg-neon-blue hover:bg-neon-blue/80 text-white font-bold py-3 rounded-xl">确认创建</button>
              <button type="button" onClick={() => setShowAddModal(false)} className="w-full text-slate-500 py-2">取消</button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ... Rest of the panels (AuditPanel, RewardsPanel, etc.) remain unchanged but need to be included in the file.
// For brevity, I will include the existing panels below.

function AuditPanel() {
  const [pendingTasks, setPendingTasks] = useState([
    { id: 1, title: '英语单词 Unit 1 抄写', time: '10:30', evidence: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80', status: 'pending', reward: 50 },
    { id: 2, title: '数学几何题专项训练', time: 'Yesterday', evidence: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80', status: 'pending', reward: 80 }
  ]);

  const handleApprove = (id: number) => {
    setPendingTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {pendingTasks.map((task) => (
        <div key={task.id} className="bg-space-900/50 backdrop-blur-sm border border-space-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="relative h-48 bg-space-950">
            <img src={task.evidence} alt="Evidence" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-white">
              {task.time}
            </div>
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-2">{task.title}</h3>
            <p className="text-sm text-slate-400 mb-6">申请奖励：<span className="text-neon-yellow font-bold text-lg">{task.reward} 🪙</span></p>
            
            <div className="mt-auto grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleApprove(task.id)}
                className="py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <XCircle className="w-5 h-5" />
                驳回重做
              </button>
              <button 
                onClick={() => handleApprove(task.id)}
                className="py-3 rounded-xl bg-neon-green/20 text-neon-green hover:bg-neon-green/30 transition-colors flex items-center justify-center gap-2 font-bold shadow-[0_0_15px_rgba(34,197,94,0.1)]"
              >
                <CheckCircle2 className="w-5 h-5" />
                批准通过
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {pendingTasks.length === 0 && (
        <div className="col-span-2 text-center py-20 bg-space-900/30 rounded-2xl border-2 border-dashed border-space-800">
          <ShieldCheck className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-500">所有任务已审批</h3>
          <p className="text-slate-600">指挥官，您可以休息一下了。</p>
        </div>
      )}
    </motion.div>
  );
}

function RewardsPanel() {
  const [manualAmount, setManualAmount] = useState('');
  const [manualReason, setManualReason] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="bg-space-900/50 backdrop-blur-sm border border-space-800 rounded-2xl p-6">
        <h3 className="font-bold text-white mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-neon-yellow" />
          上帝之手 (手动奖惩)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-2">奖惩金额 (+奖励 / -扣除)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  placeholder="+50 或 -100"
                  className="w-full bg-space-950 border border-space-700 rounded-xl py-3 px-4 text-white focus:border-neon-blue focus:outline-none font-mono font-bold text-lg"
                />
                <Coins className="absolute right-4 top-3.5 w-5 h-5 text-slate-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-2">事由备注</label>
              <input 
                type="text" 
                value={manualReason}
                onChange={(e) => setManualReason(e.target.value)}
                placeholder="例如：主动洗碗、数学考满分..."
                className="w-full bg-space-950 border border-space-700 rounded-xl py-3 px-4 text-white focus:border-neon-blue focus:outline-none"
              />
            </div>
            <button className="w-full bg-neon-blue hover:bg-neon-blue/80 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              立即执行
            </button>
          </div>

          <div className="bg-space-950/50 rounded-xl p-4 border border-space-800">
            <h4 className="text-xs text-slate-500 font-bold mb-3 uppercase tracking-wider">快捷预设</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '主动做家务', val: '+50', color: 'text-neon-green border-neon-green/20 hover:bg-neon-green/10' },
                { label: '受到老师表扬', val: '+100', color: 'text-neon-green border-neon-green/20 hover:bg-neon-green/10' },
                { label: '玩手机超时', val: '-50', color: 'text-red-400 border-red-500/20 hover:bg-red-500/10' },
                { label: '态度顶撞', val: '-100', color: 'text-red-400 border-red-500/20 hover:bg-red-500/10' },
                { label: '早起晨读', val: '+30', color: 'text-neon-yellow border-neon-yellow/20 hover:bg-neon-yellow/10' },
                { label: '作业字迹潦草', val: '-20', color: 'text-red-400 border-red-500/20 hover:bg-red-500/10' },
              ].map((preset) => (
                <button 
                  key={preset.label}
                  className={`border rounded-lg p-3 text-left transition-colors flex justify-between items-center ${preset.color}`}
                >
                  <span className="text-sm font-medium">{preset.label}</span>
                  <span className="font-mono font-bold">{preset.val}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RulesPanel() {
  const [rules, setRules] = useState([
    { id: 1, category: 'Earning', name: '标准作业奖励', value: 50, unit: 'coins/次', desc: '完成一项标准寒假作业（如一张试卷）' },
    { id: 2, category: 'Earning', name: '专注时长奖励', value: 1, unit: 'coins/min', desc: '每专注学习 1 分钟的基础收益' },
    { id: 3, category: 'Earning', name: '验证成功加成', value: 20, unit: 'coins/次', desc: '通过随机弹窗验证的额外奖励' },
    { id: 4, category: 'Spending', name: '游戏汇率', value: 200, unit: 'coins/hr', desc: '兑换 1 小时电子游戏时间' },
    { id: 5, category: 'Spending', name: '手机汇率', value: 300, unit: 'coins/hr', desc: '兑换 1 小时手机自由使用权' },
    { id: 6, category: 'Spending', name: '现金汇率', value: 10, unit: 'coins/元', desc: '星币兑换零花钱的比率' },
  ]);

  const handleUpdate = (id: number, val: number) => {
    setRules(rules.map(r => r.id === id ? { ...r, value: val } : r));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-space-900/50 backdrop-blur-sm border border-space-800 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-neon-blue" />
          系统参数配置
        </h3>
        <button className="bg-neon-blue hover:bg-neon-blue/80 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
          <Save className="w-4 h-4" /> 保存生效
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-neon-green font-bold mb-4 text-sm uppercase tracking-wider">💰 收入规则 (Income)</h4>
          <div className="space-y-4">
            {rules.filter(r => r.category === 'Earning').map(rule => (
              <div key={rule.id} className="bg-space-950 p-4 rounded-xl border border-space-800">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-white">{rule.name}</div>
                  <div className="font-mono font-bold text-lg text-neon-green">
                    <input 
                      type="number" 
                      value={rule.value}
                      onChange={(e) => handleUpdate(rule.id, parseInt(e.target.value))}
                      className="w-16 bg-transparent text-right border-b border-dashed border-slate-600 focus:border-neon-blue focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>{rule.desc}</span>
                  <span>{rule.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-red-400 font-bold mb-4 text-sm uppercase tracking-wider">💸 消费汇率 (Expense)</h4>
          <div className="space-y-4">
            {rules.filter(r => r.category === 'Spending').map(rule => (
              <div key={rule.id} className="bg-space-950 p-4 rounded-xl border border-space-800">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-white">{rule.name}</div>
                  <div className="font-mono font-bold text-lg text-red-400">
                    <input 
                      type="number" 
                      value={rule.value}
                      onChange={(e) => handleUpdate(rule.id, parseInt(e.target.value))}
                      className="w-16 bg-transparent text-right border-b border-dashed border-slate-600 focus:border-neon-blue focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>{rule.desc}</span>
                  <span>{rule.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LogsPanel() {
  const logs = [
    { id: 1, time: '2026-02-06 14:30', action: '作业奖励', detail: '生物寒假作业 P10-15', amount: '+50', balance: 1250 },
    { id: 2, time: '2026-02-06 13:15', action: '专注验证', detail: '成功通过 Ghost Check', amount: '+20', balance: 1200 },
    { id: 3, time: '2026-02-06 12:00', action: '消费兑换', detail: '王者荣耀 30分钟', amount: '-100', balance: 1180 },
    { id: 4, time: '2026-02-06 09:30', action: '人工惩罚', detail: '赖床，未按时晨读', amount: '-30', balance: 1280 },
    { id: 5, time: '2026-02-06 08:00', action: '签到奖励', detail: '连续打卡 4 天', amount: '+10', balance: 1310 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-space-900/50 backdrop-blur-sm border border-space-800 rounded-2xl overflow-hidden"
    >
      <div className="p-4 border-b border-space-800 flex justify-between items-center">
        <h3 className="font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-slate-400" />
          系统审计日志
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="搜索记录..." 
            className="bg-space-950 border border-space-700 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:border-neon-blue focus:outline-none w-64"
          />
        </div>
      </div>
      
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase bg-space-950 border-b border-space-800">
          <tr>
            <th className="px-6 py-3">时间</th>
            <th className="px-6 py-3">类型</th>
            <th className="px-6 py-3">详情</th>
            <th className="px-6 py-3 text-right">变动</th>
            <th className="px-6 py-3 text-right">余额</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-space-800">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-space-800/30 transition-colors">
              <td className="px-6 py-4 font-mono text-slate-400">{log.time}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  log.amount.startsWith('+') 
                    ? 'bg-neon-green/10 text-neon-green' 
                    : 'bg-red-500/10 text-red-500'
                }`}>
                  {log.action}
                </span>
              </td>
              <td className="px-6 py-4 text-white">{log.detail}</td>
              <td className={`px-6 py-4 text-right font-mono font-bold ${
                log.amount.startsWith('+') ? 'text-neon-green' : 'text-red-500'
              }`}>
                {log.amount}
              </td>
              <td className="px-6 py-4 text-right font-mono text-slate-300">{log.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="p-4 border-t border-space-800 text-center">
        <button className="text-sm text-slate-500 hover:text-white transition-colors">加载更多记录...</button>
      </div>
    </motion.div>
  );
}
