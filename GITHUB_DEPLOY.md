# GitHub Pages部署指南

## 步骤1：在GitHub创建仓库

1. 访问 https://github.com/new
2. 仓库名称：`peach-blossom-fortune`
3. 公开（Public）
4. **不要**勾选 "Add a README file"
5. 点击 "Create repository"

## 步骤2：推送代码到GitHub

打开终端或Git Bash，运行：

```bash
cd D:\claude-workspace\peach-blossom-fortune

# 设置远程仓库
git remote add origin https://github.com/chenjianancode/peach-blossom-fortune.git

# 推送代码
git push -u origin master
```

## 步骤3：启用GitHub Pages

1. 在GitHub仓库页面，点击「Settings」
2. 左侧菜单选择「Pages」
3. 在「Source」下拉框：
   - 选择「Deploy from a branch」
   - 分支：`master`
   - 目录：`/ (root)`
4. 点击「Save」
5. 等待1-2分钟

## 步骤4：访问网站

启用后，访问：
```
https://chenjianancode.github.io/peach-blossom-fortune/
```

---

## 测试网站

1. 打开网站
2. 上传照片
3. 回答3个问题
4. 点击「开始AI分析」
5. 查看桃花运报告
6. 点击「分享我的结果」生成分享卡片

## 后端API地址

已配置的Worker地址：
```
https://peach-blossom-fortune.peach-blossom-fortune.workers.dev
```

前端会自动调用这个API。

## 如果需要重新配置API地址

编辑 `frontend/api-config.js`：
```javascript
export const API_BASE_URL = 'https://peach-blossom-fortune.peach-blossom-fortune.workers.dev';
```

然后重新推送：
```bash
git add frontend/api-config.js
git commit -m "Update API URL"
git push
```

---

## 常见问题

### 网站打开但无法分析
- 检查浏览器控制台是否有错误
- 确认Worker地址正确
- 检查Cloudflare Worker是否正常运行

### GitHub Pages未生效
- 等待1-2分钟让GitHub构建完成
- 检查Settings → Pages配置是否正确
- 刷新页面或清除浏览器缓存

### 想要自定义子域名
在GitHub Pages设置中可以配置自定义域名。

---

部署完成后，你的AI恋爱桃花运测评网站就可以访问了！🎉
