const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'files-copy');

fs.mkdir(copyFolderPath, (err) => {
  if (err) throw err;
});

fs.promises.readdir(folderPath).then((files) => {
  files.map((file) => {
    fs.copyFile(
      path.join(folderPath, file),
      path.join(copyFolderPath, file),
      (err) => {
        if (err) throw err;
      },
    );
  });
});
