const { performance } = require('perf_hooks');
const path = require('path');
const fs = require('fs');

class DataFromOutsize {
  static _codeMap;
  static get codeMap() {
    if (DataFromOutsize._codeMap) {
      return DataFromOutsize._codeMap;
    }
    const txtFilePath = path.resolve(__dirname, './res/table.txt');
    const txtContent = fs.readFileSync(txtFilePath, { encoding: 'utf8' });
    DataFromOutsize._codeMap = new Map(
      txtContent.split(/\n/).map((line) => {
        const [left, right] = line.split(' ');

        /// 这里left都是高位，right都是常见字符
        return [String.fromCharCode(right), String.fromCharCode(left)];
      }),
    );

    return DataFromOutsize._codeMap;
  }

  static _whiteList;
  /** ascii不替换 */
  static get whiteList() {
    if (DataFromOutsize._whiteList) {
      return DataFromOutsize._whiteList;
    }
    DataFromOutsize._whiteList = new Set(
      new Array(128).fill(0).map((_, idx) => String.fromCharCode(idx)),
    );

    return DataFromOutsize._whiteList;
  }
}

/** 模拟文段, 一段的长度是647 */
const mockText = `这里不讨论实体书，实体书相关的知识可以前往此处查看
首先，国内有一手的轻小说发布的网站只有五处， 轻之国度， 天使动漫， 深夜读书会， 真白萌， 还有极小一部分翻译是发到贴吧的，其余的网站均为转载以上网站
其中深夜读书会几乎只发布台版的电子版(只提供下载版，采用txt内标注插图位置)，轻之国度是翻译聚集最多的地方，轻之国度和天使动漫采用合作方式录入台版小说，真白萌以web为主
目前，大部分转载的网站都选择将插图放到文章最后，且转载的时候无视作者标注的内容，导致现在不少发布者不想被转载网站转走， 在发布的时候会标注禁止转载，然而依旧会被转载，最后无奈以图片形式发布，甚至弃坑，接下来我们称他们为盗转网站
网站初衷
目前所有的发布网站在线阅读的体验都不好，这可能也是读者去盗转网站观看的原因之一
为了同时解决盗转和阅读体验的问题，我与圈内的朋友共同开发了本网站，为了让读者有更好的阅读体验，为了让发布有更好的发布体验
对于发布，网站全程采用HTML格式，发布者可以随心编写css样式，实现美观的排版，同时被发布出来的内容，呈现到读者上时全线加密，盗转网站无法随意拿到原文，从其他网站转载时将严格遵守发布要求，不想被转我们绝不会转
对于读者，我们将实现一般阅读器会有的功能，同时由于自由的排版，带来比盗转网站更好的阅读体验
公开处刑网站版
这里公开几个盗转网站，以后在群内推荐这些网站的人一律踢出+封号
动漫之家，wenku8，迷糊轻小说，铅笔小说，亲小说，bili轻小说，神凑轻小说，魔笔小说`
  .repeat(Math.floor(10 ** 6 / 600))
  .replace(/^(.+)$/gm, '<p>$1</p>');

/** 主函数 */
function format(rawText) {
  const resultText = [];

  for (const char of rawText) {
    if (DataFromOutsize.whiteList.has(char)) {
      resultText.push(char);
    } else {
      resultText.push(DataFromOutsize.codeMap.get(char));
    }
  }

  return resultText.join('');
}

function main() {
  let lastStr = '';
  console.log('开始运行');
  // 10次循环
  new Array(10).fill(0).forEach((_, idx) => {
    console.log(`第${idx + 1}次替换开始。。。`);

    const begin = performance.now();
    lastStr = format(mockText);
    const end = performance.now();

    console.log(
      `第${idx + 1}次替换结束，用时${~~(end - begin)}ms。替换前长度为：${
        mockText.length
      }, 替换后长度为：${lastStr.length}`,
    );
  });
}
main();
