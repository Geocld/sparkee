export interface SparkeeConfig {
  $schema?: string
  /**
   * @description A List of packages to manage with Sparkee.
   * @default ["./packages"]
   */
  packages?: string[]
  /**
   * @description Whether to enable singleRepo mode.
   * @default false
   */
  singleRepo?: boolean
  /**
   * @description The Prefered package manager.
   * @default "npm"
   */
  moduleManager?: 'npm' | 'yarn' | 'pnpm'
  /**
   * @description Custom changelLog commit message types.
   * @example `logPresetTypes: [ { type: "feat", section: "New features" } ],`
   * @see {@link https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.2.0/README.md#types}
   */
  logPresetTypes?: LogPreset[]
  logCommit?: {
    type: string
    commitTag: string
  }
}

// types: https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.2.0/README.md#type
export type LogPreset = {
  /**
   * @description A string used to match `<type>`s used in the Conventional Commits convention.
   */
  type: string
  /**
   * @description A string used to match `[optional scope]` used in the Conventional Commits convention.
   */
  scope?: string
  /**
   * @description The section where the matched commit `type` will display in the CHANGELOG.
   */
  section?: string
  /**
   * @description Set to `true` to hide matched commit `type`s in the CHANGELOG.
   */
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
  license?: string
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
