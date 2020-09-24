const path = require('path');
const fs = require('fs');
const { performance } = require('perf_hooks');

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
const endReadXMLFileTime = performance.now();

console.log('4. replace');
const beginReplaceTime = performance.now();
txtContent.split(/\n/).forEach((line) => {
  let [left, right] = line.split(' ');
  left = Number.parseInt(left).toString(16);
  right = Number.parseInt(right).toString(16);
  xmlContent.replace(`code="0x${left}"`, `code="0x${right}"`);
  xmlContent.replace(`code="0x${right}"`, `code="0x${left}"`);
});
const endReplaceTime = performance.now();

console.log('5. write xml file');
const beginWriteTime = performance.now();
fs.writeFileSync(xmlFilePath, xmlContent, { encoding: 'utf8' });
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
