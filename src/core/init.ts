import fs from 'fs-extra'
import consola from 'consola'
import jsonfile from 'jsonfile'
import { ROOT, SPARK_JSON, PACKAGES } from '../common/constans'
import { promptConfirm, promptCheckbox } from '../common/prompt'
import { getPkgs, getPkgsProperty, exit } from '../utils'

// monorepo init and spark.json init
async function init() {

  const isInited = await fs.exists(SPARK_JSON)
  if (isInited) {
    const isOverride = await promptConfirm('This project has been initialized, do you need to override spark.json?')
    if (!isOverride) {
      exit()
    }
  }
  const answer = await promptConfirm('Do you need sparkee to manage all projects of packages folder?')

  if (!answer) { // not all packages
    // get all packages
    const pkgs = await getPkgs()
    const pkgNames = await getPkgsProperty('name')

    if (!pkgNames.length) {
      consola.error('Packages can not be empty!')
      exit()
    }

    const choice = await promptCheckbox('What packages do you want to manage?', {
      choices: pkgNames.map(pkg => {
        return {
          value: pkg,
          name: pkg
        }
      })
    })

    if (!choice.length) {
      consola.error('Packages can not be empty!')
      exit()
    }
    
    jsonfile.writeFileSync('spark.json', {
      packages: choice
    }, { spaces: 2, EOL: '\r\n' })

  } else { // select all
    jsonfile.writeFileSync('spark.json', {
      packages: '*'
    }, { spaces: 2, EOL: '\r\n' })
  }

  consola.success('Sparkee init successful.')
}

export default init