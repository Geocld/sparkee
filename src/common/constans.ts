import path from 'path'

export const ROOT = process.cwd()

function pathResolve(p: string): string {
  return path.join(ROOT, p)
}

export const CLIFF_TOML_NAME = 'sparkee-cliff.toml'
export const SPARK_JSON = pathResolve('spark.json')
export const PACKAGES = pathResolve('packages')
export const ROOT_PACKAGE = pathResolve('package.json')
export const PNPM_WORKSPACE = pathResolve('pnpm-workspace.yaml')
export const LOCAL_CLIFF_TOML = pathResolve(CLIFF_TOML_NAME)
export const DEFAULT_MONOREPO_CLIFF_TOML = path.join(__dirname, '..', '..', 'template', 'sparkee-cliff-monorepo.toml')
export const DEFAULT_SINGLEREPO_CLIFF_TOML = path.join(
  __dirname,
  '..',
  '..',
  'template',
  'sparkee-cliff-singlerepo.toml'
)
