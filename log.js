const fs = require('fs');
const Time = require('./Time');
function Log(string) {
  const logFilePath = './log/log.txt'; // 日志文件路径

  // 格式化当前时间
  const timestamp = Time();

  // 构造日志内容
  const logEntry = `[${timestamp}] ${string}\n`;

  // 将日志内容附加到日志文件中
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error('无法写入日志文件:', err);
    } else {
      console.log(logEntry);
    }
  }); 
}

module.exports = Log;

