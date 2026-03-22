# ADS MANAGER BOT — SKILL.md

## 描述
多平台广告管理 Agent，支持 Meta Ads、Google Ads、TikTok Ads。
可查看数据、控制广告状态、生成文案、预算预警、定时报告。

---

## 支持平台

| 平台 | API 文档 |
|------|---------|
| Meta (Facebook/Instagram) | https://developers.facebook.com/docs/marketing-apis |
| Google Ads | https://developers.google.com/google-ads/api/docs/start |
| TikTok Ads | https://ads.tiktok.com/marketing_api/docs |

---

## 功能模块

### 1. 数据查看 (Report)
- 查询花费、展示、点击、CTR、CPC、CPM、转化、ROAS
- 支持日期范围筛选（今天 / 昨天 / 最近7天 / 最近30天 / 自定义）
- 支持按广告账户 / 广告系列 / 广告组 / 单条广告维度查询

### 2. 广告控制 (Control)
- 启动 / 暂停 / 删除广告（系列 / 组 / 单条）
- 修改预算（日预算 / 总预算）
- 修改出价策略

### 3. 广告创建 (Create)
- 基于模板创建广告系列
- AI 自动生成广告文案（标题 + 描述 + CTA）
- 图片/视频素材管理

### 4. 预算预警 (Alert)
- 花费超过阈值时自动通知
- CTR / CPC 异常预警
- 广告账户余额不足预警

### 5. 定时报告 (Scheduled Report)
- 每日/每周自动汇总报告
- 推送至 Telegram / 邮件

---

## 配置文件

见 `config.json`（不要提交到公开仓库！）

```json
{
  "meta": {
    "app_id": "",
    "app_secret": "",
    "access_token": "",
    "ad_account_id": ""
  },
  "google": {
    "client_id": "",
    "client_secret": "",
    "refresh_token": "",
    "developer_token": "",
    "customer_id": ""
  },
  "tiktok": {
    "app_id": "",
    "secret": "",
    "access_token": "",
    "advertiser_id": ""
  },
  "alerts": {
    "spend_threshold_usd": 100,
    "cpc_threshold_usd": 5,
    "ctr_min_percent": 0.5,
    "notify_channel": "telegram"
  },
  "report": {
    "schedule": "daily",
    "time": "09:00",
    "timezone": "Asia/Manila",
    "notify_channel": "telegram"
  }
}
```

---

## 使用指令（对话示例）

```
# 查看数据
查 Meta 今天的广告花费
Google Ads 最近7天 ROAS 是多少
TikTok 昨天各广告组表现

# 控制广告
暂停 Meta 广告系列 [名称/ID]
把 Google 广告组 [名称] 预算改成 $50/天
启动 TikTok 广告 [ID]

# 创建广告
帮我写一条 Meta 广告文案，产品是 [产品名]，目标是 [目标受众]

# 报告
发我今天的广告总结报告
设置每天早上9点自动推送报告
```

---

## 快速上手步骤

### Step 1 — Meta Ads API
1. 前往 https://developers.facebook.com/apps/ 创建应用
2. 添加「营销 API」权限
3. 生成 Long-lived Access Token
4. 获取广告账户 ID（格式：act_xxxxxxxx）

### Step 2 — Google Ads API
1. 前往 https://ads.google.com/nav/selectaccount 获取 Customer ID
2. 申请 Developer Token：https://developers.google.com/google-ads/api/docs/first-call/dev-token
3. 设置 OAuth2 凭证（Client ID + Secret）
4. 通过 OAuth 获取 Refresh Token

### Step 3 — TikTok Ads API
1. 前往 https://ads.tiktok.com/marketing_api/apps/ 创建应用
2. 获取 App ID + Secret
3. 通过 OAuth 获取 Access Token
4. 记录 Advertiser ID

### Step 4 — 填写配置
编辑 `skills/ads-manager/config.json`，填入所有凭证。

### Step 5 — 完成！
告诉我 "ADS MANAGER 初始化" 即可启动。

---

## 注意事项
- config.json 已加入 .gitignore，不会被提交
- Access Token 有效期不同，Meta 需要定期刷新（或使用 System User Token）
- Google Ads 需要有 MCC 账户或直接客户账户访问权限
- TikTok API 需要通过审核才能访问完整功能
