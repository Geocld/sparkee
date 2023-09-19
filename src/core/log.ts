import consola from 'consola'
import { ROOT } from '../common/constans'
import { promptCheckbox } from '../common/prompt'
import { exit, getChangedPackages, getSparkeeConfig, step } from '../utils'
import { generateChangeLog } from '../utils/changelog'

async function log() {
  const { singleRepo = false } = await getSparkeeConfig()

  const packages = await getChangedPackages(true)

  step('Generating changelogs...')
  if (singleRepo) {
    const { name, version } = packages[0]
    await generateChangeLog(
      {
        name,
        path: ROOT,
        version,
      },
      singleRepo
    )
  } else {
    // monorepo
    let pickedPackages: Record<string, any>
    pickedPackages = await promptCheckbox('What packages do you want to generate changelog?', {
      choices: packages.map((pkg) => pkg.name),
    })
    const packagesToGenerate = packages.filter((pkg) => pickedPackages.includes(pkg.name))

    if (!packagesToGenerate.length) {
      consola.warn('Packages cannot be empty.')
      exit()
    }

    for (const pkg of packagesToGenerate) {
      await generateChangeLog(pkg)
    }
  }
}

export { log }
