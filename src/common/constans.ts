import { join } from 'node:path'
import { cwd } from 'node:process'

export const ROOT = cwd()

function pathResolve(p: string): string {
  return join(ROOT, p)
}

export const CLIFF_TOML_NAME = 'sparkee-cliff.toml'
export const SPARK_JSON = pathResolve('spark.json')
export const PACKAGES = pathResolve('packages')
export const ROOT_PACKAGE = pathResolve('package.json')
export const PNPM_WORKSPACE = pathResolve('pnpm-workspace.yaml')
export const LOCAL_CLIFF_TOML = pathResolve(CLIFF_TOML_NAME)
export const DEFAULT_MONOREPO_CLIFF_TOML = join(__dirname, '..', '..', 'template', 'sparkee-cliff-monorepo.toml')
export const DEFAULT_SINGLEREPO_CLIFF_TOML = join(__dirname, '..', '..', 'template', 'sparkee-cliff-singlerepo.toml')
