#!/usr/bin/env node
import { Command } from 'commander';
import { PutFilepathAsCommentUseCase } from '../../../domain/usecases/PutFilepathAsCommentUseCase';
import { FsFileRepository } from '../../repositories/FsFileRepository';

const program = new Command();
program
  .argument('<path>', 'Path of target directory')
  .name('Put file path to files')
  .description('Make sharing file contents to ChatGPT easier')
  .action(async (path: string) => {
    const useCase = new PutFilepathAsCommentUseCase(new FsFileRepository());
    const res = await useCase.run(path);
    console.log(JSON.stringify(res));
  });
if (process.argv) {
  program.parse(process.argv);
}
