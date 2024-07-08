export interface SandpackBundlerFile {
  _hide?: boolean;
  active?: boolean;
  code: string;
  defaultFile?: boolean;
  hidden?: boolean;
  readOnly?: boolean;
}
export type SandpackBundlerFiles = Record<string, SandpackBundlerFile>;

export type SandpackFileMap = {
  key: string;
  value: SandpackBundlerFile;
};

export type Item = {
  children?: Item[];
  data: {
    path: string;
  };
  droppable: boolean;
  id: string;
  parent: string;
  text: string;
};
export type HierarchicalData = Record<number, Item>;
