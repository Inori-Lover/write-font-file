const path = require('path');
const fs = require('fs');
const { performance } = require('perf_hooks');

// const a = `
// <?xml version="1.0" encoding="UTF-8"?>
// <ttFont sfntVersion="\x00\x01\x00\x00" ttLibVersion="4.15">
//   <head>
//     <!-- Most of this table will be recalculated by the compiler -->
//     <tableVersion value="1.0"/>
//   </head>
//   <cmap>
//     <cmap_format_12 platformID="3" platEncID="10" format="12" reserved="0" length="1828" language="0" nGroups="151">
//       <map code="0x44ab" name="uni44AB"/><!-- CJK UNIFIED IDEOGRAPH-44AB -->
//       <map code="0x44ac" name="uni44AC"/><!-- CJK UNIFIED IDEOGRAPH-44AC -->
//       <map code="0x44ad" name="uni44AD"/><!-- CJK UNIFIED IDEOGRAPH-44AD -->
//     </cmap_format_12>
//   </cmap>
// </ttFont>
// `;

// const b = a
//   .split(/(?<=map\scode\="0x[0-9a-f]{4})(?=")/)
//   .map((line) => line.split(/(?<=map\scode\=")/))
//   .flat(2);
// b.forEach((line) => {
//   console.log(line);
//   console.log('=================');
// });
// process.exit(0);

console.log('1. begin');
const beginTime = performance.now();

console.time('2. read txt file');
const beginReadTxtFileTime = performance.now();
const txtFilePath = path.resolve(__dirname, './res/table.txt');
const txtContent = fs.readFileSync(txtFilePath, { encoding: 'utf8' });
const endReadTxtFileTime = performance.now();

console.log('3. read xml file');
const beginReadXMLFileTime = performance.now();
const xmlFilePath = path.resolve(__dirname, './res/font.xml');
const xmlContent = fs.readFileSync(xmlFilePath, { encoding: 'utf8' });
const xmlContentInArr = xmlContent
  // 正则分割，用的都是断言所以不会丢失字符
  .split(/(?<=map\scode\="0x[0-9a-f]{4})(?=")/)
  // 正则分割
  .map((line) => line.split(/(?<=map\scode\=")/))
  // 把 map 导致的二层数组重新打扁
  .flat(2);
const endReadXMLFileTime = performance.now();

console.log('4. replace');
const beginReplaceTime = performance.now();

// 初始化为一个数字有助v8判断类型，提前分配内存
let currentIndex = 0;

txtContent.split(/\n/).forEach((line) => {
  // 复用内存
  currentIndex = 0;
  let [left, right] = line.split(' ');
  left = `0x${Number.parseInt(left).toString(16)}`;
  right = `0x${Number.parseInt(right).toString(16)}`;
  // 文件中替换的位置可能不止一处（同一个码点可能多次出现），所以这里不进行提前break
  // 不过如果input的xml是确定的话，可以进行一次计数，最多出现三次
  for (const _ of xmlContentInArr) {
    // 我这里可能有理解错，我理解是line的左右互换，但原来的示例代码貌似是只有左边换成右边
    // 全等操作符比 _.indexOf(left) > -1 快上一个数量级……100跟10的区别
    if (_ === left) {
      xmlContentInArr[currentIndex] = _.replace(left, right);
    } else if (_ === right) {
      xmlContentInArr[currentIndex] = _.replace(right, left);
    }

    currentIndex += 1;
  }
});
const endReplaceTime = performance.now();

console.log('5. write xml file');
const beginWriteTime = performance.now();
const xmlResultFilePath = path.resolve(__dirname, './res/font.result.xml');
fs.writeFileSync(xmlResultFilePath, xmlContentInArr.join(''), {
  encoding: 'utf8',
});
const endWriteTime = performance.now();

const endTime = performance.now();

console.log('6. done, calcing performance');

function timeFormate(time1, time2) {
  const begin = Math.min(time1, time2);
  const end = Math.max(time1, time2);
  return `${((end - begin) / 1000).toFixed(2)}s`;
}

console.log('calc result:');

console.table([
  { all: timeFormate(beginTime, endTime) },
  { readTxt: timeFormate(beginReadTxtFileTime, endReadTxtFileTime) },
  { readXML: timeFormate(beginReadXMLFileTime, endReadXMLFileTime) },
  { replace: timeFormate(beginReplaceTime, endReplaceTime) },
  { write: timeFormate(beginWriteTime, endWriteTime) },
]);
