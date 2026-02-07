import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Shield, Activity, Trash2, Lock, Key } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { User } from '../store/useStore';

export function AdminDashboard() {
  const { users, addUser, updateUser, deleteUser } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter only parent accounts for admin to manage
  const parents = users.filter(u => u.role === 'parent');

  const handleCreateParent = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;

    addUser({
      id: `p-${Date.now()}`,
      username,
      name,
      role: 'parent',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      status: 'active'
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3 text-red-500">
            <Shield className="w-8 h-8" />
            系统管理员控制台 (Super Admin)
          </h2>
          <p className="text-slate-400">管理家庭指挥官账号，监控系统运行状态。</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shadow-lg"
        >
          <UserPlus className="w-4 h-4" /> 开通指挥官账号
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-space-900/50 border border-space-800 p-6 rounded-2xl">
          <div className="text-slate-400 text-sm mb-1">总用户数</div>
          <div className="text-3xl font-bold text-white">{users.length}</div>
        </div>
        <div className="bg-space-900/50 border border-space-800 p-6 rounded-2xl">
          <div className="text-slate-400 text-sm mb-1">活跃家庭</div>
          <div className="text-3xl font-bold text-neon-blue">{parents.length}</div>
        </div>
        <div className="bg-space-900/50 border border-space-800 p-6 rounded-2xl">
          <div className="text-slate-400 text-sm mb-1">系统负载</div>
          <div className="text-3xl font-bold text-neon-green flex items-center gap-2">
            <Activity className="w-6 h-6 animate-pulse" /> 正常
          </div>
        </div>
      </div>

      {/* Parents List */}
      <div className="bg-space-900/50 backdrop-blur-sm border border-space-800 rounded-2xl overflow-hidden">
        <div className="p-4 bg-space-950 border-b border-space-800 font-bold text-slate-300">
          已注册指挥官列表
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-space-900/50">
            <tr>
              <th className="px-6 py-3">用户</th>
              <th className="px-6 py-3">账号</th>
              <th className="px-6 py-3">状态</th>
              <th className="px-6 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-space-800">
            {parents.map((parent) => (
              <tr key={parent.id} className="hover:bg-space-800/30 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <img src={parent.avatar} className="w-8 h-8 rounded-full bg-space-800" />
                  <span className="font-bold text-white">{parent.name}</span>
                </td>
                <td className="px-6 py-4 font-mono text-slate-400">{parent.username}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    parent.status === 'active' ? 'bg-neon-green/10 text-neon-green' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {parent.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button 
                    onClick={() => updateUser(parent.id, { status: parent.status === 'active' ? 'suspended' : 'active' })}
                    className="p-2 bg-space-800 hover:bg-space-700 rounded-lg text-slate-400 hover:text-white"
                    title={parent.status === 'active' ? '停用账号' : '启用账号'}
                  >
                    <Lock className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteUser(parent.id)}
                    className="p-2 bg-space-800 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-500"
                    title="删除账号"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-space-900 border border-space-700 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-white mb-4">开通新指挥官</h3>
            <form onSubmit={handleCreateParent} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">家长姓名</label>
                <input name="name" required className="w-full bg-space-950 border border-space-700 rounded-lg p-3 text-white" placeholder="例如：张爸爸" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">登录账号</label>
                <input name="username" required className="w-full bg-space-950 border border-space-700 rounded-lg p-3 text-white" placeholder="例如：zhang_father" />
              </div>
              <button className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl">确认开通</button>
              <button type="button" onClick={() => setShowAddModal(false)} className="w-full text-slate-500 py-2">取消</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
