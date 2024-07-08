import React from 'react';
import {
  useSandpack,
  FileIcon,
  CloseIcon,
  DirectoryIconClosed,
  DirectoryIconOpen,
} from '@codesandbox/sandpack-react';
import {
  Tree,
  getBackendOptions,
  MultiBackend,
  DropOptions,
  NodeModel,
} from '@minoru/react-dnd-treeview';
import { DndProvider } from 'react-dnd';
import { SingleInputForm } from './SingleInputForm';
import { CreateNewNode } from './CreateNewNode';
import { useSandpackFiles } from './SandpackFilesProvider';
import { buildPath, getEntryFile, getDefaultFiles } from './utils';
import { Item } from './types';
import { getHiddenFiles } from './utils/getHiddenFiles';
import $ from 'jquery';
import './index.css';
import { useState } from 'react';

export const FileTreeExplorer = () => {
  const {
    treeData,
    addFile,
    deleteFile,
    onFileMoved,
    setTreeData,
    openDirs,
    setOpenDirs,
  } = useSandpackFiles();
  const { sandpack } = useSandpack();

  const [selectDir, setSelectDir] = useState<string | null>();

  const immoveablePaths = ['/package.json'];
  const handleDrop = async (
    newTreeData: NodeModel<{
      path: string;
    }>[],
    node: DropOptions<{ path: string }>
  ) => {
    const entryFile = getEntryFile(sandpack.files);

    const path = `/${buildPath(
      {
        parent: node.dropTargetId as string,
        text: (node?.dragSource?.text || node.dragSourceId) as string,
      },
      newTreeData as Item[]
    )}`;

    if (sandpack.files[path]) {
    }
    if (
      [...immoveablePaths, entryFile].includes(
        node?.dragSource?.data?.path || ''
      ) ||
      node.dragSource?.parent === node.dropTargetId ||
      sandpack.files[path]
    ) {
      return;
    }

    await onFileMoved({ newTree: newTreeData as Item[], node });
    // const prev = mergeHierarchicalArray(sandpack.files, treeData);
    // const neww = mergeHierarchicalArray(sandpack.files, newTreeData);

    // const deleteFilePromises = getRemovedKeys(prev, neww).map((key) =>
    //   sandpack.deleteFile(key)
    // );
    // await Promise.all(deleteFilePromises);

    // addFile(neww);
    setTreeData(newTreeData);
  };

  const entryFile = getEntryFile(sandpack.files);
  const defaultFiles = getDefaultFiles(sandpack.files);
  const hiddenFiles = getHiddenFiles(sandpack.files);

  console.log(treeData);

  return (
    <>
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <div
          style={{
            minHeight: '100%',
            maxHeight: '100%',
            height: `var(--sp-layout-height)`,
            minWidth: '200px',
            overflowY: 'auto',
            overflowX: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            padding: `var(--sp-space-1) var(--sp-space-3)`,
            backgroundColor: `var(--sp-colors-surface1, #011627)`,
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: '40px',
            }}
          >
            <span>Files</span>
            <div style={{ display: 'flex' }}>
              <CreateNewNode selectDir={selectDir} />
              <CreateNewNode selectDir={selectDir} dir={true} />
            </div>
          </div>
          <Tree<{ path: string }>
            tree={treeData.filter(({ text }) => Boolean(text))}
            rootId={'/'}
            onDrop={handleDrop}
            rootProps={{
              style: { listStyle: 'none', padding: '0', height: '100%' },
            }}
            classes={{ root: 'test', listItem: 'list-item' }}
            enableAnimateExpand={true}
            insertDroppableFirst={true}
            sort={true}
            initialOpen={openDirs}
            // onChangeOpen={(e) => setOpenDirs(e as string[])}
            // initialOpen={openDirs} //treeData.map(({ id }) => id)}
            render={(node, { depth, isOpen }) => {
              console.log(node);
              return !node.text ? (
                <></>
              ) : (
                <div
                  key={node.id}
                  style={{
                    marginLeft: depth * 10,
                    display: hiddenFiles.includes(node.data?.path ?? '')
                      ? 'none'
                      : 'flex',
                    justifyContent: 'space-between',
                    maxWidth: '300px',
                    overflow: 'hidden',
                    padding: `var(--sp-space-1) 0`,
                    transition: `color var(--sp-transitions-default), background var(--sp-transitions-default)`,
                  }}
                >
                  {node.text.includes('addFile') ||
                  node.text.includes('addDir') ? (
                    <SingleInputForm
                      files={sandpack.files}
                      onBlur={() => deleteFile(`${node?.data?.path}`)}
                      isDirectory={node.text.includes('addDir')}
                      currentPath={node?.data?.path
                        .split('/')
                        .slice(0, -1)
                        .join('/')}
                      onSubmit={async (fileName) => {
                        const newPath = node?.data?.path
                          .split('/')
                          .slice(0, -1)
                          .join('/');

                        const path = `${newPath}/${fileName}`;
                        await addFile({
                          [path]: {
                            code: node.text.includes('addDir')
                              ? '.emptyDir'
                              : `// ${fileName}`,
                            hidden: node.text.includes('addDir'),
                          },
                        });
                      }}
                    />
                  ) : null}
                  {node.text &&
                  !node.text.includes('addFile') &&
                  !node.text.includes('addDir') ? (
                    <>
                      {node.droppable ? (
                        <span
                          data-path={
                            node.data?.path ?? `${node.parent}/${node.text}`
                          }
                          style={{
                            color: `var(--sp-colors-clickable)`,
                            display: 'flex',
                            cursor: 'pointer',
                          }}
                          onClick={(e) => {
                            console.log(e);

                            const span = $(e.target);
                            const parent = span.parent('div');

                            parent
                              .parents('li')
                              .children('div')
                              .removeClass('active-item');

                            parent.addClass('active-item');

                            const dirPath = span.attr('data-path');
                            console.log(dirPath);

                            setSelectDir(dirPath + '/');

                            if (isOpen) {
                              setOpenDirs((prev) =>
                                prev.filter((id) => id !== node.id)
                              );
                            } else {
                              setOpenDirs((prev) => [
                                ...prev,
                                node.id as string,
                              ]);
                            }
                          }}
                        >
                          {isOpen ? (
                            <DirectoryIconOpen />
                          ) : (
                            <DirectoryIconClosed />
                          )}
                          {node.text}
                          {isOpen ? '[-] ' : '[+] '}
                        </span>
                      ) : (
                        <span style={{ display: 'flex' }}>
                          <span
                            style={{
                              minWidth: '16px',
                              minHeight: '16px',
                            }}
                          >
                            <FileIcon />
                          </span>
                          <span
                            data-path={
                              node.data?.path ?? `${node.parent}/${node.text}`
                            }
                            style={{
                              textOverflow: 'ellipsis',
                              maxWidth: '200px',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              color: `${
                                node?.data?.path === sandpack.activeFile
                                  ? `var(--sp-colors-accent)`
                                  : `var(--sp-colors-clickable)`
                              }`,
                              display: 'flex',
                            }}
                            onClick={(e) => {
                              console.log(e);
                              const span = e.target as HTMLElement;
                              const parent = $(span).parents('.list-item');

                              console.log(parent);
                              parent
                                .siblings('.list-item')
                                .children('div')
                                .removeClass('active-item');

                              setSelectDir(null);
                              sandpack.openFile(node?.data?.path as string);
                            }}
                            onDoubleClick={(e) => {
                              console.log(e);
                            }}
                          >
                            {node.text}
                          </span>
                        </span>
                      )}
                      {![entryFile, ...defaultFiles, '/package.json'].includes(
                        node?.data?.path ?? ''
                      ) ? (
                        <button
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                          onClick={async () => {
                            await deleteFile(
                              `${node?.data?.path as string}${
                                node.droppable ? '/' : ''
                              }`
                            );
                          }}
                        >
                          <CloseIcon />
                        </button>
                      ) : (
                        <span
                          style={{
                            color: `var(--sp-colors-warning)`,
                          }}
                        >
                          {node?.data?.path === entryFile ? 'entry' : ''}
                        </span>
                      )}
                    </>
                  ) : null}
                </div>
              );
            }}
          />
        </div>
      </DndProvider>
    </>
  );
};
