import consola from 'consola'
import chalk from 'chalk'
import semver from 'semver'
import live from 'shelljs-live'
import { promptCheckbox, promptSelect, promptInput, promptConfirm } from '../common/prompt'
import { exec, exit, step, getChangedPackages, runTaskSync, updateVersions } from '../utils'

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

  step('\nUpdating versions in package.json files...')
  await updateVersions(pkgWithVersions)

  step('\nGenerating changelogs...')
  let filter = ''
  for (const pkg of pkgWithVersions) {
    const { name, path } = pkg
    consola.log(` -> ${name} (${path})`)
    filter += ` --filter ${name}`
    await exec(`npx conventional-changelog -p angular --commit-path ${path} -l ${name} -o ${path}/CHANGELOG.md`)
  }

  step('\nBuilding all packages...')
  live(`pnpm${filter} build`) // use live to preserve colors of stdout

  const { stdout: hasChanges } = await exec('git diff')
  if (hasChanges) {
    step('\nCommitting changes...')
    live([
      'git',
      'add',
      'packages/*/CHANGELOG.md',
      'packages/*/package.json'
    ])
    const commitCode = live([
      'git',
      'commit',
      '-m',
      `release: ${pkgWithVersions
        .map(({ name, version }) => `${name}@${version}`)
        .join(' ')}`
    ])
    if (commitCode !== 0) {
      exit()
    }
  } else {
    consola.warn(chalk.yellow('No changes to commit.'))
  }

  step('\nCreating tags...')
  let versionsToPush: string[] = []
  for (const pkg of pkgWithVersions) {
    const { name, version } = pkg
    versionsToPush.push(`refs/tags/${name}@${version}`)
    const tagCode = live([
      'git',
      'tag',
      `${name}@${version}`
    ])
    if (tagCode !== 0) {
      exit()
    }
  }

  step('\nPushing to Git...')
  const pushCode = live([
    'git',
    'push',
    'origin',
    ...versionsToPush
  ])

  if (pushCode !== 0) {
    exit()
  }

  step('\Publishing packages...')
  live(`pnpm${filter} publish`)
}

export default publish