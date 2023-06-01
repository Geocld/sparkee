import { DEFAULT_MONOREPO_CLIFF_TOML, DEFAULT_SINGLEREPO_CLIFF_TOML, LOCAL_CLIFF_TOML } from '../common/constans'
import type { WorkspacePackageWithoutPkg } from '../types'
import { exec, fileExists, getFirstRegexGroup } from './index'
import chalk from 'chalk'
import { spawnSync } from 'child_process'
import consola from 'consola'
import dayjs from 'dayjs'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

function getExePath() {
  const arch = process.arch
  let os = process.platform as string
  let extension = ''
  if (['win32', 'cygwin'].includes(process.platform)) {
    os = 'windows'
    extension = '.exe'
  }

  try {
    return require.resolve(`git-cliff-${os}-${arch}/bin/git-cliff${extension}`)
  } catch (e) {
    throw new Error(`Couldn't find git-cliff binary inside node_modules for ${os}-${arch}`)
  }
}

export async function generateChangeLog(pkg: WorkspacePackageWithoutPkg, singleRepo = false) {
  // Get local sparkee-cliff.toml otherwise use config inside.
  const { name, path, version } = pkg
  let cliffToml = LOCAL_CLIFF_TOML
  if (!(await fileExists(LOCAL_CLIFF_TOML))) {
    consola.warn('Local sparkee-cliff.toml not found, use default Config.')
    cliffToml = singleRepo ? DEFAULT_SINGLEREPO_CLIFF_TOML : DEFAULT_MONOREPO_CLIFF_TOML
  }

  const changelogFile = singleRepo ? './CHANGELOG.md' : join(path, './CHANGELOG.md')

  let commandArgs = ['--config', cliffToml, '-o', changelogFile]

  if (!singleRepo) {
    const { stdout: repoUrl } = await exec('git ls-remote --get-url origin')

    const repoMatcher = /^(?:git@|https:\/\/)github.com[:\/](.*).git$/gm

    const gitUrl = `https://github.com/${getFirstRegexGroup(repoMatcher, repoUrl).toString()}`

    // TODO: custom template in monorepo
    commandArgs = commandArgs.concat([
      '--include-path',
      `${path}/**`,
      '--body', // Sets the template for the changelog body
      `{% if version %}
        {% if version is matching("^${name}.*") %}
          ## [{{ version }}](${gitUrl}/releases/tag/{{ version }}) - {{ timestamp | date(format="%Y-%m-%d") }}
        {% endif %}
      {% else %}\
## [${name}@${version}](${gitUrl}/releases/tag/${name}@${version}) - ${dayjs().format('YYYY-MM-DD')} \n
      {% endif %}\
      {% for group, commits in commits | group_by(attribute="group") %}
          ### {{ group | upper_first }}
          {% for commit in commits %}
              - {% if commit.breaking %}[**breaking**] {% endif %}{{ commit.message | upper_first }} {% if commit.id %}([{{ commit.id | truncate(length=7, end="") }}](${gitUrl}/commit/{{ commit.id }})){% endif %}\
          {% endfor %}
      {% endfor %}\n`,
    ])
  }

  const processResult = spawnSync(getExePath(), commandArgs, { stdio: 'inherit' })

  if (processResult.status === 0) {
    consola.success(chalk.green('Generate CHANGELOG.md successful.'))
  }

  // Replace [unreleased] in singleRepo CHANGELOG.md
  if (singleRepo) {
    try {
      let logContent = await readFile(changelogFile, { encoding: 'utf8' })
      logContent = logContent.replace('[unreleased]', `[${version}] - ${dayjs().format('YYYY-MM-DD')}`)
      await writeFile(changelogFile, logContent, { encoding: 'utf8' })
    } catch (e) {
      consola.error(chalk.red(e))
    }
  }
}
