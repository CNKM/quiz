# 互动测验系统（Quiz System）

## 目录
- 项目简介
- 页面预览
- 功能亮点
- 题库 JSON 数据格式详解（强烈推荐自定义制作！）
- 题型与字段说明
- 题库制作建议
- 目录结构与用法
- 题库挂载方法与步骤
- 前端逻辑说明
- 扩展与常见问题
- 技术栈与未来展望

---

## 项目简介

本系统为现代化 Web 互动测验平台，支持多题型题库、解析展示、成绩统计、题库切换等功能。适合自主练习、课堂自测、在线考试等多场景，支持自定义题库 JSON 文件，极易扩展。

---

## 页面预览

（此处可插入页面截图）

---

## 功能亮点

- 支持单选、多选、填空、判断、连线、视频等多种题型
- 题库采用标准 JSON 文件，前后端分离，维护与扩展极为方便
- 题库切换、题型筛选、交卷批改、解析展示、成绩统计一应俱全
- 响应式设计，适配桌面与移动端
- 支持多媒体题（图片/音频/视频）

---

## 题库 JSON 数据格式详解（强烈推荐自定义制作！）

所有题库均为标准 JSON 文件，推荐放置于 `public/lib/` 目录。每个题库文件结构如下：

```json
{
  "title": "题库名称",
  "questions": [
    {
      "id": 1,
      "type": "题目分类",
      "questionType": "single-choice", // 支持：single-choice, multi-choice, fill-in-blank, matching, true-false, ...
      "title": "题目标题",
      "content": "题干内容，可含空格/多行/富文本",
      "mediaType": "video", // 可选，支持 video/image/audio
      "mediaUrl": "https://...", // 可选，配合 mediaType
      "options": [
        // 单选/多选/判断题
        {
          "question": "小题描述",
          "choices": { "A": "选项A", "B": "选项B", ... },
          "answer": "B", // 或 ["A","C"]（多选）
          "explanation": "解析说明"
        }
        // 填空题
        // {
        //   "question": "请填写...",
        //   "blankCount": 2,
        //   "blanks": [
        //     { "label": "1.", "placeholder": "第1空" },
        //     { "label": "2.", "placeholder": "第2空" }
        //   ],
        //   "answer": ["正确答案1", "正确答案2"],
        //   "explanation": "解析说明"
        // }
        // 连线题
        // {
        //   "question": "匹配描述",
        //   "pairs": [
        //     { "left": "A", "right": "1" },
        //     { "left": "B", "right": "2" }
        //   ],
        //   "answer": { "A": "1", "B": "2" },
        //   "explanation": "解析说明"
        // }
      ]
    }
    // ...更多题目
  ]
}
```

### 字段说明与题型支持

| 字段名         | 类型         | 说明                                                         |
| -------------- | ------------ | ------------------------------------------------------------ |
| id             | number       | 题目唯一编号                                                 |
| type           | string       | 题目分类/标签（如“完形填空”、“地理知识”等）                 |
| questionType   | string       | 题型：single-choice, multi-choice, fill-in-blank, matching, true-false, ... |
| title          | string       | 题目标题                                                     |
| content        | string       | 题干内容                                                     |
| mediaType      | string       | 可选，支持 video/image/audio                                  |
| mediaUrl       | string       | 可选，多媒体资源地址                                         |
| options        | array        | 题目选项/子题数组，结构随题型变化                            |

#### 选项结构（options）随题型变化：

- **单选/多选/判断题**：见上方示例
- **填空题**：需包含 `blankCount`、`blanks`（每空 label/placeholder）、`answer`（数组）
- **连线题**：需包含 `pairs`（左右项）、`answer`（对象，左对右）

---

## 题库制作建议

- 强烈建议直接用文本编辑器或 VSCode 制作/维护 JSON 题库，结构清晰、无注释、字段齐全。
- 每个题库文件建议包含 `title` 字段，便于前端切换和展示。
- 支持多题型混合，题型字段请规范填写（如 single-choice、multi-choice 等）。
- 解析（explanation）字段建议每题必填，便于交卷后展示。
- 多媒体题请填写 `mediaType` 和 `mediaUrl` 字段，支持视频、图片、音频。
- 可参考 `public/lib/quiz_data_Example.json`、`quiz_English_data.json` 作为模板。

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
- 新增题库只需将符合格式的 JSON 文件放入 `public/lib/`，前端自动识别，无需改动 JS 代码。

---

## 题库挂载方法与步骤

1. **编写题库 JSON 文件**
   - 按照本说明文档的格式规范，使用文本编辑器或 VSCode 新建一个 `.json` 文件（如 `quiz_my_custom.json`）。
   - 建议先复制 `public/lib/quiz_data_Example.json` 作为模板进行修改。

2. **放置题库文件**
   - 将你的 JSON 题库文件保存到 `public/lib/` 目录下（与 `quiz_data_Example.json` 同级）。

3. **无需修改前端代码**
   - 前端会自动扫描 `public/lib/` 目录下所有 `.json` 题库文件，并在页面题库下拉菜单中自动显示。
   - 你可以在页面左上角下拉菜单中切换到新题库，立即体验。

4. **刷新页面即可生效**
   - 新增或替换题库后，刷新浏览器页面即可加载最新题库内容。

5. **常见问题排查**
   - 若题库未显示或加载报错，请检查 JSON 格式是否严格合法（可用 VSCode/在线校验工具检查）。
   - 确保每个题库文件包含 `title` 字段，且 `questions` 为数组，题型字段拼写正确。

> **温馨提示**：你可以同时挂载多个题库，系统支持随时切换和独立统计成绩。

---

## 前端逻辑说明

- `script.js` 负责题库加载、题型筛选、作答、批改、解析、题库切换等全部交互。
- 支持所有主流题型，自动适配题库结构。
- 支持多题库切换、题型筛选、成绩统计、解析展示等。

---

## 扩展与常见问题

- 支持自定义题型扩展，前端代码结构清晰，便于二次开发。
- 如遇题库加载、批改、解析等问题，优先检查 JSON 格式与字段完整性。
- 欢迎提交 issue 或 PR 共同完善题库与功能。

---

## 技术栈与未来展望

- HTML5 + CSS3 + JavaScript (ES6+)
- Font Awesome 图标
- 未来可扩展后端 API、用户管理、成绩分析等高级功能

---

> 鼓励所有用户积极制作和分享高质量 quiz_data_xxx.json 题库文件，让互动测验更丰富、更智能！
