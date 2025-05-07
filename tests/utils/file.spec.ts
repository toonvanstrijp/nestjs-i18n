import { join } from 'node:path';

import { exists } from '../../src/utils/file';

describe('file util tests', () => {
    describe('exists() tests', () => {
        it('should return true if the file exists', async () => {
            await expect(exists(join(__dirname, 'test-file.txt'))).resolves.toBe(true);
        });

        it('should return false if the file does not exist', async () => {
            await expect(exists(join(__dirname, 'not-test-file.txt'))).resolves.toBe(false);
        });
    });
});
