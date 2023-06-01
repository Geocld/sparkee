import { PNPM_WORKSPACE, ROOT, ROOT_PACKAGE, SPARK_JSON } from '../common/constans'
import type { PackageJson, PnpmWorkspace, SparkeeConfig, WorkspacePackages } from '../types'
import chalk from 'chalk'
import consola from 'consola'
import globStandard from 'glob'
import jsonfile from 'jsonfile'
import { stat, writeFile } from 'node:fs/promises'
import { join } from 'path'
import readYamlFile from 'read-yaml-file'
import shell from 'shelljs'
import { promisify } from 'util'

const glob = promisify(globStandard)

// https://github.com/microsoft/TypeScript/issues/16069#issuecomment-369374214
export function isNotNullOrUndefined<T extends Object>(input: null | undefined | T): input is T {
  return input != null
}

export function getFirstRegexGroup(regexp: RegExp, url: string) {
  return Array.from(url.matchAll(regexp), (m) => m[1])
}

export const fileExists = async (path: string) => !!(await stat(path).catch((_e: unknown) => false))

// Get workspace folder, default is 'packages'
async function getWorkspaceFolders(packages: string[] | string = '*'): Promise<string[]> {
  let folders: string[] = []

  try {
    const pnpmWorkspace = await readYamlFile<PnpmWorkspace>(PNPM_WORKSPACE)
    let wPackages = pnpmWorkspace.packages

    wPackages = wPackages.map((wp) => {
      return `${wp.split('/')[0]}/*`
    })

    await Promise.all(
      wPackages.map(async (wp) => {
        const wFolders = await glob(wp)
        folders = folders.concat(wFolders)
      })
    )
  } catch {
    folders = await glob('packages/*')
  }

  if (packages === '*') {
    return folders
  }

  // All packages match the packages of (spark.json -> packages)
  const _folders = await Promise.all(
    folders.map(async (folder) => {
      if (!(await stat(folder)).isDirectory()) return null

      const pkg = await getPackageJson(folder)
      if (packages.indexOf(pkg.name) === -1) return null
      return folder
    })
  )

  return _folders.filter(isNotNullOrUndefined)
}

export function exit() {
  process.exit(1)
}

export function formatStdout(stdout: string): string {
  return stdout.trim().replace('\n', '')
}

// Get all workspace packages
export async function getWorkspacePackages(): Promise<PackageJson[]> {
  const folders: string[] = await getWorkspaceFolders()

  // If no workspace folder is found, cause of missing configuration, return root package.json
  if (!folders.length) {
    const pkg = await getPackageJson()
    return [pkg]
  }

  const pkgs = await Promise.all(
    folders.map(async (folder) => {
      if (!(await stat(folder)).isDirectory()) return null

      const pkg = await getPackageJson(folder)
      return pkg
    })
  )

  return pkgs.filter(isNotNullOrUndefined)
}

// Get a property from all workspace packages
export async function getPkgsProperty(property: string): Promise<Array<keyof PackageJson>> {
  const pkgs = await getWorkspacePackages()
  const properties: Array<keyof PackageJson> = pkgs.map((pkg) => {
    if (!pkg[property]) return null
    return pkg[property]
  })

  return properties.filter((p) => p)
}

export async function exec(
  cmd: string,
  silent: boolean = true
): Promise<{ stdout: string; stderr: string; code: number }> {
  return shell.exec(cmd, { silent })
}

export function step(msg: string) {
  consola.log(chalk.cyan(msg))
}

export async function getChangedPackages(force: boolean = false): Promise<WorkspacePackages> {
  let lastTag: string

  // get packages of spark.json
  if (!(await fileExists(SPARK_JSON))) {
    consola.error('`spark.json` was not found, please try to run `sparkee init` to init repo.')
    exit()
  }
  const sparkConfig = await getSparkeeConfig()
  const { singleRepo, packages } = sparkConfig

  const { stdout: tag, stderr } = await exec('git describe --tags --abbrev=0')

  if (stderr) {
    !force && consola.warn(`Couldn't get the last tag, using first commit...`)
    const { stdout, stderr } = await exec('git rev-list --max-parents=0 HEAD')
    lastTag = formatStdout(stdout)
  } else {
    lastTag = formatStdout(tag)
  }

  if (singleRepo) {
    consola.warn('You will publish as singleRepo.')
    const { stdout: hasChanges } = await exec(`git diff ${lastTag}`)
    const pkg = await getPackageJson()
    if (!(force || hasChanges)) {
      return []
    }
    return [
      {
        path: ROOT,
        name: pkg.name,
        version: pkg.version,
        pkg,
      },
    ]
  } else {
    // monorepo
    // get folders match managed packages
    const folders: string[] = await getWorkspaceFolders(packages)

    const pkgs = await Promise.all(
      folders.map(async (folder) => {
        const pkg = await getPackageJson(folder)
        const { stdout: hasChanges } = await exec(
          `git diff ${lastTag} -- ${join(folder, 'src')} ${join(folder, 'package.json')}`
        )
        if (force || hasChanges) {
          // force mode return all packages
          return {
            path: folder,
            name: pkg.name,
            version: pkg.version,
            pkg,
          }
        }
      })
    )

    return pkgs.filter(isNotNullOrUndefined)
  }
}

export async function updateVersions(packageList: WorkspacePackages): Promise<void[]> {
  return Promise.all(
    packageList.map(async ({ pkg, version, path }) => {
      if (!pkg) {
        consola.error('Packages can not be empty!')
        return exit()
      }

      pkg.version = version
      const content = JSON.stringify(pkg, null, 2) + '\n'

      return await writeFile(join(path, 'package.json'), content, { encoding: 'utf8' })
    })
  )
}

export async function runTaskSync(tasks: Function[]): Promise<any[]> {
  for (const task of tasks) {
    if (typeof task !== 'function') {
      throw new TypeError(`Expected task to be a \`Function\`, received \`${typeof task}\``)
    }
  }

  const results: Function[] = []

  for (const task of tasks) {
    results.push(await task()) // eslint-disable-line no-await-in-loop
  }

  return results
}

export async function getSparkeeConfig(): Promise<SparkeeConfig> {
  const config = (await jsonfile.readFile(SPARK_JSON)) as SparkeeConfig
  return config
}

export async function getPackageJson(packageJsonPath?: string): Promise<PackageJson> {
  const pkg = (await jsonfile.readFile(
    packageJsonPath ? join(packageJsonPath, 'package.json') : ROOT_PACKAGE
  )) as PackageJson
  return pkg
}
