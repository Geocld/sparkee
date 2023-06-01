import { log } from '../core'
import type { CommandModule } from 'yargs'

const LogCommand: CommandModule = {
  command: 'log',
  describe: 'Only generate changelog.',
  builder: {},
  handler: async (_argv) => {
    await log()
  },
}

export { LogCommand }
