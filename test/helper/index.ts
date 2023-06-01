import yargs from 'yargs'
import type { CommandModule } from 'yargs'

export const initYargs = (cmd: CommandModule) => {
  return yargs([])
    .scriptName('sparkee')
    .usage('Usage: $0 <command> [options]')
    .command(cmd)
    .demandCommand(1, 'A command is required. Pass --help to see all available commands and options.')
    .strict()
    .help()
    .version()
    .alias('h', 'help')
    .alias('v', 'version')
}
