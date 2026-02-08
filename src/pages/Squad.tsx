import { Users, Trophy, Swords, Shield, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

const leaderboard = [
  { id: 1, name: 'CyberWolf', score: 15400, rank: 1, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wolf' },
  { id: 2, name: 'StarChaser', score: 14200, rank: 2, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Star' },
  { id: 3, name: '路则昊', score: 1250, rank: 35, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', isMe: true },
  { id: 4, name: 'MathWizard', score: 1100, rank: 36, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Math' },
];

const friends = [
  { id: 1, name: '王小明', status: 'online', activity: '正在挑战: 英语单词 PK' },
  { id: 2, name: '张伟', status: 'offline', activity: '上次在线: 2小时前' },
];

export function Squad() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-neon-blue" />
            僚机中队 Squadron
          </h2>
          <p className="text-slate-400">并不是孤军奋战。寻找你的盟友与对手。</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Leaderboard */}
        <div className="lg:col-span-2 bg-space-900/50 backdrop-blur-sm rounded-2xl border border-space-800 p-6">
           <h3 className="font-bold text-white mb-6 flex items-center gap-2">
             <Trophy className="w-5 h-5 text-neon-yellow" /> 全服战力榜 (Global Ranking)
           </h3>
           
           <div className="space-y-4">
             {/* Top 3 Podium (Simplified list for now) */}
             {leaderboard.slice(0, 2).map((user) => (
               <div key={user.id} className="flex items-center gap-4 p-4 bg-space-800/30 rounded-xl border border-neon-yellow/10">
                 <div className="font-bold text-2xl w-8 text-center text-neon-yellow">#{user.rank}</div>
                 <img src={user.avatar} className="w-12 h-12 rounded-full border-2 border-neon-yellow" alt={user.name} />
                 <div className="flex-1">
                   <div className="font-bold text-white">{user.name}</div>
                   <div className="text-xs text-neon-yellow">王者领航员</div>
                 </div>
                 <div className="font-mono font-bold text-xl text-white">{user.score.toLocaleString()}</div>
               </div>
             ))}
             
             {/* Divider */}
             <div className="text-center text-slate-500 text-xs py-2">...</div>
             
             {/* Me */}
             <div className="flex items-center gap-4 p-4 bg-neon-blue/10 rounded-xl border border-neon-blue/30 scale-105 shadow-lg">
                 <div className="font-bold text-2xl w-8 text-center text-neon-blue">#35</div>
                 <img src={leaderboard[2].avatar} className="w-12 h-12 rounded-full border-2 border-neon-blue" alt="Me" />
                 <div className="flex-1">
                   <div className="font-bold text-white flex items-center gap-2">
                     路则昊 <span className="text-[10px] bg-neon-blue px-1.5 rounded text-white">YOU</span>
                   </div>
                   <div className="text-xs text-neon-blue">白银领航员</div>
                 </div>
                 <div className="font-mono font-bold text-xl text-white">1,250</div>
             </div>
             
             {/* Below Me */}
             <div className="flex items-center gap-4 p-4 bg-space-800/30 rounded-xl border border-space-800 opacity-60">
                 <div className="font-bold text-2xl w-8 text-center text-slate-500">#36</div>
                 <img src={leaderboard[3].avatar} className="w-12 h-12 rounded-full border-2 border-slate-700" alt="Other" />
                 <div className="flex-1">
                   <div className="font-bold text-slate-300">{leaderboard[3].name}</div>
                 </div>
                 <div className="font-mono font-bold text-xl text-slate-500">1,100</div>
             </div>
           </div>
        </div>

        {/* Right: Arena & Friends */}
        <div className="space-y-6">
          {/* Arena Card */}
          <div className="bg-gradient-to-br from-purple-900/50 to-space-900 rounded-2xl p-6 border border-purple-500/30 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Swords className="w-32 h-32 text-purple-500" />
             </div>
             <h3 className="font-bold text-white mb-2 flex items-center gap-2">
               <Swords className="w-5 h-5 text-purple-400" /> 竞技场 Arena
             </h3>
             <p className="text-sm text-purple-200 mb-6">发起 1V1 挑战，赢取对手的星币！</p>
             
             <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
               <Zap className="w-4 h-4" /> 匹配对手 (Match)
             </button>
             <p className="text-center text-xs text-purple-300/50 mt-2">预计匹配时间: 5s</p>
          </div>

          {/* Friends List */}
          <div className="bg-space-900/50 backdrop-blur-sm rounded-2xl border border-space-800 p-6">
             <h3 className="font-bold text-white mb-4 flex items-center gap-2">
               <Shield className="w-5 h-5 text-green-400" /> 战友列表
             </h3>
             <div className="space-y-4">
               {friends.map(friend => (
                 <div key={friend.id} className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="relative">
                       <div className="w-10 h-10 bg-space-800 rounded-full" />
                       <div className={cn(
                         "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-space-900",
                         friend.status === 'online' ? "bg-green-500" : "bg-slate-500"
                       )} />
                     </div>
                     <div>
                       <div className="font-medium text-white">{friend.name}</div>
                       <div className="text-xs text-slate-500">{friend.activity}</div>
                     </div>
                   </div>
                   {friend.status === 'online' && (
                     <button className="px-3 py-1 bg-space-800 hover:bg-space-700 text-xs text-white rounded-lg border border-space-700">
                       PK
                     </button>
                   )}
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
