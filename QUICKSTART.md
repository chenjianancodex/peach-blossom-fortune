# 🚀 快速部署指南

## 你需要准备的3样东西

### 1. 火山引擎API Key 🔑
- 访问 https://console.volcengine.com/
- 注册/登录 → 访问管理 → API密钥 → 创建密钥
- 复制API密钥（格式：`xxxxxxxx-xxxx-xxx-xxxx-xxxxxxxx`）

### 2. GitHub账号 🐙
- 访问 https://github.com/
- 注册账号（如果没有）

### 3. Cloudflare账号 ☁️
- 访问 https://dash.cloudflare.com/sign-up
- 注册账号（如果没有）

---

## 部署步骤（5分钟完成）

### Step 1: 部署后端到Cloudflare（2分钟）

打开终端，运行：
```bash
# 安装Wrangler CLI
npm install -g wrangler

# 进入后端目录
cd backend

# 登录Cloudflare（会自动打开浏览器授权）
wrangler login

# 部署Worker
wrangler deploy
```

**重要：配置API Key**
1. 打开 https://dash.cloudflare.com/
2. 进入 Workers & Pages → 选择你的Worker
3. 设置 → 变量和机密 → 添加变量
4. 名称：`VOLC_API_KEY`
5. 值：粘贴你的火山引擎API Key
6. 保存并重新部署

**记下Worker地址**（类似：`https://your-worker.workers.dev`）

### Step 2: 部署前端到GitHub Pages（2分钟）

```bash
# 回到项目根目录
cd ..

# 初始化Git（如果还没有）
git init
git add frontend/
git commit -m "Initial commit"
git branch -M main

# 推送到GitHub
git remote add origin https://github.com/<你的用户名>/peach-blossom-fortune.git
git push -u origin main
```

**启用GitHub Pages**：
1. 打开GitHub仓库 → Settings → Pages
2. Source选择：Deploy from a branch
3. 分支：main，目录：/ (root)
4. 点击Save

**记下Pages地址**（类似：`https://<用户名>.github.io/peach-blossom-fortune/`）

### Step 3: 配置API地址（1分钟）

编辑 `frontend/api-config.js`：
```javascript
export const API_BASE_URL = 'https://你的Worker地址';
```

保存并推送：
```bash
git add frontend/api-config.js
git commit -m "Configure API"
git push
```

### Step 4: 测试网站（30秒）

打开你的GitHub Pages地址，上传照片，回答问题，开始测试！🎉

---

## 有问题？

查看完整文档：[README.md](../README.md)

## 成本

- Cloudflare Workers：免费
- GitHub Pages：免费
- 火山引擎API：新用户免费额度，超出后约0.01元/次

**总成本：基本为0！**
