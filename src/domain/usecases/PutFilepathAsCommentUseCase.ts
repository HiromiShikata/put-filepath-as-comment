import { FileRepository } from './adapter-interfaces/FileRepository';

export class PutFilepathAsCommentUseCase {
  constructor(private readonly fileRepository: FileRepository) {}
  run = async (path: string) => {
    const files = await this.fileRepository.findFiles(path);

    for (const file of files) {
      const firstLine = file.content.split('\n')[0];
      const commentPattern = /\/\/\s*(.+)/;
      const match = firstLine.match(commentPattern);

      if (match && match[1] === file.path) {
        continue;
      }

      const updatedContent = match
        ? file.content.replace(commentPattern, `// ${file.path}`)
        : `// ${file.path}\n${file.content}`;

      await this.fileRepository.save(file.path, {
        ...file,
        content: updatedContent,
      });
    }
  };
}
