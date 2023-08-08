# Changelog

All notable changes to this project will be documented in this file.

## [1.3.4] - 2023-08-08

### Bug Fixes

- Changelog overrided old version infos ([ec7bf22]( https://github.com/Geocld/sparkee/commit/ec7bf22fcdeeeec2883f6b0b87d1cab30415180e ))

### Features

- Upgrade git-cliff and add prepend changelog to exist file ([66947b4]( https://github.com/Geocld/sparkee/commit/66947b40c99f23f3f4c2ed2b9876de76b336b604 ))


## [1.3.3] - 2023-06-08

### Bug Fixes

- Remove only allow in pnpm ([c795b49]( https://github.com/Geocld/sparkee/commit/c795b49fef9e90df44020ea4217d67771eff9e97 ))

## [1.3.2] - 2023-06-02

### Bug Fixes

- Run lint & fmt ([1782da2]( https://github.com/Geocld/sparkee/commit/1782da25da52d4a2d20729befe8d601f5ab94ed7 ))
- Ignore node_modules when fmt & lint ([8a44193]( https://github.com/Geocld/sparkee/commit/8a441932bc5440ed393d4065230b3535e78a9d70 ))
- Generate commit link in monorepo changelog ([d6e6c4e]( https://github.com/Geocld/sparkee/commit/d6e6c4e33ec71fde3e2b7ce3cb8299b171d93e70 ))
- Generate version link in monorepo changelog ([698abdc]( https://github.com/Geocld/sparkee/commit/698abdcfb362410b6659e8c1fb36bca8c2ce94fb ))
- Run fmt & lint ([dcbadae]( https://github.com/Geocld/sparkee/commit/dcbadae8c299d0b8233a5fb49b06b9f8f45a3e9a ))
- Change pkgmanager to pnpm ([7362efb]( https://github.com/Geocld/sparkee/commit/7362efbe0946c156567dee63288ed2dabba1e509 ))
- Update pkgmanager in tests ([f83865f]( https://github.com/Geocld/sparkee/commit/f83865f0f0368ca52828a25babf7f17232225d7e ))
- Fix import path ([82b0fc2]( https://github.com/Geocld/sparkee/commit/82b0fc25895ea28fdac0763b9a9868d4180cfe3b ))
- Optimize named imports ([8321d8c]( https://github.com/Geocld/sparkee/commit/8321d8c93064b861890d6da7adc586f39e87a442 ))
- Optimize core named exports ([13cf8ef]( https://github.com/Geocld/sparkee/commit/13cf8ef7d57b9be07991123fb0682277daf96e66 ))
- Optimize named exports ([13ce09c]( https://github.com/Geocld/sparkee/commit/13ce09ce95d9877c336fd61163d2d99cd10c619e ))

### Documentation

- Fix wrong json schema example ([92b6690]( https://github.com/Geocld/sparkee/commit/92b6690761edded0d39c6129d2f846434fe50b81 ))

### Features

- Add node ci workflow ([7326646]( https://github.com/Geocld/sparkee/commit/732664683dc56e45879b44af23fb95f8c24509d0 ))
- Restrict pkgmanager to pnpm ([156860c]( https://github.com/Geocld/sparkee/commit/156860cff8188954d432619b3180297f31d2d338 ))
- Add and configure husky & nano-staged ([1941dc2]( https://github.com/Geocld/sparkee/commit/1941dc2cc39c552f14877616c3fadcc3e24cb648 ))

### Refactor

- Modify pub command ([b588997]( https://github.com/Geocld/sparkee/commit/b5889970e79bce7fffa986aa428abeda1750a8c5 ))

## [1.3.1] - 2023-05-19

### Bug Fixes

- Imports ([b9d427e]( https://github.com/Geocld/sparkee/commit/b9d427e99f4ceb90e871ff650dbd54d8a47c80d2 ))
- Exclude releases from changelog, fix monorepo ([08dad3a]( https://github.com/Geocld/sparkee/commit/08dad3a89c3d379a5fcbe3561f2662a01c48a41d ))
- Exclude releases from changelog ([a4693d8]( https://github.com/Geocld/sparkee/commit/a4693d8792cc4906800dfeddc4e6f1ec72790fe7 ))
- Remove deprecated specs from schema ([767fcae]( https://github.com/Geocld/sparkee/commit/767fcae2c8b7be31312d3958a4a865ccf350076d ))

### Refactor

- Each command its own module ([348dc50]( https://github.com/Geocld/sparkee/commit/348dc50ba17dede3c06e07bbebc204bee4d8df6c ))

## [1.3.0] - 2023-04-12

### Bug Fixes

- Info pmap.get(k) is undefined ([1e571d8]( https://github.com/Geocld/sparkee/commit/1e571d8e1fa424cc5988b6b7604f384b241f3caf ))
- Changelog template incorrect in monorepo ([0dfb97c]( https://github.com/Geocld/sparkee/commit/0dfb97c04f611b8bbae39cb7312e5cbfb2aa2bc0 ))
- Remove conventional-changelog dep ([f11151f]( https://github.com/Geocld/sparkee/commit/f11151f86a78ec5d6767499cd2d864596b672acd ))
- Remove .prettierrc in favour of rome ([6e17dee]( https://github.com/Geocld/sparkee/commit/6e17dee0497dfba71b11336577002dff6c3197fe ))
- Update test snapshots ([c73347f]( https://github.com/Geocld/sparkee/commit/c73347f419e1daa8ebf4439883356fc00ef42a38 ))
- Add missing @types/semver ([3ee3df0]( https://github.com/Geocld/sparkee/commit/3ee3df09aa438d9154de5f64de4d0f54b39a83b6 ))
- Improve return error ([9ff5a8e]( https://github.com/Geocld/sparkee/commit/9ff5a8e6a0a6db125ad0b8086d3a449a82094d6c ))
- Improve missing types for semver related functions ([de7617f]( https://github.com/Geocld/sparkee/commit/de7617f49ab6aba9f380dc78431fd3de903e8c05 ))
- Replace test snapshots with imports ([64b84c4]( https://github.com/Geocld/sparkee/commit/64b84c4005e04be254f0d23b93fd5658d3da042f ))
- Add missing @types/inquirer ([a7251f7]( https://github.com/Geocld/sparkee/commit/a7251f704416bc77a57c96c07caf63c9d5400113 ))
- Improve missing types for inquirer related functions ([91897a5]( https://github.com/Geocld/sparkee/commit/91897a55d9cd1d431829e07d46518501191eb6c1 ))
- Remove unused root import ([86ac167]( https://github.com/Geocld/sparkee/commit/86ac1676b71cac085a2eb90ba1a73483d1e865c0 ))
- Remove unused inquirer import ([7365b6b]( https://github.com/Geocld/sparkee/commit/7365b6b32624fb71632570ef24c654d21cf7efd6 ))
- Add files to .npmignore ([b46fec1]( https://github.com/Geocld/sparkee/commit/b46fec193e0b520dd343e2c6cd6d266e25f79f08 ))

### Features

- Add validation schema.json for spark.json ([c959b5b]( https://github.com/Geocld/sparkee/commit/c959b5b2deab565d94f09263f3dc6d498e97c4a3 ))
- Add log command ([4a6d758]( https://github.com/Geocld/sparkee/commit/4a6d75862a3a9bfdb271a6048272b0111d136d81 ))

### Build

- Update dependencies ([46cb7a4]( https://github.com/Geocld/sparkee/commit/46cb7a4eefac50fdddfc0510c6fbdfd31187e4a6 ))

## [1.2.0] - 2023-02-10

### Bug Fixes

- Add typescript dep ([173ccf4]( https://github.com/Geocld/sparkee/commit/173ccf44f6c172e2bebbd6c095c414215d32247f ))
- Add @types/fs-extra, fix readFile ts(2345) ([83c874c]( https://github.com/Geocld/sparkee/commit/83c874cf05803058160ef40fd6ff1997ad91ad8f ))
- Remove unused imports ([6b8bcbd]( https://github.com/Geocld/sparkee/commit/6b8bcbd31bc8a73c45bdae296592e14f0612b15d ))
- Replace js-yaml with read-yaml-file, add missing type for PnpmWorkspace ([f263fa0]( https://github.com/Geocld/sparkee/commit/f263fa06708990a6d2534b697b6bed8d5c0a7a01 ))
- Add @types/jsonfile dep ([fe26d7b]( https://github.com/Geocld/sparkee/commit/fe26d7bc85c5077a87a9fd64da6968a40df3b33c ))
- Add @types/glob, add promisify to glob to fix await ([895f047]( https://github.com/Geocld/sparkee/commit/895f04736e2ff82a963412412432d75fedcc4839 ))
- Add sparkeeconfig types ([64aeaf7]( https://github.com/Geocld/sparkee/commit/64aeaf74db0f3d97a854c260e07ab7f75705bdd6 ))
- Add mising types ([b780d11]( https://github.com/Geocld/sparkee/commit/b780d11ee4bc7f397b28fafb39852ea145b45d0f ))
- Add missing package.json related types & cleanup ([11577fa]( https://github.com/Geocld/sparkee/commit/11577fa5de1b6b04b7dfe1edc14858c7a401d18a ))
- Info get dependencies undefined ([871bbae]( https://github.com/Geocld/sparkee/commit/871bbae9f63ea2bda47604fb75dcc01c6771205b ))

### Documentation

- Add note on tracked files and folders ([a1b80e4]( https://github.com/Geocld/sparkee/commit/a1b80e4e38ab52f673c85534f26b7c3a0646e958 ))

### Features

- Add rome, fix linting errors ([7500cb9]( https://github.com/Geocld/sparkee/commit/7500cb996e6575232a9a82843c1021a6f31c50c8 ))
- Add vitest & utils tests ([abc18fc]( https://github.com/Geocld/sparkee/commit/abc18fca5cd6a206315d253fb648bfe88512c54c ))
- Add git-cliff ([581ad1b]( https://github.com/Geocld/sparkee/commit/581ad1b839cab095d3cb257155e094bd5bb231ca ))
- Run git-cliff in monorepo ([3886f7b]( https://github.com/Geocld/sparkee/commit/3886f7bb2d84ff83c299c45aa855e8bba2b27ede ))

## [1.1.3] - 2022-11-21

### Features

- Custom changelog commit type and tag ([0e4e2ea]( https://github.com/Geocld/sparkee/commit/0e4e2eaab9c04264e00856ce26f9c64592d42684 ))

## [1.1.2] - 2022-11-21

### Features

- Support packages from pnpm-workspace ([64d6626]( https://github.com/Geocld/sparkee/commit/64d6626b67f09341c104307d9b8f45632aaba031 ))

## [1.1.1] - 2022-09-09

### Bug Fixes

- Pnpm run command in monorepo ([b64420b]( https://github.com/Geocld/sparkee/commit/b64420bc9d20c4b6249ca92e836d92f7b9280e44 ))

## [1.1.0] - 2022-09-09

### Features

- Add noPublish option to adaptive pipeline workflow ([61b9d6d]( https://github.com/Geocld/sparkee/commit/61b9d6db1421dbc8d34e60e76a4f4532c318671e ))
- Run command to run sctipt ([2b5c35b]( https://github.com/Geocld/sparkee/commit/2b5c35b8a327f78ed9043fff050e0592f4a7f9eb ))

## [1.0.8] - 2022-08-23

### Refactor

- Changelog FixBug -> Bugfix ([a858f80]( https://github.com/Geocld/sparkee/commit/a858f801844a446d39f529e3b5e1771b8eefff39 ))

## [1.0.7] - 2022-08-12

### Bug Fixes

- Changelog is incorrect in single repo ([5b41ec3]( https://github.com/Geocld/sparkee/commit/5b41ec3e048c97d350bb992f3aba97021f140831 ))

## [1.0.6] - 2022-08-12

### Bug Fixes

- Release commit message ([b91f432]( https://github.com/Geocld/sparkee/commit/b91f432845c5c9dec4a52ef3f882740b26c5765b ))

## [1.0.5] - 2022-08-12

### Features

- Support traditional single repo ([d24f6eb]( https://github.com/Geocld/sparkee/commit/d24f6ebb286aa7b6f41685f92ea46851bad54216 ))

## [1.0.4] - 2022-08-10

### Bug Fixes

- Publish fail because of untracked file ([d970651]( https://github.com/Geocld/sparkee/commit/d9706512110f81e0f19bc931d1f8462d6bf48a87 ))

## [1.0.2] - 2022-07-11

### Bug Fixes

- Changelog preset and new log add to changelog.md ([8be3e70]( https://github.com/Geocld/sparkee/commit/8be3e7069c468c002e04f901459406022da97e14 ))

### Documentation

- Add chinese doc and workflow ([3952a08]( https://github.com/Geocld/sparkee/commit/3952a08fa5af650715ac33c71714631bc61b2a5e ))

## [1.0.1] - 2022-07-01

### Bug Fixes

- ChangeLog version issues ([be89c2d]( https://github.com/Geocld/sparkee/commit/be89c2d104c6d903fdf6adedb67c8cbfcd7a236f ))

## [1.0.0] - 2022-06-24

### Bug Fixes

- Init path and changelog generate ([41f0bb8]( https://github.com/Geocld/sparkee/commit/41f0bb8498287445457f30ad586e15efd2858789 ))

## [1.0.0-beta] - 2022-06-24

### Documentation

- Readme ([962d9a1]( https://github.com/Geocld/sparkee/commit/962d9a1eb1d75b47ff6f8910699414f951478213 ))
- Readme ([f83596b]( https://github.com/Geocld/sparkee/commit/f83596bd9e637e6d674ec1479c5e15d3ccfeb6e5 ))
- Update ([a5c0c98]( https://github.com/Geocld/sparkee/commit/a5c0c9839b753227c0e7bada65659a57e542299b ))

### Features

- Init config ([61d6d81]( https://github.com/Geocld/sparkee/commit/61d6d81c4d49039e9c9804853d7844370da02b73 ))
- Publish(undone) ([c582f22]( https://github.com/Geocld/sparkee/commit/c582f2211b9cdb38482a63986d82851df25e1f96 ))
- Publish ([d513c5b]( https://github.com/Geocld/sparkee/commit/d513c5b5442f4be34aea509b668dd102996386bc ))
- Pnpm publish ([195cc39]( https://github.com/Geocld/sparkee/commit/195cc3929883bdf939886caea267f235b3e63a7a ))
- Publish command set force option ([fc62c9b]( https://github.com/Geocld/sparkee/commit/fc62c9b19d27a6a408fcbdf3a59d5847aa3e61a5 ))
- Show packages infos and tree of dependencies ([a85c281]( https://github.com/Geocld/sparkee/commit/a85c2819117055df08f21b4bfece7bf20f0f086b ))

<!-- generated by sparkee -->
