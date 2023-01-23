import { join } from 'path'
import { promisify } from 'util'
import fs from 'fs-extra'
import globStandard from 'glob'
import shell from 'shelljs'
import consola from 'consola'
import chalk from 'chalk'
import jsonfile from 'jsonfile'
import readYamlFile from 'read-yaml-file'
import { ROOT, SPARK_JSON, ROOT_PACKAGE, PNPM_WORKSPACE } from '../common/constans'
import type { PnpmWorkspace, SparkeeConfig } from '../types'

const glob = promisify(globStandard);

// Get workspace folder, default is 'packages'
async function getFolders(packages: string[] | string = '*'): Promise<any[]> {
  let folders: string[] = []
  try {
    const pnpmWorkspace = await readYamlFile<PnpmWorkspace>(fs.readFileSync(PNPM_WORKSPACE, 'utf8'))
    let wPackages = pnpmWorkspace.packages
    
    wPackages = wPackages.map(wp => {
      return wp.split('/')[0] + '/*'
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
      if (!(await fs.lstat(folder)).isDirectory()) return null

      const pkg = JSON.parse(await fs.readFile(join(folder, 'package.json'), 'utf-8'))
      if (packages.indexOf(pkg.name) === -1) return null
      return folder
    })
  )

  return _folders.filter(f => f)
}

export function exit() {
  process.exit(1)
}

export function formatStdout(stdout: string): string {
  return stdout.trim().replace('\n', '')
}

// Get all packages
export async function getPkgs(): Promise<object[]> {
  const folders = await getFolders()
  const pkgs = await Promise.all(
    folders.map(async (folder) => {
      if (!(await fs.lstat(folder)).isDirectory()) return null

      const pkg = JSON.parse(await fs.readFile(join(folder, 'package.json'), 'utf-8'))
      return pkg
    })
  )

  return pkgs.filter(p => p)
}

export async function getPkgsProperty(property: string): Promise<any[]> {
  const pkgs = await getPkgs()
  const properties = pkgs.map(pkg => {
    if (!pkg[property]) return null
    return pkg[property]
  })

  return properties.filter(p => p)
}

export async function exec(cmd: string, silent: boolean = true): Promise<{ stdout: string, stderr: string, code: number }> {
  return shell.exec(cmd, { silent })
}

export function step(msg: string) {
  consola.log(chalk.cyan(msg))
}

export async function getChangedPackages(force: boolean = false): Promise<any[]> {  
  let lastTag

  // get packages of spark.json
  if (!fs.existsSync(SPARK_JSON)) {
    consola.error('`spark.json` was not found, please try to run `sparkee init` to init repo.')
    exit()
  }
  const sparkConfig = await jsonfile.readFile(SPARK_JSON)
  const { singleRepo, packages } =  sparkConfig

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
    const pkg = await jsonfile.readFile(ROOT_PACKAGE)
    if (!force && !hasChanges) {
      return []
    }
    return [{
      path: ROOT,
      name: pkg.name,
      version: pkg.version,
      pkg,
    }]
  } else { // monorepo
    // get folders match managed packages
    const folders = await getFolders(packages)

    const pkgs = await Promise.all(
      folders.map(async (folder) => {
        const pkg = JSON.parse(await fs.readFile(join(folder, 'package.json'), 'utf-8'))
        const { stdout: hasChanges } = await exec(`git diff ${lastTag} -- ${join(folder, 'src')} ${join(folder, 'package.json')}`)
        if (force || hasChanges) { // force mode return all packages
          return {
            path: folder,
            name: pkg.name,
            version: pkg.version,
            pkg,
          }
        }
      })
    )
    
    return pkgs.filter(p => p)
  }
}

type Package= {
  name: string,
  path: string,
  version: string,
  pkg: any
}

export async function updateVersions(packageList: Package[]): Promise<any> {
  return Promise.all(
    packageList.map(({ pkg, version, path }) => {
      pkg.version = version
      const content = JSON.stringify(pkg, null, 2) + '\n'
      return fs.writeFile(join(path, 'package.json'), content)
    })
  )
}

export async function runTaskSync(tasks: Function[]): Promise<any[]> {
  for (const task of tasks) {
		if (typeof task !== 'function') {
			throw new TypeError(`Expected task to be a \`Function\`, received \`${typeof task}\``)
		}
	}

	const results:Function[] = []

	for (const task of tasks) {
		results.push(await task()) // eslint-disable-line no-await-in-loop
	}

	return results
}

export async function getSparkeeConfig(): Promise<SparkeeConfig> {
  const config = await jsonfile.readFile(SPARK_JSON) as SparkeeConfig
  return config
}

export async function readRootPKg() {
  const pkg = await jsonfile.readFile(ROOT_PACKAGE)
  return pkg
}
