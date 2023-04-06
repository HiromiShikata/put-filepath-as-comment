import { execSync } from 'child_process';
import {existsSync, mkdirSync, readFileSync, rmdirSync, writeFileSync} from 'fs-extra';

describe('commander program', () => {
  it('should output file contents', () => {
    if(existsSync('./tmp/testdata')){
      rmdirSync('./tmp/testdata', { recursive: true });
    }
    mkdirSync('./tmp/testdata/src/domain/entities', { recursive: true });
    writeFileSync(
      './tmp/testdata/src/domain/entities/Group.ts',
      `export class Group {
  id: string
  name: string
}`,
    );
    const expectedContent = `// tmp/testdata/src/domain/entities/Group.ts
export class Group {
  id: string
  name: string
}`;

    execSync(
      'npx ts-node ./src/adapter/entry-points/cli/index.ts ./tmp/testdata/src',
    );
    const contents = readFileSync(
      './tmp/testdata/src/domain/entities/Group.ts',
      'utf-8',
    );
    expect(contents).toBe(expectedContent);

    execSync(
      'npx ts-node ./src/adapter/entry-points/cli/index.ts ./tmp/testdata/src',
    );
    const contentsSecondTime = readFileSync(
      './tmp/testdata/src/domain/entities/Group.ts',
      'utf-8',
    );
    expect(contentsSecondTime).toBe(expectedContent);
  });
});
