const fs = require('fs');
const path = require('path');

const filesPath = path.join(__dirname, 'secret-folder');

fs.promises.readdir(filesPath, { withFileTypes: true }).then((files) => {
  files.map((e) => {
    if (e.isFile()) {
      const ext = path.extname(path.join(filesPath, e.name)).slice(1);
      fs.stat(path.join(filesPath, e.name), (err, stat) => {
        if (err) throw err;
        const size = stat.size / 1024;
        console.log(`${e.name} - ${ext} - ${size}kb`);
      });
    }
  });
});
