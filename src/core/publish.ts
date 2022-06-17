import consola from 'consola'
import { promptCheckbox } from '../common/prompt'
import { exec, exit, getChangedPackages } from '../utils'

// publish package, you can publish all or publish single package.
async function publish() {
  console.log('publish')
  
  const changedPackages = await getChangedPackages()
  if (!changedPackages.length) {
    consola.warn('No packages have changed since last release')
    exit()
  }

  const choice = await promptCheckbox('What packages do you want to publish?', {
    choices: changedPackages.map(pkg => pkg.name)
  })

  console.log(choice)

  // changelog generate

  // pnpm publish
  // exec(`pnpm --filter ${choice}` publish)
}

export default publish