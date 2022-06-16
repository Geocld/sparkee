import { join } from 'path'
import fs from 'fs-extra'
import glob from 'glob'
import { ROOT, PACKAGES } from '../common/constans'

async function getFolders(): Promise<string[]> {
  const folders = await glob.sync(join(ROOT, 'packages/*'))
  return folders
}

export function exit() {
  process.exit(1)
}

export async function getPkgs(): Promise<object[]> {
  const folders = await getFolders()
  const pkgs = await Promise.all(
    folders.map(async (folder) => {
      if (!(await fs.lstat(folder)).isDirectory()) return null

      const pkg = JSON.parse(await fs.readFile(join(folder, 'package.json')))
      return pkg
    })
  )

  return pkgs.filter(p => p)
}

export async function getPkgsProperty(property: string): Promise<any[]> {
  const pkgs = await getPkgs()
  const properties = pkgs.map(pkg => {
    if (!pkg[property]) return null
    return pkg[property]
  })

  return properties.filter(p => p)
}


