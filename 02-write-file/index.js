const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');

const file = path.join(__dirname, 'text.txt');

fs.writeFile(file, '', (err) => {
  if (err) throw err;
  stdout.write('File is created. Please input your message\n');
});

stdin.on('data', (message) => {
  if (message.toString() === 'exit\n') {
    stdout.write('Your messages are saved. Good bye!');
    process.exit();
  }
  fs.appendFile(file, message, (err) => {
    if (err) throw err;
  });
});

process.on('SIGINT', () => {
  stdout.write('Your messages are saved. Good bye!');
  process.exit();
});
