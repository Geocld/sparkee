#!/usr/bin/env node

import { hideBin } from 'yargs/helpers'
import yargs from 'yargs/yargs'

import { InfoCommand } from './commands'
import { InitCommand } from './commands'
import { InitCliffCommand } from './commands'
import { LogCommand } from './commands'
import { PublishCommand } from './commands'
import { RunCommand } from './commands'

yargs(hideBin(process.argv))
  .scriptName('sparkee')
  .usage('Usage: $0 <command> [options]')
  .command(InitCommand)
  .command(InitCliffCommand)
  .command(InfoCommand)
  .command(RunCommand)
  .command(LogCommand)
  .command(PublishCommand)
  .demandCommand(1, 'A command is required. Pass --help to see all available commands and options.')
  .strict()
  .help()
  .version()
  .alias('h', 'help')
  .alias('v', 'version').argv
