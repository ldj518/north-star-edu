import { create } from 'zustand';

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type UserRole = 'admin' | 'parent' | 'student';

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  avatar: string;
  parentId?: string; // For students linking to parent
  status: 'active' | 'suspended';
  lastLogin?: string;
}

export interface Task {
  id: string;
  title: string;
  subject: 'Math' | 'English' | 'Physics' | 'Biology' | 'Politics' | 'History' | 'Geo' | 'Self';
  duration: number; // minutes
  reward: number;
  status: TaskStatus;
  date: string; // YYYY-MM-DD
  isCustom?: boolean; // Created by student
  createdBy?: string;
}

export interface SubjectStat {
  subject: string;
  score: number; // 0-100
  fullMark: number;
}

interface GameState {
  // Auth
  users: User[];
  currentUser: User | null;
  login: (username: string, role?: UserRole) => boolean; // Updated signature
  logout: () => void;
  
  // User Management
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Economy & Tasks
  coins: number;
  addCoins: (amount: number) => void;
  removeCoins: (amount: number) => void;
  
  tasks: Task[];
  addTask: (task: Task) => void;
  moveTask: (taskId: string, status: TaskStatus) => void;
  
  stats: SubjectStat[];
  
  activeTaskId: string | null; 
  setActiveTask: (id: string | null) => void;
  
  isFocusing: boolean;
  setFocusing: (focus: boolean) => void;
}

// Initial Mock Data
const initialUsers: User[] = [
  { id: 'admin', username: 'admin', name: '系统管理员', role: 'admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', status: 'active' },
  { id: 'p1', username: 'parent', name: '指挥官 (家长)', role: 'parent', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Commander', status: 'active' },
  { id: 's1', username: 'student', name: '路则昊', role: 'student', parentId: 'p1', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', status: 'active' },
];

export const useStore = create<GameState>((set, get) => ({
  users: initialUsers,
  currentUser: null,
  
  // Simplified Login Logic
  login: (username, role) => {
    const user = get().users.find(u => u.username === username || (role && u.role === role)); // Support old simplified login
    if (user && user.status === 'active') {
      set({ currentUser: user });
      return true;
    }
    return false;
  },
  logout: () => set({ currentUser: null }),

  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  updateUser: (id, updates) => set((state) => ({
    users: state.users.map(u => u.id === id ? { ...u, ...updates } : u)
  })),
  deleteUser: (id) => set((state) => ({
    users: state.users.filter(u => u.id !== id)
  })),

  coins: 1250,
  addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
  removeCoins: (amount) => set((state) => ({ coins: Math.max(0, state.coins - amount) })),

  tasks: [
    { id: '1', title: '英语单词Unit 1抄写', subject: 'English', duration: 30, reward: 50, status: 'todo', date: '2026-02-06' },
    { id: '2', title: '生物寒假作业 P10-15', subject: 'Biology', duration: 45, reward: 60, status: 'done', date: '2026-02-06' },
    { id: '3', title: '数学几何题专项训练', subject: 'Math', duration: 60, reward: 80, status: 'todo', date: '2026-02-06' },
    { id: '4', title: '政治：背诵核心价值观', subject: 'Politics', duration: 20, reward: 40, status: 'in-progress', date: '2026-02-06' },
    { id: '5', title: '地理：绘制地形图', subject: 'Geo', duration: 40, reward: 50, status: 'todo', date: '2026-02-07' },
  ],
  
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  
  moveTask: (taskId, status) => set((state) => ({
    tasks: state.tasks.map(t => t.id === taskId ? { ...t, status } : t)
  })),

  stats: [
    { subject: '生物', score: 83, fullMark: 100 },
    { subject: '数学', score: 80, fullMark: 100 },
    { subject: '英语', score: 40, fullMark: 100 },
    { subject: '政治', score: 48, fullMark: 100 },
    { subject: '地理', score: 75, fullMark: 100 },
    { subject: '历史', score: 70, fullMark: 100 },
  ],

  activeTaskId: null,
  setActiveTask: (id) => set({ activeTaskId: id }),

  isFocusing: false,
  setFocusing: (focus) => set({ isFocusing: focus }),
}));
