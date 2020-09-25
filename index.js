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
let xmlContent = fs.readFileSync(xmlFilePath, { encoding: 'utf8' });
const endReadXMLFileTime = performance.now();

console.log('4. replace');
const beginReplaceTime = performance.now();
const replaceFlag = `DONT_${Math.random().toFixed(15)}_REPLACE_ME`;
txtContent.split(/\n/).forEach((line) => {
  let [left, right] = line.split(' ');
  left = Number.parseInt(left).toString(16);
  right = Number.parseInt(right).toString(16);
  xmlContent = xmlContent
    .replace(`${left}"`, `${right}${replaceFlag}"`)
    .replace(`${right}"`, `${left}"`)
    .replace(replaceFlag, '');
});
const endReplaceTime = performance.now();

console.log('5. write xml file');
const beginWriteTime = performance.now();
const xmlResultFilePath = path.resolve(__dirname, './res/font.result.xml');
fs.writeFileSync(xmlResultFilePath, xmlContent, { encoding: 'utf8' });
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
