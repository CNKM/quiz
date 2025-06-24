# 互动测验系统（Quiz System）

## 项目简介

现代化 Web 互动测验平台，支持多题型题库、解析展示、成绩统计、题库切换等功能。适合自主练习、课堂自测、在线考试等多场景，支持自定义题库 JSON 文件，极易扩展。

---

## 页面预览

（此处可插入页面截图，展示主界面、导航栏、综合评价等核心UI）

---

## 功能亮点

- 支持单选、多选、填空、判断、连线、视频等多种题型
- 题库采用标准 JSON 文件，前后端分离，维护与扩展极为方便
- 题库切换、题型筛选、交卷批改、解析展示、成绩统计一应俱全
- 响应式设计，兼容桌面与移动端
- 支持多媒体题（图片/音频/视频）
- 导航栏题号列表美观，分数/正确率分段着色，支持题目标题与分数分行显示
- 综合评价支持 emoji 表情与幽默分数段描述，激励学习
- 单题模式“重新作答”体验流畅，分数与选项状态彻底重置
- 无障碍优化，键盘友好，滚动条样式兼容主流浏览器

---

## 题库 JSON 数据格式（强烈推荐自定义制作！）

所有题库均为标准 JSON 文件，推荐放置于 `public/lib/` 目录。结构示例：

```json
{
  "title": "题库名称",
  "questions": [
    {
      "id": 1,
      "type": "题目分类",
      "questionType": "single-choice|multi-choice|fill-in-blank|matching|true-false|...",
      "title": "题目标题",
      "content": "题干内容，可含空格/多行/富文本",
      "mediaType": "video", // 可选，支持 video/image/audio
      "mediaUrl": "https://...", // 可选
      "options": [ ... ] // 结构随题型变化
    }
    // ...更多题目
  ]
}
```

- 题型支持：单选、多选、填空、连线、判断、多媒体等，详见 `public/lib/quiz_data_Example.json`。
- options 字段结构随题型变化，支持丰富的子题、选项、答案、解析等。

---

## 目录结构与用法

```
quiz/
├── public/
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   └── lib/
│       ├── quiz_data_Example.json
│       └── quiz_English_data.json
├── images/
├── server.js
└── readme.md
```

- 直接用浏览器打开 `public/index.html` 即可体验全部功能。
- 新增题库只需将符合格式的 JSON 文件放入 `public/lib/`，前端自动识别，无需修改 JS 代码。

---

## 题库挂载方法与步骤

1. **编写题库 JSON 文件**
   - 按照说明文档的格式规范，使用文本编辑器或 VSCode 新建 `.json` 文件（如 `quiz_my_custom.json`）。
   - 建议先复制 `public/lib/quiz_data_Example.json` 作为模板进行修改。

2. **放置题库文件**
   - 将你的 JSON 题库文件保存到 `public/lib/` 目录下。

3. **无需修改前端代码**
   - 前端会自动扫描 `public/lib/` 目录下所有 `.json` 题库文件，并在页面题库下拉菜单中自动显示。

4. **刷新页面即可生效**
   - 新增或替换题库后，刷新浏览器页面即可加载最新题库内容。

5. **常见问题排查**
   - 若题库未显示或加载报错，请检查 JSON 格式是否合法（可用 VSCode/在线校验工具检查）。
   - 确保每个题库文件包含 `title` 字段，且 `questions` 为数组，题型字段拼写正确。

> **温馨提示**：可同时挂载多个题库，系统支持随时切换和独立统计成绩。

---

## 技术栈与未来展望

- HTML5 + CSS3 + JavaScript (ES6+)
- Font Awesome 图标
- 未来可扩展后端 API、用户管理、成绩分析等高级功能

---

> 鼓励所有用户积极制作和分享高质量 quiz_data_xxx.json 题库文件，让互动测验更丰富、更智能！
