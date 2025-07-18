const fs = require('fs');
const path = require('path');

// 获取工作区根目录（脚本所在目录的上两级）
const workspaceRoot = path.resolve(__dirname, '..', '..');

// 读取 .env 文件
const envPath = path.join(workspaceRoot, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const portMatch = envContent.match(/SERVER_PORT\s*=\s*(\d+)/);
const port = portMatch ? portMatch[1] : '3000';

// 只替换 .vscode/launch.json 里的 http://localhost:端口号
const launchPath = path.join(workspaceRoot, '.vscode', 'launch.json');
if (fs.existsSync(launchPath)) {
    let content = fs.readFileSync(launchPath, 'utf-8');
    content = content.replace(/http:\/\/localhost:\d+/g, `http://localhost:${port}`);
    fs.writeFileSync(launchPath, content, 'utf-8');
    console.log(`launch.json 端口已替换为 ${port}`);
} else {
    console.warn('launch.json 不存在，未做任何修改');
}
