import consola from 'consola'
import chalk from 'chalk'
import jsonfile from 'jsonfile'
import { SPARK_JSON, ROOT_PACKAGE } from '../common/constans'
import { getChangedPackages } from '../utils'

enum Position {
  First,
  Normal,
  Last,
}

function printer(message: string) {
  console.log(message)
}

function resolveDepsTree(packages) {
  let pkgMap = new Map()
  let versionMap = new Map()
  packages.forEach((pkg) => {
    const { name, version, dependencies } = pkg.pkg
    const _deps = new Set()
    versionMap.set(name, version)

    for (const depName in dependencies) {
      if (dependencies[depName].indexOf('workspace') > -1) {
        _deps.add(depName)
      }
    }
    pkgMap.set(name, _deps)
  })

  pkgMap.forEach((dep, key, pmap) => {
    draw(key, '', Position.First, pmap, versionMap)

    printer('\n----------\n')
  })
}

function draw(dependency, prefix, state, pmap, versionMap) {
  const dependencies = pmap.get(dependency)
  const nameChar = dependencies.size > 0 ? '┬' : '─'
  let selfPrefix = `${prefix}${state === Position.Last ? '╰─' : '├─'}${nameChar} `
  let childPrefix = prefix + (state === Position.Last ? '  ' : '│ ')

  if (state === Position.First) {
    selfPrefix = ''
    childPrefix = ''
  }

  printer(`${selfPrefix}${dependency}@${versionMap.get(dependency)}`)

  dependencies.forEach((dep, k, deps) => {
    draw(dep, childPrefix, pmap.get(k).size > 0 ? Position.Normal : Position.Last, pmap, versionMap)
  })
}

// view current versions of packages
async function info(tree: boolean = false) {
  const sparkConfig = await jsonfile.readFile(SPARK_JSON)
  const { singleRepo } = sparkConfig
  if (singleRepo) {
    const { name, version } = await jsonfile.readFile(ROOT_PACKAGE)
    consola.log(
      chalk.bold(`Current package: ${chalk.green(name)} ${chalk.yellow.bold(`v${version}`)}`)
    )
    return
  }

  const packages = await getChangedPackages(true)
  if (tree) {
    resolveDepsTree(packages)
  } else {
    consola.log(
      chalk.bold(
        `Current monorepo packages:\n${packages
          .map(
            ({ name, version }) => `  · ${chalk.green(name)}: ${chalk.yellow.bold(`v${version}`)}`
          )
          .join('\n')}`
      )
    )
  }
}

export default info
