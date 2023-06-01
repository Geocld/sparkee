import { run } from '../core'
import type { CommandModule } from 'yargs'

const RunCommand: CommandModule = {
  command: 'run',
  describe: 'Run the script of package.',
  builder: {},
  handler: async (_argv) => {
    await run()
  },
}

export { RunCommand }
