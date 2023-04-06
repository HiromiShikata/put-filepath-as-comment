# put-filepath-as-comment

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/HiromiShikata/put-filepath-as-comment/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/HiromiShikata/put-filepath-as-comment/tree/main)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

`put-filepath-as-comment` is a simple npm module that helps you quickly and easily add file paths as comments to your code. It is particularly useful to communicate with ChatGPT.

## Usage

To add a file path as a comment, run the following command:

```bash
npx put-filepath-as-comment <file path>
```

For example:

```bash
npx put-filepath-as-comment ./tmp/testdata/src
```

## End-to-End Testing

```javascript
import { execSync } from 'child_process';
import { mkdirSync, readFileSync, rmdirSync, writeFileSync } from 'fs-extra';

describe('commander program', () => {
  it('should output file contents', () => {
    rmdirSync('./tmp/testdata', { recursive: true });
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
```

This example demonstrates how `put-filepath-as-comment` can be used to add a file path comment to the file.

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](./CONTRIBUTING.md) file for guidelines on how to contribute to this project.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE.md) file for details.
