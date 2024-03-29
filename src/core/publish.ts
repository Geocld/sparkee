import chalk from 'chalk'
import consola from 'consola'
import semver from 'semver'
import live from 'shelljs-live'
import { ROOT } from '../common/constans'
import { promptCheckbox, promptConfirm, promptInput, promptSelect } from '../common/prompt'
import type { PackageJson, PublishArgs, WorkspacePackages } from '../types/index'
import { exec, exit, getChangedPackages, getSparkeeConfig, runTaskSync, step, updateVersions } from '../utils'
import { generateChangeLog } from '../utils/changelog'

// publish package, you can publish all or publish single package.
async function publish(args: PublishArgs) {
  const { force = false, noPublish = false, noCheckCommit = false, pkgName = '', pkgVersion = '' } = args
  const { logCommit } = await getSparkeeConfig()

  const { stdout: beforeChanges } = await exec('git diff')
  const { stdout: beforeUntrackedFile } = await exec('git ls-files --others --exclude-standard')

  if (!noCheckCommit && (beforeChanges || beforeUntrackedFile)) {
    consola.warn('Please commit your change before publish.')
    exit()
  }

  const changedPackages = await getChangedPackages(force)
  if (!changedPackages.length) {
    consola.warn('No packages have changed since last release, you can run `--force` to publish all packages.')
    exit()
  }

  const { singleRepo = false, moduleManager = 'pnpm' } = await getSparkeeConfig()

  let pickedPackages: string[]

  if (singleRepo) {
    pickedPackages = [changedPackages[0].name]
  } else {
    if (!pkgName && !pkgVersion) {
      pickedPackages = await promptCheckbox('What packages do you want to publish(Press space key to select)?', {
        choices: changedPackages.map((pkg) => pkg.name),
      })
    } else {
      // Use package args to skip package pick prompt
      pickedPackages = [pkgName]
    }
  }

  const packagesToRelease = changedPackages.filter((pkg) => pickedPackages.includes(pkg.name))

  if (!packagesToRelease.length) {
    consola.warn('Release packages cannot be empty.')
    exit()
  }

  consola.log(`Ready to release ${packagesToRelease.map(({ name }) => chalk.bold.white(name)).join(', ')}`)

  // Use package args to skip package pick prompt
  let pkgWithVersions: WorkspacePackages = []
  if (pkgName && pkgVersion) {
    pkgWithVersions = (await runTaskSync(
      packagesToRelease.map(({ name, path, pkg }) =>
        async () => {
          return { name, path, version: pkgVersion, pkg } as PackageJson
        })
    )) as WorkspacePackages
  } else {
    // Normal prompt
    pkgWithVersions = (await runTaskSync(
      packagesToRelease.map(({ name, path, pkg }) =>
        async () => {
          if (!pkg) {
            consola.error('Packages can not be empty!')
            return exit()
          }

          let { version } = pkg

          if (!version) {
            consola.error('Missing package version!')
            return exit()
          }

          const prerelease = semver.prerelease(version)
          const preId = prerelease?.[0] as string

          const versionIncrements = [
            'patch',
            'minor',
            'major',
            ...(preId ? ['prepatch', 'preminor', 'premajor', 'prerelease'] : []),
          ] as semver.ReleaseType[]

          const choices = versionIncrements
            .map((i) => `${i}: ${name} (${semver.inc(version as string, i, preId)})`)
            .concat(['custom'])

          const release = await promptSelect(`Select release type for ${chalk.bold.green(name)}`, {
            choices,
          })

          if (release === 'custom') {
            version = await promptInput(`Input custom version (${chalk.bold.green(name)})`)
          } else {
            const match = release.match(/\((.*)\)/)
            version = match ? match[1] : ''
          }

          if (!semver.valid(version)) {
            consola.error(`Invalid target version: ${version}`)
            exit()
          }

          return { name, path, version, pkg } as PackageJson
        })
    )) as WorkspacePackages
  }

  let isReleaseConfirmed = false
  // Use package args to skip package pick prompt
  if (pkgName && pkgVersion) {
    isReleaseConfirmed = true
  } else {
    isReleaseConfirmed = await promptConfirm(
      `Releasing \n${pkgWithVersions
        .map(({ name, version }) => `  · ${chalk.white(name)}: ${chalk.yellow.bold(`v${version}`)}`)
        .join('\n')}\nConfirm?`
    )
  }

  if (!isReleaseConfirmed) {
    exit()
  }

  step('\nUpdating versions in package.json files...')
  await updateVersions(pkgWithVersions)

  if (singleRepo) {
    const { version: newVersion } = pkgWithVersions[0]

    step('\nGenerating changelogs...')
    await generateChangeLog(
      {
        name: changedPackages[0].name,
        path: ROOT,
        version: newVersion,
      },
      singleRepo
    )

    step('\nBuilding package...')
    live([moduleManager, 'run', 'build'])

    step('\nCommitting changes...')
    live(['git', 'add', '.'])
    const commitCode = live(['git', 'commit', '-m', `release: ${newVersion}`])
    if (commitCode !== 0) {
      exit()
    }

    step('\nCreating tags...')
    const tagCode = live(['git', 'tag', newVersion!])
    if (tagCode !== 0) {
      exit()
    }

    step('\nPushing to Git...')
    const pushCode = live(['git', 'push', 'origin', newVersion!])

    if (pushCode !== 0) {
      exit()
    }

    // no publish option, you can set this option in pipeline
    if (noPublish) {
      return
    }

    // TODO: rollback if publish fail
    step('Publishing package...')
    live([moduleManager, 'publish'])
  } else {
    // monorepo

    step('\nGenerating changelogs...')
    let filter = ''
    for (const pkg of pkgWithVersions) {
      const { name, path } = pkg
      consola.log(` -> ${name} (${path})`)
      filter += ` --filter ${name}`

      await generateChangeLog(pkg)
    }

    if (!noPublish) {
      step('\nBuilding all packages...')
      live(`pnpm${filter} build`) // use live to preserve colors of stdout
    }

    const { stdout: hasChanges } = await exec('git diff')
    const { stdout: untrackedFile } = await exec('git ls-files --others --exclude-standard')
    const commitType = logCommit ? logCommit.type : 'release'
    const commitTag = logCommit ? logCommit.commitTag : ''

    if (hasChanges || untrackedFile) {
      step('\nCommitting changes...')
      live(['git', 'add', '*/*/CHANGELOG.md', '*/*/package.json'])
      const commitCode = live([
        'git',
        'commit',
        '-m',
        `${commitType}: ${commitTag} ${pkgWithVersions.map(({ name, version }) => `${name}@${version}`).join(' ')}`,
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
      const tagCode = live(['git', 'tag', `${name}@${version}`])
      if (tagCode !== 0) {
        exit()
      }
    }

    step('\nPushing to Git...')
    const pushCode = live(['git', 'push', 'origin', ...versionsToPush])

    if (pushCode !== 0) {
      exit()
    }

    // no publish option, you can set this option in pipeline
    if (noPublish) {
      return
    }

    // TODO: rollback if publish fail
    step('Publishing packages...')
    live(`pnpm${filter} publish`)
  }
}

export { publish }
