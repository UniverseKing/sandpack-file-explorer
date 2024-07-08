
const defaultFilePath = [
  '/index.js',
  '/App.js',
  '/README.md',
  '/config/dataset.json',
  '/config/basic.json',
];

export const getDefaultFiles = () => {
  let defaultFiles: string[] = [];
  try {
    // const keys = Object.keys(files);
    // defaultFiles = keys
    //   .reduce((pre: SandpackFileMap[], cur) => {
    //     pre.push({ key: cur, value: files[cur] });
    //     return pre;
    //   }, [])
    //   .filter((item) => item.value.defaultFile)
    //   .map((obj) => obj.key);
    defaultFiles = defaultFilePath;

    const dirs = Array.from(
      new Set(
        defaultFiles
          .filter((val) => val.split('/').length > 2)
          .map((val) => val.split('/').slice(1, 2).join(''))
          .map((path) => `/${path}`)
      )
    );
    defaultFiles = defaultFiles.concat(dirs);
  } catch {
    defaultFiles = ['/App.js', '/index.js'];
  }
  return defaultFiles;
};
