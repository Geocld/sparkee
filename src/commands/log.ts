import type { CommandModule } from 'yargs'
import { log } from '../core'

const LogCommand: CommandModule = {
  command: 'log',
  describe: 'Only generate changelog.',
  builder: {},
  handler: async (_argv) => {
    await log()
  },
}

export { LogCommand }
