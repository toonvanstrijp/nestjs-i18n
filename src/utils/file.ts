import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const lstat = promisify(fs.lstat);
const exists = promisify(fs.exists);

export function mapAsync<T, U>(
  array: T[],
  callbackfn: (value: T, index: number, array: T[]) => Promise<U>,
): Promise<U[]> {
  return Promise.all(array.map(callbackfn));
}

export async function filterAsync<T>(
  array: T[],
  callbackfn: (value: T, index: number, array: T[]) => Promise<boolean>,
): Promise<T[]> {
  const filterMap = await mapAsync(array, callbackfn);
  return array.filter((_, index) => filterMap[index]);
}

export const isDirectory = async (source: string) =>
  (await lstat(source)).isDirectory();

export const getDirectories = async (source: string) => {
  const dirs = await readdir(source);
  return filterAsync(
    dirs.map((name) => path.join(source, name)),
    isDirectory,
  );
};

export const getFiles = async (dirPath: string, pattern: RegExp) => {
  const dirs = await readdir(dirPath, { withFileTypes: true });

  return (
    await filterAsync(dirs, async (f: fs.Dirent | string) => {
      try {
        if (typeof f === 'string') {
          return (await exists(path.join(dirPath, f))) && pattern.test(f);
        } else {
          return f.isFile() && pattern.test(f.name);
        }
      } catch {
        return false;
      }
    })
  ).map((f) => path.join(dirPath, typeof f === 'string' ? f : f.name));
};
