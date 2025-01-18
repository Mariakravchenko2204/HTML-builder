const fs = require('fs');
const path = require('path');

copyDir(__dirname, __dirname, 'files');

async function copyDir(source, destination, folder) {
  let folderName = folder;
  if (source === destination) {
    folderName += '-copy';
  }
  const destinationFolder = path.join(destination, folderName);
  const sourceFolder = path.join(source, folder);

  fs.rm(destinationFolder, { recursive: true, force: true }, () => {
    fs.mkdir(destinationFolder, { recursive: true }, (err) => {
      if (err) throw err;
    });
    fs.promises.readdir(sourceFolder).then((files) => {
      files.map(async (file) => {
        const stat = await fs.promises.lstat(path.join(sourceFolder, file));
        if (stat.isFile()) {
          fs.copyFile(
            path.join(sourceFolder, file),
            path.join(destinationFolder, file),
            (err) => {
              if (err) throw err;
            },
          );
        } else {
          copyDir(sourceFolder, destinationFolder, file);
        }
      });
    });
  });
}
