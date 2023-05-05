import initCliff from '../core/init-cliff'
import type { CommandModule } from 'yargs'

const InitCliffCommand: CommandModule = {
  command: 'init-cliff',
  describe: 'Gererate config file of CHANGELOG.md.',
  builder: {},
  handler: async (_argv) => {
    await initCliff()
  },
}

export { InitCliffCommand }
