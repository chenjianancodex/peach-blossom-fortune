# 💫 AI恋爱桃花运测评网站

一个有趣的AI测评网站，用户上传照片并回答趣味问题，AI分析生成个性化的桃花运报告，支持分享和重复测试。

## ✨ 功能特点

- 📸 **照片上传**：支持拖拽和点击上传，实时预览
- ❓ **趣味问答**：3个轻松有趣的问题
- 🤖 **AI分析**：使用火山引擎豆包视觉模型，生成个性化报告
- 📊 **精美报告**：桃花运指数、桃花时间、理想伴侣特征
- 📤 **分享功能**：生成精美分享卡片，支持下载和复制链接
- 🔄 **重复测试**：想再测一次？轻松搞定

## 🛠 技术栈

- **前端**：纯 HTML + CSS + JavaScript（无需构建工具）
- **后端**：Cloudflare Workers（Serverless，免费部署）
- **AI模型**：火山引擎豆包视觉模型（doubao-1-5-vision）
- **部署**：前端 → GitHub Pages，后端 → Cloudflare Workers

## 📁 项目结构

```
peach-blossom-fortune/
├── frontend/              # 前端代码
│   ├── index.html         # 主页面
│   ├── styles.css         # 样式文件
│   ├── app.js             # 前端逻辑
│   ├── api-config.js      # API配置（部署后需修改）
│   └── assets/
│       └── images/        # 图片资源
└── backend/               # 后端代码
    ├── worker.js          # Cloudflare Worker
    ├── wrangler.toml      # Worker配置
    └── .env.example       # 环境变量示例
```

## 🚀 部署指南

### 第1步：注册账号和获取API Key

#### 1.1 注册火山引擎账号
1. 访问 [火山引擎控制台](https://console.volcengine.com/)
2. 注册/登录账号
3. 进入「访问管理」→「API密钥」
4. 创建新的API密钥
5. **复制API密钥**（格式：`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`）

#### 1.2 注册GitHub账号
1. 访问 [GitHub](https://github.com/)
2. 注册账号（如果还没有）

#### 1.3 注册Cloudflare账号
1. 访问 [Cloudflare](https://dash.cloudflare.com/sign-up)
2. 注册账号（如果还没有）

### 第2步：部署后端到Cloudflare Workers

#### 2.1 安装Wrangler CLI
```bash
npm install -g wrangler
```

#### 2.2 登录Cloudflare
```bash
cd backend
wrangler login
```
会打开浏览器进行授权登录。

#### 2.3 部署Worker
```bash
wrangler deploy
```
首次部署时，Wrangler会引导你创建Worker。

#### 2.4 配置API Key
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入「Workers & Pages」→ 选择你的Worker
3. 点击「设置」→「变量和机密」
4. 添加变量：
   - 名称：`VOLC_API_KEY`
   - 值：粘贴你的火山引擎API Key
5. 点击「保存」并重新部署

#### 2.5 获取Worker URL
部署完成后，你会看到一个Worker URL，格式如：
```
https://your-worker-name.<subdomain>.workers.dev
```
**记录这个URL**，下一步需要用到。

### 第3步：部署前端到GitHub Pages

#### 3.1 创建GitHub仓库
1. 访问 [GitHub](https://github.com/new)
2. 创建新仓库，命名为 `peach-blossom-fortune`（或你喜欢的名字）
3. **不要**勾选 "Add a README file"
4. 保持公开（Public）

#### 3.2 推送代码
```bash
cd ..
git init
git add frontend/
git commit -m "Initial commit: AI恋爱桃花运测评网站"
git branch -M main
git remote add origin https://github.com/<你的用户名>/peach-blossom-fortune.git
git push -u origin main
```

#### 3.3 启用GitHub Pages
1. 在GitHub仓库页面，点击「Settings」
2. 左侧菜单选择「Pages」
3. 在「Source」下拉框选择「Deploy from a branch」
4. 选择分支：`main`，目录：`/ (root)`
5. 点击「Save」
6. 等待1-2分钟，GitHub会自动生成网站URL

#### 3.4 获取Pages URL
启用后，你会看到网站地址，格式如：
```
https://<你的用户名>.github.io/peach-blossom-fortune/
```

### 第4步：配置前端API地址

1. 打开 `frontend/api-config.js`
2. 修改 `API_BASE_URL`：
   ```javascript
   export const API_BASE_URL = 'https://your-worker-name.<subdomain>.workers.dev';
   ```
3. 保存文件
4. 提交并推送到GitHub：
   ```bash
   git add frontend/api-config.js
   git commit -m "Configure API endpoint"
   git push
   ```

### 第5步：测试网站

1. 访问你的GitHub Pages网站
2. 上传一张清晰的正面照片
3. 回答3个问题
4. 点击「开始AI分析」
5. 查看你的桃花运报告
6. 点击「分享我的结果」生成分享卡片
7. 下载或复制链接分享给朋友

## 🎨 设计说明

### 测评流程
1. **上传照片**：用户上传正面照片
2. **回答3个趣味问题**：
   - Q1: 你理想中的约会场景？
   - Q2: 你最在意伴侣的哪个特质？
   - Q3: 你的周末通常怎么过？
3. **AI分析**：结合照片和答案，生成个性化报告

### 报告内容
- **桃花运指数**：0-100分
- **桃花盛开时间**：如"3月-5月"
- **理想伴侣特征**：3个关键词
- **爱情优势**：1段温暖的赞美
- **小建议**：1条实用建议

### 分享卡片
- 精美的渐变背景（粉色系）
- 桃花运指数（大数字）
- 桃花时间、理想伴侣
- 可下载PNG图片
- 可复制分享链接

## 🔧 开发与定制

### 修改测评问题
编辑 `frontend/index.html` 中的问答部分。

### 修改AI Prompt
编辑 `backend/worker.js` 中的 `analyzeFortune` 函数的 `prompt` 变量。

### 修改样式
编辑 `frontend/styles.css` 文件。

### 使用其他AI模型
如需更换AI模型，修改 `backend/worker.js` 中的：
- `model` 参数（当前：`doubao-1-5-vision-241128`）
- API URL（当前：`https://ark.cn-beijing.volces.com/api/v3/chat/completions`）

## 💰 成本估算

- **Cloudflare Workers**：免费额度足够（10万次请求/天）
- **GitHub Pages**：完全免费
- **火山引擎API**：新用户有免费额度，超出后按量计费（约0.01元/次调用）

## 📝 技术细节

### 后端API接口
**POST** `/api/analyze`

**请求体**：
```json
{
  "photo": "base64编码的图片数据",
  "answers": {
    "q1": "海滩漫步",
    "q2": "幽默感",
    "q3": "社交聚会"
  }
}
```

**响应体**：
```json
{
  "score": 85,
  "blossomTime": "3月-5月",
  "partnerTraits": ["温柔体贴", "幽默风趣", "有上进心"],
  "loveAdvantage": "你独特的气质...",
  "advice": "保持自信...",
  "scoreComment": "✨ 桃花运旺盛！"
}
```

## 🐛 常见问题

### 部署后网站显示"API请求失败"
- 检查 `frontend/api-config.js` 中的 `API_BASE_URL` 是否正确
- 检查Cloudflare Worker的 `VOLC_API_KEY` 是否配置
- 检查Worker是否正常运行

### AI分析时间较长
- 首次调用可能需要3-5秒，后续会更快
- 保持图片清晰，避免过大（建议小于2MB）

### 图片上传失败
- 检查图片格式（支持JPG、PNG、GIF）
- 检查图片大小（建议小于5MB）

## 📄 License

MIT License - 自由使用和修改

## 🙏 致谢

- AI模型：火山引擎豆包视觉模型
- 部署平台：Cloudflare Workers + GitHub Pages
