# Google Sign-In 问题排查指南

## 🌐 最新部署

**生产环境 URL**: https://bazi-frontend-gray.vercel.app

---

## 🔍 诊断步骤

### 1. 检查浏览器控制台

打开 https://bazi-frontend-gray.vercel.app，按 F12 打开开发者工具，切换到 **Console** 标签。

点击 **Login** 按钮后，你应该看到以下日志：

```
🔐 Google Sign-In Debug:
  - Client ID: 459190608405-argcs...
  - Current origin: https://bazi-frontend-gray.vercel.app
  - Hostname: bazi-frontend-gray.vercel.app
🔄 Initializing Google Sign-In...
✅ Google Sign-In initialized successfully
✅ Google Sign-In button rendered
```

### 2. 常见错误及解决方案

#### 错误: "The given client ID is not found"

**原因**: 
- Google Cloud Console 中的 OAuth 客户端未启用
- Client ID 配置错误
- 域名未授权

**解决方案**:

1. 访问 https://console.cloud.google.com/apis/credentials
2. 确认 OAuth 2.0 客户端已启用（绿色勾选标记）
3. 检查 **Authorized JavaScript origins** 包含:
   - `https://bazi-frontend-gray.vercel.app`
   - `http://localhost:5173`

#### 错误: "VITE_GOOGLE_CLIENT_ID not configured"

**原因**: 环境变量未正确设置

**解决方案**:
```bash
cd /Users/vitachums/.openclaw/workspace-webdesigner/Bazi-Project/bazi-frontend
npx vercel env ls
```

确认 `VITE_GOOGLE_CLIENT_ID` 已设置为生产环境。

#### 错误: "Invalid Client ID format"

**原因**: Client ID 格式不正确

**正确格式**: `xxxxxx-xxxxxxxxx.apps.googleusercontent.com`

---

## 🛠️ 快速修复清单

### 检查 1: Google Cloud Console 配置

1. 访问 https://console.cloud.google.com/apis/credentials
2. 找到你的 OAuth 2.0 客户端 ID
3. 点击编辑按钮
4. 确认 **Authorized JavaScript origins**:
   ```
   https://bazi-frontend-gray.vercel.app
   http://localhost:5173
   ```
5. 保存更改

### 检查 2: 确认 Client ID

当前的 Client ID:
```
459190608405-argcsqqnfsq8g6le54ntl6kagr8nc8re.apps.googleusercontent.com
```

与 Google Cloud Console 中的对比，确保完全一致。

### 检查 3: 重新部署

如果修改了 Google Cloud Console 配置，需要重新部署:
```bash
cd /Users/vitachums/.openclaw/workspace-webdesigner/Bazi-Project/bazi-frontend
npx vercel --prod
```

---

## 🆘 如果仍然无法工作

### 方案 A: 创建新的 OAuth 客户端

1. 访问 https://console.cloud.google.com/apis/credentials
2. 点击 **+ CREATE CREDENTIALS** → **OAuth client ID**
3. **Application type**: Web application
4. **Name**: Bazi Auth New
5. **Authorized JavaScript origins**:
   - `https://bazi-frontend-gray.vercel.app`
   - `http://localhost:5173`
6. 点击 **CREATE**
7. 复制新的 Client ID
8. 更新 Vercel 环境变量:
   ```bash
   echo "YOUR_NEW_CLIENT_ID" | npx vercel env add VITE_GOOGLE_CLIENT_ID production
   npx vercel --prod
   ```

### 方案 B: 使用备用登录方式

如果 Google Sign-In 持续失败，我们可以:
1. 添加邮箱/密码登录
2. 添加其他 OAuth 提供商 (GitHub, etc.)

---

## 📊 当前状态

| 检查项 | 状态 |
|--------|------|
| Vercel 部署 | ✅ 正常 |
| 环境变量配置 | ✅ 已设置 |
| 代码实现 | ✅ 已更新 (带错误处理) |
| Google Cloud Console | ❓ 需要验证 |
| 域名授权 | ❓ 需要验证 |

---

## 📝 测试步骤

1. 访问 https://bazi-frontend-gray.vercel.app
2. 打开浏览器控制台 (F12)
3. 点击 **Login** 按钮
4. 查看控制台输出
5. 如果看到错误，截图控制台内容
6. 告诉我错误信息
