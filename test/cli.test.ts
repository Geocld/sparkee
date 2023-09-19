import { describe, expect, it } from 'vitest'
import type { Arguments } from 'yargs'
import pkgJson from '../package.json'
import { InfoCommand } from '../src/commands'
import { initYargs } from './helper'

describe('Commands: --help & --version', () => {
  it('should print help message', async () => {
    const parser = initYargs(InfoCommand)

    const output = await new Promise((resolve) => {
      parser.parse('--help', (err: unknown, _argv: Arguments, output: string) => {
        if (err) {
          resolve(err)
        }
        resolve(output)
      })
    })

    expect(output).toContain('Show help')
  })

  it('should print version message', async () => {
    const parser = initYargs(InfoCommand)

    const output = await new Promise((resolve) => {
      parser.parse('--version', (err: unknown, _argv: Arguments, output: string) => {
        if (err) {
          resolve(err)
        }
        resolve(output)
      })
    })

    expect(output).toContain(pkgJson.version)
  })
})
