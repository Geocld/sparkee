import path from 'path'

export const ROOT = process.cwd()

function pathResolve(p: string): string {
  return path.join(ROOT, p)
}

export const SPARK_JSON = pathResolve('spark.json')
export const PACKAGES = pathResolve('packages')
export const ROOT_PACKAGE = pathResolve('package.json')