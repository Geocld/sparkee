import consola from 'consola'
import chalk from 'chalk'
import live from 'shelljs-live'
import { exec, exit, readSpkfile, readRootPKg, getPkgs } from '../utils'
import { promptSelect } from '../common/prompt'

// Run the script of package
async function run() {
  const { singleRepo, moduleManager = 'pnpm' } = await readSpkfile()
  let scripts
  let pickedPackage
  if (singleRepo) {
    const pkg = await readRootPKg()
    scripts = pkg.scripts
  } else {
    const packages = (await getPkgs()) as Record<string, any>
    pickedPackage = await promptSelect('What packages do you want to run?', {
      choices: packages.map((pkg) => pkg.name),
    })
    packages.forEach((pkg) => {
      if (pkg.name === pickedPackage) {
        scripts = pkg.scripts
      }
    })
  }

  if (!scripts) {
    consola.error('scripts of package.json is empty!')
    exit()
  }

  const entriesScripts = Object.entries(scripts)

  const choiceScript = await promptSelect('Please select script:', {
    choices: entriesScripts.map((s) => `${s[0]} -> ${s[1]}`),
  })
  let command = choiceScript.split('->')[0]
  command = command.replace(/\s/g, '')

  if (singleRepo) {
    live([moduleManager, 'run', command])
  } else {
    live(['pnpm', '--filter', pickedPackage, 'run', command])
  }
}

export default run
