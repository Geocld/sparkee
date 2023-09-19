import chalk from 'chalk'
import consola from 'consola'
import type { WorkspacePackages } from '../types'
import { exit, getChangedPackages, getPackageJson, getSparkeeConfig } from '../utils'

enum Position {
  First,
  Normal,
  Last,
}

function printer(message: string): void {
  console.log(message)
}

function resolveDepsTree(packages: WorkspacePackages): void {
  const pkgMap = new Map<string, Set<string>>()
  const versionMap = new Map<string, string | undefined>()

  packages.forEach(({ pkg }) => {
    if (!pkg) {
      consola.error('Packages can not be empty!')
      return exit()
    }

    const { name, version, dependencies } = pkg
    const _deps = new Set<string>()

    versionMap.set(name, version)

    for (const depName in dependencies) {
      if (dependencies[depName].indexOf('workspace') > -1) {
        _deps.add(depName)
      }
    }
    pkgMap.set(name, _deps)
  })

  pkgMap.forEach((_dep, key, pmap) => {
    draw(key, '', Position.First, pmap, versionMap)

    printer('\n----------\n')
  })
}

function draw(
  dependency: string,
  prefix: string,
  state: Position,
  pmap: Map<string, Set<string>>,
  versionMap: Map<string, string | undefined>
) {
  const dependencies = pmap.get(dependency)
  if (!dependencies) return
  const nameChar = dependencies && dependencies.size > 0 ? '┬' : '─'

  let selfPrefix = `${prefix}${state === Position.Last ? '╰─' : '├─'}${nameChar} `
  let childPrefix = prefix + (state === Position.Last ? '  ' : '│ ')

  if (state === Position.First) {
    selfPrefix = ''
    childPrefix = ''
  }

  printer(`${selfPrefix}${dependency}@${versionMap.get(dependency)}`)

  dependencies?.forEach((dep, k, _deps) => {
    draw(dep, childPrefix, pmap.get(k) && pmap.get(k)!.size > 0 ? Position.Normal : Position.Last, pmap, versionMap)
  })
}

// view current versions of packages
async function info(tree: boolean = false): Promise<void> {
  const { singleRepo } = await getSparkeeConfig()

  if (singleRepo) {
    const { name, version } = await getPackageJson()
    consola.log(chalk.bold(`Current package: ${chalk.green(name)} ${chalk.yellow.bold(`v${version}`)}`))
    return
  }

  const packages = await getChangedPackages(true)
  if (tree) {
    resolveDepsTree(packages)
  } else {
    consola.log(
      chalk.bold(
        `Current monorepo packages:\n${packages
          .map(({ name, version }) => `  · ${chalk.green(name)}: ${chalk.yellow.bold(`v${version}`)}`)
          .join('\n')}`
      )
    )
  }
}

export { info }
