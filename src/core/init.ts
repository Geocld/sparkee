import fs from 'fs-extra'
import consola from 'consola'
import jsonfile from 'jsonfile'
import { ROOT, SPARK_JSON, PACKAGES } from '../common/constans'
import { promptConfirm, promptCheckbox, promptSelect } from '../common/prompt'
import { getPkgs, getPkgsProperty, exit } from '../utils'

enum RepoType {
  SINGLEREPO = 'singleRepo',
  MONOREPO = 'monorepo'
}

// monorepo init and spark.json init
async function init() {

  const isInited = await fs.exists(SPARK_JSON)
  if (isInited) {
    const isOverride = await promptConfirm('This project has been initialized, do you need to override spark.json?')
    if (!isOverride) {
      exit()
    }
  }

  const repoType = await promptSelect(`Please select repo type:`, {
    choices: [RepoType.MONOREPO, RepoType.SINGLEREPO]
  })

  if (repoType === RepoType.SINGLEREPO) {
    jsonfile.writeFileSync('spark.json', {
      singleRepo: true,
      moduleManager: 'npm'
    }, { spaces: 2, EOL: '\r\n' })

    consola.success('Sparkee init as singleRepo successful.')
    return
  }
  
  const answer = await promptConfirm('Do you need sparkee to manage all projects of packages folder?')

  if (!answer) { // not all packages
    // get all packages
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
      packages: choice,
      moduleManager: 'pnpm'
    }, { spaces: 2, EOL: '\r\n' })

  } else { // select all
    jsonfile.writeFileSync('spark.json', {
      packages: '*',
      moduleManager: 'pnpm'
    }, { spaces: 2, EOL: '\r\n' })
  }

  consola.success('Sparkee init as monorepo successful.')
}

export default init