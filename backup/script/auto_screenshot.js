const { chromium } = require('playwright');
const fs = require('fs');

/**
 * 互动测验系统自动化截图脚本
 * 功能：自动生成各题型演示截图和 readme.md 文档
 * 特点：每类题型仅展示一例，优先使用主题库，避免重复截图
 */

// 题库文件列表
const quizFiles = [
  { file: '1.quiz_data_Example.json', name: '示例题库' },
  { file: '2.quiz_English_data.json', name: '英语题库' },
  { file: '3.english_phrases_translation_quiz.json', name: '英语短语翻译' },
  { file: '4.geo_quiz_new_format.json', name: '地理知识题库' }
];

/**
 * 读取所有题库，按题型去重，优先主库
 * @returns {Object} 题型映射表 {questionType: {file, name, question}}
 */
function buildTypeMap() {
  const typeMap = {};
  for (const quiz of quizFiles) {
    const data = JSON.parse(fs.readFileSync('public/lib/' + quiz.file, 'utf-8'));
    for (const q of data.questions) {
      // 以 questionType 作为题型唯一标识，优先保留第一个（主库）
      if (!typeMap[q.questionType]) {
        typeMap[q.questionType] = { file: quiz.file, name: quiz.name, question: q };
      }
    }
  }
  return typeMap;
}

/**
 * 套题模式截图函数
 * 专门处理套题模式的完整流程截图
 * @param {Object} page - Playwright 页面对象
 * @param {string} baseUrl - 基础 URL
 * @returns {Object} 返回截图路径对象
 */
async function captureSetMode(page, baseUrl) {
  console.log('开始套题模式截图...');
  
  // 重新加载首页
  await page.goto(baseUrl);
  await page.waitForTimeout(800);
  
  // 移除 pointer-events 遮挡
  await page.evaluate(() => {
    document.querySelectorAll('*').forEach(el => {
      if (getComputedStyle(el).pointerEvents !== 'auto') {
        el.style.pointerEvents = 'auto';
      }
    });
  });
  
  // 切换到示例题库
  await page.evaluate(() => {
    document.querySelector('#quiz-source-toggle').click();
  });
  await page.waitForTimeout(300);
  
  const quizList = await page.$$('#quiz-source-menu li');
  for (let j = 0; j < quizList.length; j++) {
    const text = await quizList[j].innerText();
    if (text.includes('1.quiz_data_Example.json') || text.includes('示例题库')) {
      await page.evaluate(el => el.click(), quizList[j]);
      await page.waitForTimeout(800);
      break;
    }
  }
  
  // 切换题型为单选题
  await page.evaluate(() => {
    document.querySelector('#quiz-type-toggle').click();
  });
  await page.waitForTimeout(300);
  
  const typeList = await page.$$('#quiz-type-menu li');
  for (let k = 0; k < typeList.length; k++) {
    const text = await typeList[k].innerText();
    if (text.includes('single-choice') || text.includes('单选')) {
      await page.evaluate(el => el.click(), typeList[k]);
      await page.waitForTimeout(500);
      break;
    }
  }
  
  // 选择套题模式
  const modeToggle = await page.$('#quiz-mode-toggle');
  if (modeToggle) {
    await page.evaluate(el => el.click(), modeToggle);
    await page.waitForTimeout(300);
    
    // 尝试找到套题选项
    const modeOptions = await page.$$('#quiz-mode-menu li, .mode-option');
    for (const opt of modeOptions) {
      const text = await opt.innerText();
      if (text.includes('套题') || text.includes('set')) {
        await page.evaluate(el => el.click(), opt);
        await page.waitForTimeout(800);
        break;
      }
    }
  }
  
  // 截图套题首页
  const imgSetHome = 'images/set-mode_home.png';
  await page.screenshot({ path: imgSetHome, fullPage: true });
  
  // 点击开始作答
  const startBtn = await page.$('#start-quiz-btn');
  if (startBtn) {
    await page.evaluate(el => el.click(), startBtn);
    await page.waitForTimeout(800);
  }
  
  // 作答
  const options = await page.$$('.choice-item, .option-item, input[type="radio"]');
  if (options.length > 0) {
    await page.evaluate(el => el.click(), options[0]);
    await page.waitForTimeout(500);
  }
  
  // 截图作答后
  const imgSetAnswer = 'images/set-mode_answer.png';
  await page.screenshot({ path: imgSetAnswer, fullPage: true });
  
  // 交卷
  const submitBtn = await page.$('#submit-quiz-btn, .submit-btn');
  if (submitBtn) {
    await page.evaluate(el => el.click(), submitBtn);
    await page.waitForTimeout(1200);
  }
  
  // 截图交卷后
  const imgSetSubmit = 'images/set-mode_submit.png';
  await page.screenshot({ path: imgSetSubmit, fullPage: true });
  
  return {
    home: imgSetHome,
    answer: imgSetAnswer,
    submit: imgSetSubmit
  };
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  const baseUrl = 'http://localhost:7000';
  
  // 生成合并后的 README 内容
  let md = `# 互动测验系统

## 项目概述
这是一个基于 Node.js/Express 的互动测验系统，支持多种题型和答题模式。

## 快速开始
\`\`\`bash
# 安装依赖
npm install

# 启动服务器
node server.js

# 访问系统
http://localhost:7000
\`\`\`

## 自动化截图脚本
本项目包含自动化演示脚本，可生成完整的题型演示文档。

### 使用方法
\`\`\`bash
# 安装 Playwright（如未安装）
npm install playwright

# 启动测验系统服务器
node server.js

# 在另一个终端运行自动化脚本
node auto_screenshot.js
\`\`\`

### 脚本特性
- ✅ 每类题型仅展示一例，避免重复
- ✅ 优先使用主题库 (1.quiz_data_Example.json)
- ✅ 自动清理未使用的截图文件
- ✅ 生成精炼的图文并茂文档

---

## 题型多样性一览（每类题型仅展示一例）
`;
  for (let i = 0; i < quizFiles.length; i++) {
    const quiz = quizFiles[i];
    md += `- **${quiz.name}** (${quiz.file})\n`;
  }
  md += '\n---\n';

  // 1. 构建题型映射
  const typeMap = buildTypeMap();
  
  // 2. 首先截图套题模式
  const setModeImages = await captureSetMode(page, baseUrl);
  md += `\n## 套题模式演示\n- 套题首页\n![](${setModeImages.home})\n- 作答后\n![](${setModeImages.answer})\n- 交卷与解析\n![](${setModeImages.submit})\n`;

  // 3. 遍历每类题型，自动化演示
  for (const [type, info] of Object.entries(typeMap)) {
    await page.goto(baseUrl);
    await page.waitForTimeout(800);
    // 移除 pointer-events 遮挡
    await page.evaluate(() => {
      document.querySelectorAll('*').forEach(el => {
        if (getComputedStyle(el).pointerEvents !== 'auto') {
          el.style.pointerEvents = 'auto';
        }
      });
    });
    // 切换题库
    await page.evaluate(() => {
      document.querySelector('#quiz-source-toggle').click();
    });
    await page.waitForTimeout(300);
    const quizList = await page.$$('#quiz-source-menu li');
    for (let j = 0; j < quizList.length; j++) {
      const text = await quizList[j].innerText();
      if (text.includes(info.file) || text.includes(info.name)) {
        await page.evaluate(el => el.click(), quizList[j]);
        await page.waitForTimeout(800);
        break;
      }
    }

    // 切换到该题型（如果有题型切换功能）
    await page.evaluate(() => {
      document.querySelector('#quiz-type-toggle').click();
    });
    await page.waitForTimeout(300);
    const typeList = await page.$$('#quiz-type-menu li');
    let foundType = false;
    for (let k = 0; k < typeList.length; k++) {
      const text = await typeList[k].innerText();
      if (text.includes(type) || text.includes(info.question.type)) {
        await page.evaluate(el => el.click(), typeList[k]);
        await page.waitForTimeout(500);
        foundType = true;
        break;
      }
    }
    // 截图题型首页（视频题等待更久）
    if (info.question.mediaType === 'video') {
      await page.waitForTimeout(2000); // 等待视频加载
    }
    const imgHome = `images/${type}_home.png`;
    await page.screenshot({ path: imgHome, fullPage: true });

    // 点击开始作答
    const startBtn = await page.$('#start-quiz-btn');
    if (startBtn) {
      await page.evaluate(el => el.click(), startBtn);
      await page.waitForTimeout(500);
    }

    // 交卷
    const submitBtn = await page.$('#submit-quiz-btn');
    if (submitBtn) {
      await page.evaluate(el => el.click(), submitBtn);
      await page.waitForTimeout(1200);
    }
    const imgSubmit = `images/${type}_submit.png`;
    await page.screenshot({ path: imgSubmit, fullPage: true });

    // markdown 只保留首页和交卷
    md += `\n## 题型：${type}\n- 题型首页\n![](${imgHome})\n- 交卷与解析\n![](${imgSubmit})\n`;
  }

  // 清理未用到的截图文件
  console.log('清理未使用的截图文件...');
  const usedImages = new Set([
    'single-choice_home.png', 'single-choice_submit.png',
    'multi-choice_home.png', 'multi-choice_submit.png',
    'fill-in-blank_home.png', 'fill-in-blank_submit.png',
    'matching_home.png', 'matching_submit.png',
    'true-false_home.png', 'true-false_submit.png',
    'set-mode_home.png', 'set-mode_answer.png', 'set-mode_submit.png'
  ]);
  
  const imgDir = 'images';
  if (fs.existsSync(imgDir)) {
    fs.readdirSync(imgDir).forEach(f => {
      if (!usedImages.has(f) && f.endsWith('.png')) {
        try { 
          fs.unlinkSync(imgDir + '/' + f);
          console.log(`已删除未使用的截图: ${f}`);
        } catch (e) {
          console.log(`删除截图失败: ${f}`, e.message);
        }
      }
    });
  }

  // 写入 readme.md
  fs.writeFileSync('readme.md', md);
  console.log('✅ 自动化演示与文档已生成完成！');
  console.log('📁 截图文件位于 images/ 目录');
  console.log('📄 文档文件: readme.md');
  
  await browser.close();
})().catch(error => {
  console.error('❌ 自动化脚本执行失败:', error);
  process.exit(1);
});
