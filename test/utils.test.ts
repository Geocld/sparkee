import { getPackageJson, getPkgsProperty, getSparkeeConfig, getWorkspacePackages } from '../src/utils'
import { describe, expect, it } from 'vitest'

import packageJson from '../package.json'

describe('utils test', async () => {
  it('should load spark.json config file', async () => {
    const sparkeeConfig = await getSparkeeConfig()

    expect(sparkeeConfig).toEqual({
      $schema: './template/schema.json',
      singleRepo: true,
      moduleManager: 'npm',
    })
  })

  it('should load root package.json file', async () => {
    const rootPackageJson = await getPackageJson()

    expect(rootPackageJson.name).toEqual(packageJson.name)
    expect(rootPackageJson.license).toEqual(packageJson.license)
  })

  it('should load singlerepo root package.json file', async () => {
    const allPackages = await getWorkspacePackages()

    expect(allPackages).toEqual([packageJson])
  })

  it('should load root package.json scripts', async () => {
    const allPackages = await getPkgsProperty('scripts')

    expect(allPackages).toEqual([packageJson.scripts])
  })
})
