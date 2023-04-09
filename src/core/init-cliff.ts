import { DEFAULT_MONOREPO_CLIFF_TOML, DEFAULT_SINGLEREPO_CLIFF_TOML, LOCAL_CLIFF_TOML, ROOT } from '../common/constans'
import { getSparkeeConfig } from '../utils'
import chalk from 'chalk'
import consola from 'consola'
import fs from 'fs-extra'

async function initCliff() {
  const { singleRepo } = await getSparkeeConfig()
  const configFile = singleRepo ? DEFAULT_SINGLEREPO_CLIFF_TOML : DEFAULT_MONOREPO_CLIFF_TOML
  const content = fs.readFileSync(configFile, 'utf-8')
  fs.writeFileSync(LOCAL_CLIFF_TOML, content)
  consola.success(chalk.green(`Generate ${LOCAL_CLIFF_TOML}`))
}

export default initCliff
