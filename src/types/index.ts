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

export interface PackageJson {
  name: string
  version?: string
  scripts?: ScriptsMap
  dependencies?: DependencyMap
}

export interface WorkspacePackage extends PackageJson {
  path: string
  pkg?: PackageJson
}

export type WorkspacePackages = WorkspacePackage[]

export type WorkspacePackageWithoutPkg = Omit<WorkspacePackage, 'pkg'>

export interface ScriptsMap {
  [scriptName: string]: string
}

export interface DependencyMap {
  [depName: string]: string
}
