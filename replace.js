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

class DateBase {
  static get mockText() {
    const txtFilePath = path.resolve(__dirname, './res/text');
    return fs.readFileSync(txtFilePath, { encoding: 'utf8' });
  }
}

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

    const mockText = DateBase.mockText;

    const begin = performance.now();
    lastStr = format(mockText);
    const end = performance.now();

    console.log(
      `第${idx + 1}次替换结束，用时${~~(end - begin)}ms。替换前长度为：${
        mockText.length
      }, 替换后长度为：${lastStr.length}`,
    );
  });
  // console.log('最后一次替换结果 -----------');
  // console.log(lastStr);
}
main();
