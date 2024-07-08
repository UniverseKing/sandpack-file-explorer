import type { SandpackBundlerFiles, SandpackFileMap } from '../types';

export const getHiddenFiles = (files: SandpackBundlerFiles) => {
  let hiddenFiles: string[] = [];
  try {
    const keys = Object.keys(files);
    hiddenFiles = keys
      .reduce((pre: SandpackFileMap[], cur) => {
        pre.push({ key: cur, value: files[cur] });
        return pre;
      }, [])
      .filter((item) => item.value._hide)
      .map((obj) => obj.key);

    const dirs = Array.from(
      new Set(
        hiddenFiles
          .filter((val) => val.split('/').length > 2)
          .map((val) => val.split('/').slice(1, 2).join(''))
          .map((path) => `/${path}`)
      )
    );
    hiddenFiles = hiddenFiles.concat(dirs);
  } catch {
    hiddenFiles = ['/index.js'];
  }
  return hiddenFiles;
};
