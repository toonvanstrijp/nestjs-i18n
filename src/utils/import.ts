import { pathToFileURL } from 'url';
import { platform } from 'os';

async function dynamicImportProvider(filePath: string) {
  return await Function('return filePath => import(filePath)')()(filePath);
}

export async function dynamicImport<T = any>(id: string): Promise<T> {
  if (id.endsWith('.json')) {
    return require(id);
  }

  if (platform() === 'win32') {
    try {
      id = pathToFileURL(id).toString();
    } catch {
      // ignore
    }
  }

  return dynamicImportProvider(id);
}
