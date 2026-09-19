# 🌟 星星人的生日派对 — 生日祝福网站

一个温暖、治愈的生日祝福静态网站，专为「小星」打造。

## 🚀 本地运行

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:5173` 即可预览。

## 📦 构建

```bash
npm run build
```

构建产物在 `dist/` 目录，可直接部署。

## 🌐 部署

### Vercel（推荐）

```bash
npx vercel --prod
```

### Netlify

```bash
# 方式一：拖拽部署
# 把 dist 文件夹整个拖到 https://app.netlify.com/drop

# 方式二：命令行
npx netlify deploy --prod --dir=dist
```

## 🔒 密码门

- 入口问题：「输入高中班主任绰号：」
- 答案：`小夫`（不区分大小写和空格）
- 修改答案：编辑 `src/data/content.ts` 中的 `lockAnswer`

## 📝 自定义内容

### 修改文字

编辑 `src/data/content.ts`，修改后重新 `npm run build`：

| 字段 | 说明 |
|------|------|
| `friendName` | 朋友名字 |
| `yourName` | 你的名字 |
| `lockQuestion` | 密码门问题 |
| `lockAnswer` | 密码门答案 |
| `mainTitle` | 首页大标题 |
| `letter` | 祝福信内容 |
| `dayStory` | 初雪故事 |
| `finalMessage` | 最终页祝福 |
| `finalLine` | 最终页结语 |

### 替换照片

把所有照片放入 `public/images/` 对应子文件夹，保持文件名不变（修改 `content.ts` 中的路径可自定义文件名）：

| 文件夹 | 内容 | 文件命名 |
|--------|------|----------|
| `public/images/friend/` | 朋友大头照（1张） | `friend-main.jpg` |
| `public/images/backgrounds/` | 首页背景轮播图（3张） | `bg-1.jpg`, `bg-2.jpg`, `bg-3.jpg` |
| `public/images/couple/` | 你们的合照 | `couple-01.jpg` 起，按需增加 |
| `public/images/class/` | 班级合照 | `class-01.jpg` 起，按需增加 |
| `public/images/school/` | 学校风景 | `school-01.jpg` 起，按需增加 |
| `public/images/day/` | 初雪那天的照片 | `day-01.jpg` 起，按需增加 |

### 星星人图片

在 `public/images/star/` 放入以下图片（PNG 透明底优先）：

| 文件 | 用途 | 必须？ |
|------|------|--------|
| `star-main.png` | 首页主图、密码门、蛋糕装饰 | 推荐 |
| `star-sticker-01.png` | 祝福信贴纸 | 可选 |
| `star-frame.png` | 摄像头相框边框 | 可选 |

> ⚠️ 如果图片不存在，网站会自动用暖黄色圆形 + ⭐ 图标占位，不会报错或白屏。

### 背景音乐

将 `birthday.mp3` 放入 `public/music/` 文件夹。

## ⚠️ 重要提醒

1. **隐私安全**：公开部署的链接任何人拿到都能访问。如果照片涉及隐私，建议：
   - 确保密码足够私密
   - 或者不要在公开服务器部署
   - Vercel/Netlify 免费版链接是公开的

2. **版权提醒**：星星人形象版权属于泡泡玛特（POP MART），请仅用于个人欣赏，**不要商用或公开传播**。

3. **照片备**：部署前请确认所有照片已替换为你自己的照片，删除不需要的原始素材。

## 🛠 技术栈

- Vite + React 19 + TypeScript
- Tailwind CSS（样式）
- Framer Motion（动画）
- canvas-confetti（彩带）
- Lenis（平滑滚动）
- GSAP（动画引擎）
- lucide-react（图标）

## 📱 浏览器兼容

- Chrome / Safari / Edge / Firefox 最新版
- iOS Safari（含 100dvh 适配）
- Android Chrome
- 不支持 IE

## 📂 项目结构

```
src/
├── data/content.ts          # 内容配置（改这个！）
├── utils/transitions.ts     # 相册过渡效果池
├── hooks/
│   ├── useStarField.ts      # 星光粒子 Canvas
│   └── useSnowField.ts      # 雪花粒子 Canvas
├── components/
│   ├── StarField.tsx        # 全站背景星光
│   ├── AlbumCarousel.tsx    # 通用滑动相册
│   ├── MusicPlayer.tsx      # 音乐播放器
│   ├── StarDoubleClick.tsx  # 双击彩蛋
│   └── TouchTrail.tsx       # 触摸拖尾
├── pages/
│   ├── LockScreen.tsx       # 密码门
│   ├── Welcome.tsx          # 首页
│   ├── Memories.tsx         # 回忆相册
│   ├── Day.tsx              # 初雪那一天
│   ├── Letter.tsx           # 祝福信
│   ├── Cake.tsx             # 生日蛋糕
│   ├── Fireworks.tsx        # 烟花
│   ├── Camera.tsx           # 摄像头合影
│   └── Final.tsx            # 最终页
└── App.tsx                  # 路由
```