import { File } from '../../entities/File';

export interface FileRepository {
  findFiles(path: string): Promise<File[]>;
  save(path: string, file: File): Promise<void>;
}
