import { init } from '../core'
import type { CommandModule } from 'yargs'

const InitCommand: CommandModule = {
  command: 'init',
  describe: 'Create a new monorepo or upgrade an existing repo to monorepo.',
  builder: {},
  handler: async (_argv) => {
    await init()
  },
}

export { InitCommand }
