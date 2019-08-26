import { Command, CommanderStatic } from 'commander';
import { AbstractCommand } from './abstract.command';
import { Input } from './command.input';

export class CheckCommand extends AbstractCommand {
  public load(program: CommanderStatic): void {
    program
      .command('check')
      .arguments('<path>')
      .description('Check i18n structure')
      .action(async (path: string, command: Command) => {
        const options: Input[] = [];

        const inputs: Input[] = [];
        inputs.push({ name: 'path', value: path });
        await this.action.handle(inputs, options);
      });
  }
}
