# 互动测验系统

这是一个基于 Node.js 和 Express 的现代化 Web 互动测验平台。它支持动态加载自定义题库，提供多种题型，并能实时统计分数，非常适合用于个人练习、在线教育和技能评估。

## 主要功能

- **动态题库加载**: 无需修改代码，只需将 JSON 格式的题库文件放入 `public/lib` 目录即可自动加载。
- **多种题型支持**: 支持单选题、多选题、填空题、判断题、连线题以及内嵌视频的媒体题。
- **灵活的答题模式**: 用户可以选择“单题作答”模式进行逐题练习，或选择“套题作答”模式进行模拟考试。
- **实时反馈与统计**: 答题后立即显示得分和正确率，并高亮显示正确和错误的答案。
- **可配置化**: 服务器端口可通过 `.env` 文件进行配置，方便部署。
- **自动化启动配置**: 提供了 `generatelaunch.js` 脚本，可根据 `.env` 文件自动更新 VS Code 的 `launch.json` 配置文件。

## 技术栈

- **后端**: Node.js, Express.js
- **前端**: HTML, CSS, JavaScript (ES6+)
- **环境配置**: dotenv
- **开发工具**: Visual Studio Code

## 项目结构

```
quiz/
├── .vscode/
│   └── launch.json       # VS Code 调试配置
├── public/
│   ├── index.html        # 应用主页面
│   ├── script.js         # 前端核心逻辑
│   ├── style.css         # 样式表
│   └── lib/              # 存放 JSON 题库文件
│       └── *.json
├── .env                    # 环境变量配置文件 (例如 SERVER_PORT=7669)
├── generatelaunch.js       # 自动生成 launch.json 的脚本
├── package.json            # 项目依赖和脚本配置
└── server.js               # Express 服务器
```

## 安装与启动

1.  **克隆项目**
    ```bash
    git clone https://github.com/CNKM/quiz.git
    cd quiz
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **配置环境变量**
    - 复制或重命名 `.env.example` 为 `.env`。
    - 在 `.env` 文件中设置 `SERVER_PORT`，例如：
      ```
      SERVER_PORT=7669
      ```

4.  **启动项目**
    - **开发模式** (自动更新 `launch.json` 并启动服务):
      ```bash
      npm run full
      ```
    - **直接启动**:
      ```bash
      npm start
      ```
    启动后，在浏览器中访问 `http://localhost:<你的端口号>` 即可。

## API 接口

### `GET /api/quiz-list`

返回 `public/lib` 目录下所有 `.json` 题库文件的文件名列表。

- **成功响应 (200)**:
  ```json
  [
    "quiz_English_data.json",
    "quiz_data_Example.json"
  ]
  ```
- **失败响应 (500)**:
  ```json
  {
    "error": "无法读取题库目录"
  }
  ```
