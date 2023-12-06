import type { CommandModule } from 'yargs'
import { publish } from '../core'
import type { CommandOption, PublishArgs } from '../types'

const PublishCommand: CommandModule = {
  command: 'publish',
  describe: 'Publish packages in the current project.',
  builder: (args) =>
    args
      .option('force', { demand: false }) // No check package change if or not
      .alias('f', 'force')
      .option('noPublish', { demand: false }) // Only generate changelog and tag, dont publish to npm
      .alias('np', 'noPublish')
      .option('noCheckCommit', { demand: false }) // No check commit
      .alias('ncm', 'noCheckCommit')
      .option('package', { demand: false }) // Prepublish package name
      .alias('pkg', 'package')
      .option('ver', { demand: false }) // Prepublish package version
      .alias('ver', 'ver'),
  handler: async (argv) => {
    const force = argv.force as CommandOption
    const noPublish = argv.noPublish as CommandOption
    const noCheckCommit = argv.noCheckCommit as CommandOption
    const pkgName = argv.package as string
    const pkgVersion = argv.ver as string
    const args: PublishArgs = {
      force,
      noPublish,
      noCheckCommit,
      pkgName,
      pkgVersion,
    }
    await publish(args)
  },
}

export { PublishCommand }
