# Google Login 500 Error Fix

## 问题原因

后端返回 500 错误是因为 `GOOGLE_CLIENT_ID` 环境变量未在 Vercel 上配置。

## 解决步骤

### 1. 在 Vercel Dashboard 设置环境变量

登录 Vercel → 选择 `bazi-backend-one` 项目 → Settings → Environment Variables

添加以下变量：

```
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
OPENCLAW_BASE_URL=https://api.openclaw.ai/v1
OPENCLAW_API_KEY=your-openclaw-api-key
```

### 2. 重新部署后端

设置环境变量后，需要重新部署：

```bash
# 在 bazi-backend 目录下
vercel --prod
```

或者在 Vercel Dashboard 点击 "Redeploy"

### 3. 验证修复

访问健康检查端点：
```
https://bazi-backend-one.vercel.app/api/health
```

应该返回：
```json
{
  "ok": true,
  "config": {
    "googleClientIdConfigured": true,
    "jwtSecretConfigured": true
  }
}
```

### 4. 前端 CORS 配置

确保前端域名已添加到后端的 `allowedOrigins` 列表中。

当前已配置的域名：
- `http://localhost:5173`
- `https://bazi-frontend-gray.vercel.app`
- `https://bazi-frontend-itmuyfxq8-aidevelopers-projects-a5652f1e.vercel.app`

如果前端部署到新域名，需要在 `api/index.js` 中添加。

## 本地测试

创建 `.env` 文件在 `bazi-backend` 目录：

```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
JWT_SECRET=your-local-dev-secret-key
OPENCLAW_BASE_URL=https://api.openclaw.ai/v1
OPENCLAW_API_KEY=your-openclaw-api-key
```

然后运行：
```bash
npm run dev
```

## 注意事项

1. **GOOGLE_CLIENT_ID** 必须与你前端使用的 Client ID 一致
2. **JWT_SECRET** 在生产环境应该至少 32 个字符
3. 环境变量更改后必须重新部署才能生效
