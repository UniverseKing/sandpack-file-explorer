import {
  useSandpack,
  FileIcon,
  DirectoryIconOpen,
} from '@codesandbox/sandpack-react';
import React from 'react';
import { useSandpackFiles } from './SandpackFilesProvider';

export const CreateNewNode = ({
  dir,
  selectDir,
}: {
  dir?: boolean;
  selectDir?: string | null;
}) => {
  const { sandpack } = useSandpack();
  const { addFile } = useSandpackFiles();

  return (
    <span
      style={{
        cursor: 'pointer',
      }}
      onClick={() => {
        console.log(sandpack);
        let activeFile = sandpack.activeFile;
        if (selectDir) {
          activeFile = selectDir;
        }
        const activeSpace = activeFile.split('/').slice(0, -1).join('/');

        addFile({
          [`${activeSpace}/${dir ? 'addDir' : 'addFile'}`]: {
            code: '.emptyDir',
            hidden: true,
          },
        });
      }}
    >
      {dir ? <DirectoryIconOpen /> : <FileIcon />}
    </span>
  );
};
