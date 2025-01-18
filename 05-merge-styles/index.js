const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'styles');

getContent(folderPath).then((res) => {
  const writer = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'bundle.css'),
  );
  writer.write(res.toString());
});

async function getContent(filesPAth) {
  const files = await getFilesFromDirectory(filesPAth);
  const filredFiles = files.filter(
    (file) => path.extname(path.join(folderPath, file.name)) === '.css',
  );
  const promises = filredFiles.map(async (file) => await readFile(file));
  const results = await Promise.all(promises);
  return results;
}

function getFilesFromDirectory(path) {
  return fs.promises.readdir(path, { withFileTypes: true });
}

async function readFile(file) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(
      path.join(folderPath, file.name),
      'utf-8',
    );
    let data = '';
    readStream.on('error', (err) => {
      reject(err);
    });
    readStream.on('data', (chunk) => {
      data += chunk;
    });
    readStream.on('end', () => {
      resolve(data);
    });
    // }
  });
}
