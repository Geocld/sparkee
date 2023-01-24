import consola from 'consola'
import live from 'shelljs-live'
import { exit, getPackageJson, getSparkeeConfig, getWorkspacePackages } from '../utils'
import { promptSelect } from '../common/prompt'
import type { ScriptsMap, WorkspacePackages } from '../types'

// Run the script of package
async function run() {
  const { singleRepo, moduleManager = 'pnpm' } = await getSparkeeConfig()
  
  let scripts: ScriptsMap = {}
  let pickedPackage

  if (singleRepo) {
    const pkg = await getPackageJson()
    scripts = pkg.scripts || {}
  } else {
    const packages = await getWorkspacePackages() as WorkspacePackages
    pickedPackage = await promptSelect('What packages do you want to run?', {
      choices: packages.map(pkg => pkg.name)
    })
    packages.forEach(pkg => {
      if (pkg.name === pickedPackage) {
        scripts = pkg.scripts || {}
      }
    })
  }

  if (Object.keys(scripts).length === 0 && scripts.constructor === Object) {
    consola.error('scripts of package.json is empty!')
    exit()
  }

  const entriesScripts = Object.entries(scripts)

  const choiceScript = await promptSelect(`Please select script:`, {
    choices: entriesScripts.map(s => `${s[0]} -> ${s[1]}`)
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
