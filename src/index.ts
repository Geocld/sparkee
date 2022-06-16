import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import init from './core/init'

yargs(hideBin(process.argv))
  .usage('Usage: $0 <command> [options]')
  .command('init', 'Create a new monorepo or upgrade an existing repo to monorepo.', () => {}, (argv) => {
    init()
  })
  .command('info', 'Prints information about the monorepo.', () => {}, (argv) => {
    console.log('info')
  })
  .command('publish', 'Publish packages in the current project.', () => {}, (argv) => {
    console.log('publish')
  })
  .demandCommand(1, 'A command is required. Pass --help to see all available commands and options.')
  .strict()
  .alias('h', 'help')
  .alias('v', 'version')
  .parse()