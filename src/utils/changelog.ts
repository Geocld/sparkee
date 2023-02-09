import fs from 'fs'
import { join } from 'path'
import shell from 'shelljs'
import consola from 'consola'
import chalk from 'chalk'
import dayjs from 'dayjs'
import { LOCAL_CLIFF_TOML, DEFAULT_MONOREPO_CLIFF_TOML, DEFAULT_SINGLEREPO_CLIFF_TOML } from '../common/constans'
import type { WorkspacePackageWithoutPkg } from './../types'

function execCommand(args: Array<string|undefined>, message?: string) {
  const { code, stderr } = shell.exec(args.join(' '), { silent: true })
  if (code !== 0) {
    consola.error(stderr)
  } else {
    message && consola.success(chalk.green(message))
  }
}

export function generateChangeLog(pkg: WorkspacePackageWithoutPkg, singleRepo = false) {
  // Get local sparkee-cliff.toml otherwise use config inside.
  const { name, path, version } = pkg
  let cliffToml = LOCAL_CLIFF_TOML
  if (!fs.existsSync(LOCAL_CLIFF_TOML)) {
    consola.warn('Local sparkee-cliff.toml not found, use default Config.')
    cliffToml = singleRepo ? DEFAULT_SINGLEREPO_CLIFF_TOML : DEFAULT_MONOREPO_CLIFF_TOML
  }

  const changelogFile = singleRepo ? './CHANGELOG.md' : join(path, './CHANGELOG.md')
  
  let execChangeLogCommand = [
    'npx', 
    'git-cliff', 
    '--config', 
    cliffToml, 
    '-o', 
    changelogFile
  ]

  if (!singleRepo) {
    // TODO: custom template in monorepo
    execChangeLogCommand = execChangeLogCommand.concat([
      '--include-path',
      `"${path}/**"`,
      '--body', // Sets the template for the changelog body
      `"""{% if version %}
        {% if version is matching(\\"^${name}.*\\") %}
          ## [{{ version }}] - {{ timestamp | date(format=\\"%Y-%m-%d\\") }}
        {% endif %}
      {% else %}\
## [${name}@${version}] - ${dayjs().format('YYYY-MM-DD')} \n
      {% endif %}\
      {% for group, commits in commits | group_by(attribute=\\"group\\") %}
          ### {{ group | upper_first }}
          {% for commit in commits %}
              - {% if commit.breaking %}[**breaking**] {% endif %}{{ commit.message | upper_first }} {% if commit.id %}([{{ commit.id | truncate(length=7, end=\\"\\") }}]({{ commit.id }})){% endif %}\
          {% endfor %}
      {% endfor %}\n"""`
    ])
  }

  execCommand(execChangeLogCommand, 'Generate CHANGELOG.md successful.')

  // Replace [unreleased] in singleRepo CHANGELOG.md
  if (singleRepo) {
    let logContent = fs.readFileSync(changelogFile, 'utf-8')
    logContent = logContent.replace('[unreleased]', `[${version}] - ${dayjs().format('YYYY-MM-DD')}`)
    fs.writeFileSync(changelogFile, logContent)
  }
}