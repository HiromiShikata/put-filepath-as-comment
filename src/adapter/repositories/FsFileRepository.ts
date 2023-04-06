// ./src/adapter/repositories/FsFileRepository.ts
import { FileRepository } from '../../domain/usecases/adapter-interfaces/FileRepository';
import { File } from '../../domain/entities/File';
import * as fs from 'fs-extra';
import * as path from 'path';

export class FsFileRepository implements FileRepository {
  async findFiles(searchPath: string): Promise<File[]> {
    const files: File[] = [];
    await this.scanDirectory(searchPath, files);

    return files;
  }

  private async scanDirectory(dirPath: string, files: File[]): Promise<void> {
    const filePaths = await fs.readdir(dirPath);
    for (const filePath of filePaths) {
      const fullPath = path.join(dirPath, filePath);
      const stat = await fs.stat(fullPath);

      if (stat.isFile()) {
        const content = await fs.readFile(fullPath, 'utf-8');
        files.push({
          path: fullPath,
          content,
        });
      } else if (stat.isDirectory()) {
        await this.scanDirectory(fullPath, files);
      }
    }
  }

  async save(filePath: string, file: File): Promise<void> {
    await fs.writeFile(filePath, file.content, 'utf-8');
  }
}
