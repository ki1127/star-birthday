// ==================== 内容配置文件 ====================
// 修改此文件即可更换所有文字和图片路径

// Helper: prepend Vite base path to all asset URLs
// In dev this is "/" — in production (GitHub Pages) it's "/star-birthday/"
const BASE = import.meta.env.BASE_URL;

function assetUrl(path: string): string {
  return `${BASE}${path.replace(/^\//, '')}`;
}

export const content = {
  // --- 朋友信息 ---
  friendName: '薛小星',
  yourName: '吴佳乐',

  // --- 生日 ---
  birthdayDate: '9月25日',

  // --- 密码门 ---
  lockQuestion: '班主任的绰号你还记得吗？：',
  lockAnswer: '小夫',
  lockHint: '再想想～',

  // --- 首页 ---
  mainTitle: '生日快乐！',
  subTitle: '今天你是主角 🎂',
  friendPhoto: assetUrl('/images/friend/friend-main.jpg'), // 大头照

  // --- 祝福信 ---
  letter: `亲爱的薛小星：

生日快乐呀！🎂

月亮最圆的那天，也是你来到这个世界的那天。

回想起高中生活，和你一起的时光占据了好大一部分。

每一次考试不如意后的倾诉，每一个走廊里的八卦时刻，每一本互相推荐的好书，还有你给我带的你妈妈做的好吃的

都给我的高中生活带来了深深的慰藉...

这已经是你在大学的第二个生日了，我很幸运能继续给你祝福。

希望新的一岁，你能继续做那个闪闪发光的自己。

愿你的理想能一步步实现，愿你能不断挖掘生活的可爱之处...

生日快乐，我的好朋友！✨`,

  // --- 初雪 ---
  dayTitle: '初雪那一天',
  daySubtitle: '第一场雪，我们一直在一起',
  dayStory: `那是近年来最大的一次雪了

现在想来已经是那么久远的事情了，却仿佛就在昨日。

雪花一片一片地从天而降，整个校园洋溢着青春的喜悦和好奇。

我给你拍了好多照片，说有生命力的照片才最美丽。

但是可惜的是当时的我对于拍照总是不太自信，没有和你留下一张合照...

但是那年初雪，今年生日，我们的心都还在彼此身边。这大概就是最好的事情了。`,

  // --- 最终页 ---
  finalMessage: 'Happy Birthday ',
  finalLine: '但愿人长久，千里共婵娟',
  finalQuote: "Stars can't shine without darkness.",

  // --- 合照（couple 文件夹）---
  couplePhotos: [
    { src: assetUrl('/images/couple/couple-01.jpg'), caption: '' },
    { src: assetUrl('/images/couple/couple-02.jpg'), caption: '' },
    { src: assetUrl('/images/couple/couple-03.jpg'), caption: '' },
    { src: assetUrl('/images/couple/couple-04.jpg'), caption: '' },
    { src: assetUrl('/images/couple/couple-05.jpg'), caption: '' },
  ],

  // --- 班级照片（class 文件夹）---
  classPhotos: [
    { src: assetUrl('/images/class/class-01.jpg'), caption: '' },
    { src: assetUrl('/images/class/class-02.jpg'), caption: '' },
    { src: assetUrl('/images/class/class-03.jpg'), caption: '' },
    { src: assetUrl('/images/class/class-04.jpg'), caption: '' },
  ],

  // --- 学校照片（school 文件夹）---
  schoolPhotos: [
    { src: assetUrl('/images/school/school-01.jpg'), caption: '' },
    { src: assetUrl('/images/school/school-02.jpg'), caption: '' },
    { src: assetUrl('/images/school/school-03.jpg'), caption: '' },
    { src: assetUrl('/images/school/school-04.jpg'), caption: '' },
    { src: assetUrl('/images/school/school-05.jpg'), caption: '' },
  ],

  // --- 初雪照片（day 文件夹）---
  dayPhotos: [
    { src: assetUrl('/images/day/day-01.jpg'), caption: '' },
    { src: assetUrl('/images/day/day-02.jpg'), caption: '' },
    { src: assetUrl('/images/day/day-03.jpg'), caption: '' },
    { src: assetUrl('/images/day/day-04.jpg'), caption: '' },
    { src: assetUrl('/images/day/day-05.jpg'), caption: '' },
    { src: assetUrl('/images/day/day-06.jpg'), caption: '' },
    { src: assetUrl('/images/day/day-07.jpg'), caption: '' },
    { src: assetUrl('/images/day/day-08.jpg'), caption: '' },
    { src: assetUrl('/images/day/day-09.jpg'), caption: '' },
  ],

  // --- 背景图 ---
  backgrounds: [
    assetUrl('/images/backgrounds/bg-1.jpg'),
    assetUrl('/images/backgrounds/bg-2.jpg'),
    assetUrl('/images/backgrounds/bg-3.jpg'),
  ],

  // --- 星星人图片（用户自己放入 public/images/star/）---
  starMain: assetUrl('/images/star/star-main.png'),
  starSticker: assetUrl('/images/star/star-sticker-01.png'),
  starFrame: assetUrl('/images/star/star-frame.png'),

  // --- 音乐 ---
  music: assetUrl('/music/birthday.mp3'),
};

export type PhotoItem = { src: string; caption: string };