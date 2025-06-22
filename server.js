// server.js

// 引入 Express 模块
const express = require('express');
// 创建 Express 应用实例
const app = express();
// 定义服务器将监听的端口号
const port = 3000; // 你可以选择任何未被占用的端口，例如 3000, 8080, 5000

// 使用 express.static 中间件来提供静态文件
// 'public' 是你的静态文件所在的目录名，例如你的 index.html, script.js, style.css 和 lib 文件夹都在这里面
app.use(express.static('public'));

// 启动服务器并监听指定端口
app.listen(port, () => {
    // 服务器成功启动后在控制台输出提示信息
    console.log(`Server running at http://localhost:${port}`);
});
