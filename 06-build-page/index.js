const fs = require('fs');
const path = require('path');

buildProject();

function buildProject() {
  const projectDist = path.join(__dirname, 'project-dist');
  fs.rm(projectDist, { recursive: true, force: true }, () => {
    fs.mkdir(projectDist, { recursive: true }, (err) => {
      if (err) throw err;
      createHTML(projectDist);
      const stylesPath = path.join(__dirname, 'styles');
      getStyles(stylesPath).then((res) => {
        writeFile(path.join(projectDist, 'style.css'), res.join(''));
      });
      const assetsFolder = path.join(__dirname, 'assets');
      const assetsDestination = path.join(projectDist, 'assets');
      copyFolder(assetsFolder, assetsDestination);
    });
  });
}

async function readFile(file) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(file, 'utf-8');
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
  });
}

async function writeFile(path, data) {
  const writer = fs.createWriteStream(path);
  writer.write(data);
}

async function getFilesFromDirectory(path) {
  return fs.promises.readdir(path, { withFileTypes: true });
}

async function getComponentsData() {
  const components = await getFilesFromDirectory(
    path.join(__dirname, 'components'),
  );
  const promises = components.map(async (file) => {
    const componentName = file.name.split('.')[0];
    const data = await readFile(path.join(__dirname, 'components', file.name));
    const obj = {
      name: componentName,
      data: data,
    };
    return obj;
  });
  const results = await Promise.all(promises);
  return results;
}

async function getStyles(filePath) {
  const files = await getFilesFromDirectory(filePath);
  const filredFiles = files.filter(
    (file) => path.extname(path.join(filePath, file.name)) === '.css',
  );
  const promises = filredFiles.map(
    async (file) => await readFile(path.join(filePath, file.name)),
  );
  const results = await Promise.all(promises);
  return results;
}

async function createHTML(folder) {
  let template = await readFile(path.join(__dirname, 'template.html'));
  const data = await getComponentsData();
  for (const e of data) {
    template = template.replace(`{{${e.name}}}`, e.data);
  }
  writeFile(path.join(folder, 'index.html'), template);
}

async function copyFolder(source, destination) {
  fs.mkdir(destination, { recursive: true }, (err) => {
    if (err) throw err;
  });
  fs.promises.readdir(source).then((files) => {
    files.map(async (file) => {
      const stat = await fs.promises.lstat(path.join(source, file));
      if (stat.isFile()) {
        fs.copyFile(
          path.join(source, file),
          path.join(destination, file),
          (err) => {
            if (err) throw err;
          },
        );
      } else {
        copyFolder(path.join(source, file), path.join(destination, file));
      }
    });
  });
}
