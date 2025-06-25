// 加载 .env 环境变量
require('dotenv').config();
// 引入 Express 模块
const express = require('express');
// 创建 Express 应用实例
const app = express();
// 定义服务器将监听的端口号
//从env serverPort 获取

const port = process.env.SERVER_PORT || 3000;  // 你可以选择任何未被占用的端口，例如 3000, 8080, 5000

// 使用 express.static 中间件来提供静态文件
// 'public' 是你的静态文件所在的目录名，例如你的 index.html, script.js, style.css 和 lib 文件夹都在这里面
app.use(express.static('public'));

// 引入文件系统模块
const fs = require('fs');
const path = require('path');
const { env } = require('process');

// 新增API：返回 public/lib/ 下所有 .json 文件名
app.get('/api/quiz-list', (req, res) => {
    const libDir = path.join(__dirname, 'public', 'lib');
    fs.readdir(libDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: '无法读取题库目录' });
        }
        // 只返回 .json 文件
        const jsonFiles = files.filter(f => f.endsWith('.json'));
        res.json(jsonFiles);
    });
});

// 启动服务器并监听指定端口
app.listen(port, () => {
    // 服务器成功启动后在控制台输出提示信息
    console.log(`Server running at http://localhost:${port}`);
});
