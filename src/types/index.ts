export interface SparkeeConfig {
  packages: string[]
  singleRepo: boolean
  moduleManager: 'npm' | 'yarn' | 'pnpm'
  logPresetTypes: LogPreset[]
  logCommit: {
    type: string
    commitTag: string
  }
}

// types: https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.2.0/README.md#type
export type LogPreset = {
  type: string
  scope?: string
  section?: string
  hidden?: boolean
}

export interface PnpmWorkspace {
  packages: string[]
}
