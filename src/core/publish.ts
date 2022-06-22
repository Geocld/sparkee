import consola from 'consola'
import chalk from 'chalk'
import semver from 'semver'
import live from 'shelljs-live'
import { promptCheckbox, promptSelect, promptInput, promptConfirm } from '../common/prompt'
import { exec, exit, getChangedPackages, runTaskSync, updateVersions } from '../utils'

// publish package, you can publish all or publish single package.
async function publish() {
  console.log('publish')
  
  const changedPackages = await getChangedPackages()
  if (!changedPackages.length) {
    consola.warn('No packages have changed since last release')
    exit()
  }

  const pickedPackages = await promptCheckbox('What packages do you want to publish?', {
    choices: changedPackages.map(pkg => pkg.name)
  })

  const packagesToRelease = changedPackages.filter((pkg) =>
    pickedPackages.includes(pkg.name)
  )

  if (!packagesToRelease.length) {
    consola.warn('Release packages cannot be empty.')
    exit()
  }

  consola.log(
    `Ready to release ${packagesToRelease
      .map(({ name }) => chalk.bold.white(name))
      .join(', ')}`
  )

  const pkgWithVersions = await runTaskSync(
    packagesToRelease.map(({ name, path, pkg }) => async () => {
      let { version } = pkg

      const prerelease = semver.prerelease(version)
      const preId = prerelease && prerelease[0]

      const versionIncrements = [
        'patch',
        'minor',
        'major',
        ...(preId ? ['prepatch', 'preminor', 'premajor', 'prerelease'] : []),
      ]

      const choices = versionIncrements
                      .map((i) => `${i}: ${name} (${semver.inc(version, i, preId)})`)
                      .concat(['custom'])

      const release = await promptSelect(`Select release type for ${chalk.bold.green(name)}`, {
        choices: versionIncrements
        .map((i) => `${i}: ${name} (${semver.inc(version, i, preId)})`)
        .concat(['custom'])
      })

      if (release === 'custom') {
        version = await promptInput(`Input custom version (${chalk.bold.green(name)})`)
      } else {
        const match = release.match(/\((.*)\)/)
        version = match ? match[1] : ''
      }

      if (!semver.valid(version)) {
        consola.error(`invalid target version: ${version}`)
        exit()
      }

      return { name, path, version, pkg }
    })
  )

  const isReleaseConfirmed = await promptConfirm(
    `Releasing \n${pkgWithVersions
      .map(
        ({ name, version }) =>
          `  · ${chalk.white(name)}: ${chalk.yellow.bold('v' + version)}`
      )
      .join('\n')}\nConfirm?`
  )

  if (!isReleaseConfirmed) {
    exit()
  }

  consola.log('\nUpdating versions in package.json files...')
  await updateVersions(pkgWithVersions)

  consola.log('\nGenerating changelogs...')
  let filter = ''
  for (const pkg of pkgWithVersions) {
    const { name, path } = pkg
    consola.log(` -> ${name} (${path})`)
    filter += ` --filter ${name}`
    await exec(`npx conventional-changelog -p angular --commit-path ${path} -l ${name} -o ${path}/CHANGELOG.md`)
  }

  consola.log('\nBuilding all packages...')
  live(`pnpm${filter} build`)
  // const { stdout: buildStatus } = await exec(`pnpm${filter} build`, false)

  consola.log('\nCommitting changes...')

  // pnpm publish
  // exec(`pnpm --filter ${choice}` publish)
}

export default publish