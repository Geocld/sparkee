import { join } from 'path'
import fs from 'fs-extra'
import glob from 'glob'
import shell from 'shelljs'
import consola from 'consola'
import chalk from 'chalk'
import jsonfile from 'jsonfile'
import { ROOT, PACKAGES, SPARK_JSON } from '../common/constans'

async function getFolders(packages: string[] | string = '*'): Promise<string[]> {
  let folders = await glob.sync('packages/*')
  if (packages === '*') {
    return folders
  }

  const _folders: string[] = await Promise.all(
    folders.map(async (folder) => {
      if (!(await fs.lstat(folder)).isDirectory()) return null

      const pkg = JSON.parse(await fs.readFile(join(folder, 'package.json')))
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

export async function getPkgs(): Promise<object[]> {
  const folders = await getFolders()
  const pkgs = await Promise.all(
    folders.map(async (folder) => {
      if (!(await fs.lstat(folder)).isDirectory()) return null

      const pkg = JSON.parse(await fs.readFile(join(folder, 'package.json')))
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

export function exec(cmd: string, silent: boolean = true): Promise<{ stdout: string, stderr: string, code: number }> {
  return shell.exec(cmd, { silent })
}

export function step(msg: string) {
  consola.log(chalk.cyan(msg))
}

export async function getChangedPackages(force: boolean = false): Promise<any[]> {
  let lastTag

  const { stdout: tag, stderr } = await exec('git describe --tags --abbrev=0')

  if (stderr) {
    !force && consola.warn(`Couldn't get the last tag, using first commit...`)
    const { stdout, stderr } = await exec('git rev-list --max-parents=0 HEAD')
    lastTag = formatStdout(stdout)
  } else {
    lastTag = formatStdout(tag)
  }

  // get packages of spark.json
  const sparkConfig = await jsonfile.readFile(SPARK_JSON)
  const { packages } =  sparkConfig
  
  // get folders match managed packages
  const folders = await getFolders(packages)

  const pkgs = await Promise.all(
    folders.map(async (folder) => {
      const pkg = JSON.parse(await fs.readFile(join(folder, 'package.json')))
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