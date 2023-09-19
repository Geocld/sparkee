import { readFile, writeFile } from 'node:fs/promises'
import chalk from 'chalk'
import consola from 'consola'
import { DEFAULT_MONOREPO_CLIFF_TOML, DEFAULT_SINGLEREPO_CLIFF_TOML, LOCAL_CLIFF_TOML } from '../common/constans'
import { getSparkeeConfig } from '../utils'

async function initCliff() {
  const { singleRepo } = await getSparkeeConfig()
  const configFile = singleRepo ? DEFAULT_SINGLEREPO_CLIFF_TOML : DEFAULT_MONOREPO_CLIFF_TOML
  const content = await readFile(configFile, 'utf-8')
  await writeFile(LOCAL_CLIFF_TOML, content)
  consola.success(chalk.green(`Generate ${LOCAL_CLIFF_TOML}`))
}

export { initCliff }
