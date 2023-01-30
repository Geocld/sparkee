#!/usr/bin/env node

import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import init from './core/init'
import run from './core/run'
import publish from './core/publish'
import info from './core/info'

type Option = boolean | undefined

yargs(hideBin(process.argv))
  .usage('Usage: $0 <command> [options]')
  .command(
    'init',
    'Create a new monorepo or upgrade an existing repo to monorepo.',
    () => {},
    (argv) => {
      init()
    }
  )
  .command(
    'info',
    'Prints information about the monorepo.',
    (args) => {
      args.option('tree', { demand: false }).alias('t', 'tree')
    },
    (argv) => {
      const tree = argv.tree as Option
      info(tree)
    }
  )
  .command(
    'run',
    'Run the script of package.',
    () => {},
    (argv) => {
      run()
    }
  )
  .command(
    'publish',
    'Publish packages in the current project.',
    (args) => {
      args.option('force', { demand: false }).alias('f', 'force')
      args.option('noPublish', { demand: false }).alias('np', 'noPublish')
    },
    (argv) => {
      const force = argv.force as Option
      const noPublish = argv.noPublish as Option
      publish(force, noPublish)
    }
  )
  .demandCommand(1, 'A command is required. Pass --help to see all available commands and options.')
  .strict()
  .alias('h', 'help')
  .alias('v', 'version')
  .parse()
