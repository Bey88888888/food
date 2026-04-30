# Bestie Food Lottery Site｜闺蜜饭店抽签地图

这是一个私人使用的「今天吃哪家饭店」网站初版。

## 已包含功能

- 邮箱入口：不要求真实姓名
- 当前设备自动保存数据
- 手动录入饭店
- 饭店列表与搜索筛选
- 地图点位展示
- 点击查看饭店名称、图片、地址、电话、人均、标签、大众点评链接
- 抽签决定今天吃哪家
- 隐私说明
- 高德地图 Key 预留
- Supabase 数据库结构预留

## 重要说明

本项目不会抓取大众点评数据。  
你可以手动录入大众点评链接，点击后跳转查看详情。  
饭店图片建议使用你自己拍摄的图片或已授权图片。

## 本地运行步骤

```bash
npm install
npm run dev
```

打开：

```bash
http://localhost:3000
```

## 上传到 GitHub

1. 打开 https://github.com/
2. 点击右上角 `+`
3. 选择 `New repository`
4. Repository name 可以填写：`bestie-food-lottery-site`
5. 选择 Public 或 Private
6. 创建仓库
7. 把本项目文件上传进去

如果你会用命令行，也可以：

```bash
git init
git add .
git commit -m "Initial food lottery site"
git branch -M main
git remote add origin 你的GitHub仓库地址
git push -u origin main
```

## 部署到 Vercel

1. 打开 https://vercel.com/
2. 使用 GitHub 登录
3. Import 这个 GitHub 仓库
4. Framework 选择 Next.js
5. 点击 Deploy

## 高德地图设置

如果你想使用真实地图：

1. 注册高德开放平台账号
2. 创建 Web 端应用
3. 获取 Web JS API Key
4. 在 Vercel 环境变量中添加：

```bash
NEXT_PUBLIC_AMAP_KEY=你的Key
```

如果没有 Key，网站会自动显示一个精美的模拟地图。

## 后续可升级功能

- Supabase 邮箱注册登录
- 多人饭搭子小组
- 每个人独立收藏和共享收藏
- 抽签历史记录
- 饭店投票
- 排除最近吃过的饭店
- 手机端 PWA 桌面图标
