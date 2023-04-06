import { FileRepository } from './adapter-interfaces/FileRepository';
import { File } from '../entities/File';
import { PutFilepathAsCommentUseCase } from './PutFilepathAsCommentUseCase';

describe('PutFilepathAsCommentUseCase', () => {
  it('should add the file path as a comment on the first line', async () => {
    const { fileRepository, useCase } = createUseCaseAndMockRepositories();
    fileRepository.findFiles = jest.fn<Promise<File[]>, [string]>(
      async (_path: string) => {
        return [
          {
            path: './file1.ts',
            content: 'const a = 1;\nconsole.log(a);',
          },
          {
            path: './file2.ts',
            content: 'const b = 2;\nconsole.log(b);',
          },
        ];
      },
    );

    await useCase.run('./');

    expect(fileRepository.findFiles).toHaveBeenCalledWith('./');
    expect(fileRepository.save).toHaveBeenCalledTimes(2);
    expect(fileRepository.save).toHaveBeenCalledWith('./file1.ts', {
      path: './file1.ts',
      content: '// ./file1.ts\nconst a = 1;\nconsole.log(a);',
    });
    expect(fileRepository.save).toHaveBeenCalledWith('./file2.ts', {
      path: './file2.ts',
      content: '// ./file2.ts\nconst b = 2;\nconsole.log(b);',
    });
  });

  it('should not change the content if the file path is already in the comment on the first line', async () => {
    const { fileRepository, useCase } = createUseCaseAndMockRepositories();
    fileRepository.findFiles = jest.fn<Promise<File[]>, [string]>(
      async (_path: string) => {
        return [
          {
            path: './file1.ts',
            content: '// ./file1.ts\nconst a = 1;\nconsole.log(a);',
          },
        ];
      },
    );

    await useCase.run('./');

    expect(fileRepository.findFiles).toHaveBeenCalledWith('./');
    expect(fileRepository.save).toHaveBeenCalledTimes(0);
  });

  it("should update the file path in the comment on the first line if it's different", async () => {
    const { fileRepository, useCase } = createUseCaseAndMockRepositories();
    fileRepository.findFiles = jest.fn<Promise<File[]>, [string]>(
      async (_path: string) => {
        return [
          {
            path: './file1.ts',
            content: '// ./old-file1.ts\nconst a = 1;\nconsole.log(a);',
          },
        ];
      },
    );
    await useCase.run('./');

    expect(fileRepository.findFiles).toHaveBeenCalledWith('./');
    expect(fileRepository.save).toHaveBeenCalledTimes(1);
    expect(fileRepository.save).toHaveBeenCalledWith('./file1.ts', {
      path: './file1.ts',
      content: '// ./file1.ts\nconst a = 1;\nconsole.log(a);',
    });
  });
  const createUseCaseAndMockRepositories = () => {
    const fileRepository = createMockFileRepository();
    const useCase = new PutFilepathAsCommentUseCase(fileRepository);
    return {
      fileRepository,
      useCase,
    };
  };

  const createMockFileRepository = () => {
    const repository: FileRepository = {
      findFiles: async (_path: string): Promise<File[]> => {
        return [];
      },
      save: async (_path: string, _file: File) => {
        return Promise.resolve();
      },
    };
    return {
      findFiles: jest.fn((path: string) => repository.findFiles(path)),
      save: jest.fn((path: string, file: File) => repository.save(path, file)),
    };
  };
});
