import type { CommandModule } from 'yargs'
import { info } from '../core'
import type { CommandOption } from '../types'

const InfoCommand: CommandModule = {
  command: 'info',
  describe: 'Prints information about the monorepo.',
  builder: (args) => args.option('tree', { demand: false }).alias('t', 'tree'),
  handler: async (argv) => {
    const tree = argv.tree as CommandOption
    await info(tree ?? tree)
  },
}

export { InfoCommand }
