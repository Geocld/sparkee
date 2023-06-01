import publish from '../core/publish'
import type { CommandOption } from '../types'
import type { CommandModule } from 'yargs'

const PublishCommand: CommandModule = {
  command: 'publish',
  describe: 'Publish packages in the current project.',
  builder: (args) =>
    args
      .option('force', { demand: false })
      .alias('f', 'force')
      .option('noPublish', { demand: false })
      .alias('np', 'noPublish'),
  handler: async (argv) => {
    const force = argv.force as CommandOption
    const noPublish = argv.noPublish as CommandOption
    await publish(force, noPublish)
  },
}

export { PublishCommand }
