import chalk from 'chalk';
import { CommanderStatic } from 'commander';
import { CheckCommand } from './check.command';
import { CheckAction } from '../actions/check.action';

export class CommandLoader {
  public static load(program: CommanderStatic): void {
    new CheckCommand(new CheckAction()).load(program);

    this.handleInvalidCommand(program);
  }

  private static handleInvalidCommand(program: CommanderStatic) {
    program.on('command:*', () => {
      console.error(chalk.red('Invalid command: %s'), program.args.join(' '));
      console.log('See --help for a list of available commands.');
      process.exit(1);
    });
  }
}
