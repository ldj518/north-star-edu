# 🎯 启用真实 AI 批改功能 - 完整指南

## 📊 当前状态

**您现在看到的是演示模式**，因为：
- ❌ Cloudflare Pages 环境变量中未配置 `GLM_API_KEY`
- ✅ 系统自动降级到演示模式，保证功能可用
- ✅ 界面会显示"演示模式"黄色提示框

---

## 🚀 启用真实 AI 的步骤

### 步骤 1：获取 GLM-4.7 API Key

1. **访问智谱 AI 官网**
   - https://open.bigmodel.cn/
   - 注册/登录账号

2. **创建 API Key**
   - 进入"API Keys"页面
   - 点击"创建新的 API Key"
   - 复制保存（格式：`sk-xxxxxxxxxxxxxxxxxx`）

3. **查看余额**
   - 新用户有免费额度
   - 足够测试使用

### 步骤 2：配置到 Cloudflare Pages

**方式 A：通过 Cloudflare Dashboard**

1. 登录 https://dash.cloudflare.com/
2. 进入：`Workers & Pages` → `north-star-edu`
3. 点击：`Settings` → `Environment variables`
4. 点击：`Add variable`
5. 填写：
   ```
   Variable name: GLM_API_KEY
   Value: sk-你的实际API密钥
   Environment: ✅ Production + ✅ Preview
   ```
6. 点击 `Save`

**方式 B：通过 Wrangler CLI**

```bash
# 安装 wrangler（如果未安装）
npm install -g wrangler

# 登录
wrangler login

# 添加环境变量
wrangler pages secret put GLM_API_KEY --project-name=north-star-edu
# 粘贴你的 API Key
```

### 步骤 3：重新部署

**自动触发（推荐）：**
- 保存环境变量后，Cloudflare 会自动重新部署
- 等待 2-3 分钟

**手动触发：**
1. 进入 Cloudflare Pages → north-star-edu
2. 点击 `View builds`
3. 点击 `Retry deployment`

### 步骤 4：验证

1. 访问 https://north-star-edu.pages.dev
2. 打开浏览器控制台（F12）
3. 进入专注模式 → 上传图片
4. 查看控制台日志：
   ```
   🔍 开始分析图片...
   🤖 尝试调用真实 AI API...
   📡 API响应状态: 200
   ✅ API返回成功
   📊 分析结果: {...}
   ```

5. 查看界面：
   - ❌ 不显示黄色"演示模式"提示框
   - ✅ 批改结果是基于真实 AI 分析

---

## 📸 摄像头功能说明

### 为什么摄像头黑屏？

**浏览器安全策略：**
- 🔒 只允许 HTTPS 网站访问摄像头
- 🌐 Cloudflare Pages 已是 HTTPS，符合要求
- 📱 但需要用户授权

### 如何启用摄像头？

1. **检查浏览器权限**
   - Chrome: 地址栏左侧 🔒 图标 → 网站设置 → 摄像头 → 允许
   - Safari: 偏好设置 → 网站 → 摄像头
   - Firefox: 地址栏左侧 🔒 图标 → 权限 → 使用摄像头 → 允许

2. **刷新页面**
   - 授权后刷新页面
   - 再次点击"拍照上传"
   - 应该能看到摄像头画面

3. **如果仍然黑屏**
   - 使用"本地上传"功能（更稳定）
   - 检查设备是否有摄像头硬件
   - 关闭其他占用摄像头的应用

### 移动端特别说明

**iOS (iPhone/iPad):**
- 需要在 Safari 中使用（Chrome 不支持摄像头 API）
- 确保 Safari 允许访问摄像头
- 首次使用会弹出权限请求

**Android:**
- Chrome 浏览器支持
- 会弹出权限请求对话框
- 允许后即可使用

---

## 🎯 本地开发（快速测试）

如果想快速测试真实 AI 功能，可以使用本地开发环境：

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

### 4. 访问测试
```
http://localhost:5173
```

### 本地开发优势
✅ 真实 API 调用
✅ 实时查看修改
✅ 详细控制台日志
✅ 无需部署

---

## 💡 常见问题

### Q1: 配置后还是显示演示模式？
**A:** 检查：
1. 环境变量名称是否正确：`GLM_API_KEY`（大写）
2. 是否选择了正确的环境（Production + Preview）
3. 是否重新部署了应用

### Q2: API 调用失败怎么办？
**A:** 检查：
1. API Key 是否正确（sk-开头）
2. API Key 是否有余额
3. 控制台错误信息

### Q3: 摄像头一直黑屏？
**A:** 建议：
1. 优先使用"本上传"功能
2. 检查浏览器权限设置
3. 尝试其他浏览器（Chrome 推荐）

### Q4: 免费额度够用吗？
**A:** GLM-4.7 新用户免费额度：
- 足够测试和轻度使用
- 按实际调用计费
- 可以设置使用上限

---

## 📞 技术支持

如遇到问题：
1. 查看浏览器控制台（F12）错误信息
2. 检查 Cloudflare Pages 部署日志
3. 查看 `/api/health` 接口返回的 `apiConfigured` 字段

---

**配置完成后，您的教育系统将拥有真正的 AI 批改能力！** 🎉
