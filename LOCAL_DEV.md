# 本地开发环境搭建指南

## 快速开始

### 1. 安装依赖
```bash
cd /root/.openclaw/workspace-edu-dev/projects/north-star-edu
npm install
```

### 2. 配置 API Key
创建 `.env` 文件：
```bash
GLM_API_KEY=sk-你的实际API密钥
```

### 3. 启动开发服务器
```bash
npm run dev
```

### 4. 访问
```
http://localhost:5173
```

## 本地开发优势

✅ 真实 API 调用
✅ 实时查看修改
✅ 控制台调试
✅ 无需部署

## 测试流程

1. 打开 http://localhost:5173
2. 进入专注模式
3. 上传图片
4. 查看浏览器控制台（F12）
5. 看到 "✅ API返回成功" = 真实 AI

## API 获取

GLM-4.7: https://open.bigmodel.cn/
- 新用户有免费额度
- 按调用次数计费
- 支持图片识别
