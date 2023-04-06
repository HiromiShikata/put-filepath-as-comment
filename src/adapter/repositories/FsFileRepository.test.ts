// ./src/adapter/repositories/FsFileRepository.test.ts
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import { FsFileRepository } from './FsFileRepository';

describe('FsFileRepository', () => {
  const repository = new FsFileRepository();
  let testDir: string;

  beforeEach(async () => {
    testDir = await fs.mkdtemp(
      path.join(os.tmpdir(), 'fs-file-repository-test-'),
    );
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  it('should find files in the specified path', async () => {
    const filePath1 = path.join(testDir, 'file1.ts');
    const filePath2 = path.join(testDir, 'file2.ts');
    await fs.writeFile(filePath1, 'const a = 1;', 'utf-8');
    await fs.writeFile(filePath2, 'const b = 2;', 'utf-8');

    const files = await repository.findFiles(testDir);

    expect(files).toHaveLength(2);
    expect(files.map((file) => file.path).sort()).toEqual(
      [filePath1, filePath2].sort(),
    );
  });

  it('should save a file with the specified content', async () => {
    const filePath = path.join(testDir, 'test-file.ts');
    const content = 'const a = 1;\nconsole.log(a);';

    await repository.save(filePath, { path: filePath, content });

    const savedContent = await fs.readFile(filePath, 'utf-8');
    expect(savedContent).toBe(content);
  });
  it('should find files in the specified path including subdirectories', async () => {
    const subDir1 = path.join(testDir, 'subdir1');
    const subDir2 = path.join(testDir, 'subdir2');
    await fs.mkdir(subDir1);
    await fs.mkdir(subDir2);

    const filePath1 = path.join(testDir, 'file1.ts');
    const filePath2 = path.join(subDir1, 'file2.ts');
    const filePath3 = path.join(subDir2, 'file3.ts');
    await fs.writeFile(filePath1, 'const a = 1;', 'utf-8');
    await fs.writeFile(filePath2, 'const b = 2;', 'utf-8');
    await fs.writeFile(filePath3, 'const c = 3;', 'utf-8');

    const files = await repository.findFiles(testDir);

    expect(files).toHaveLength(3);
    expect(files.map((file) => file.path).sort()).toEqual(
      [filePath1, filePath2, filePath3].sort(),
    );
  });
});
