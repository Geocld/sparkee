import { getPackageJson, getPkgsProperty, getSparkeeConfig, getWorkspacePackages } from '../src/utils'
import { describe, expect, it } from 'vitest'

describe('utils test', async () => {
  it('should load spark.json config file', async () => {
    const sparkeeConfig = await getSparkeeConfig()

    expect(sparkeeConfig).toEqual({
      singleRepo: true,
      moduleManager: 'npm'
    })
  })

  it('should load root package.json file', async () => {
    const rootPackageJson = await getPackageJson()

    expect(rootPackageJson.name).toEqual('sparkee')
    expect(rootPackageJson.license).toEqual('MIT')
  })

  it('should load singlerepo root package.json file', async () => {
    const allPackages = await getWorkspacePackages()

    expect(allPackages).toMatchSnapshot()
  })

  it('should load root package.json scripts', async () => {
    const allPackages = await getPkgsProperty('scripts')

    expect(allPackages).toMatchSnapshot()
  })
})
