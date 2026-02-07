# 北极星 (North Star) 少年成长领航系统 - 高保真原型

## 项目简介
这是一个基于 React + Tailwind CSS + Framer Motion 构建的高保真 Web 原型，旨在帮助路则昊同学（初一）通过游戏化的方式管理寒假作业和提升学业。

## 核心功能
1.  **战况室 (Dashboard)**: 可视化能力雷达图，实时反馈学习进度。
2.  **任务规划局 (Mission Control)**: 看板式任务管理，拖拽规划（模拟）。
3.  **鹰眼监督 (Eagle Eye)**: 专注计时器 + 随机幽灵验证（防挂机）。
4.  **补给站 (Marketplace)**: 积分兑换奖励系统。

## 技术栈
- **Framework**: React 18
- **Styling**: Tailwind CSS (Space Theme)
- **Animation**: Framer Motion
- **Charts**: Recharts
- **State Management**: Zustand
- **Icons**: Lucide React

## 快速开始

1.  安装依赖：
    ```bash
    npm install
    ```

2.  启动开发服务器：
    ```bash
    npm run dev
    ```

3.  构建生产版本：
    ```bash
    npm run build
    ```

## 交互说明
- **导航**: 点击左侧侧边栏切换模块。
- **任务**: 在"任务规划局"点击任务上的播放/完成按钮流转状态。
- **专注**: 在"鹰眼监督"点击播放开始计时，随机触发"幽灵验证"弹窗。
- **商城**: 点击商品卡片进行购买（需积分足够）。
