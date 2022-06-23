# spark	
Spark is a publish tool for monorepo,just like lerna but support pnpm.

## About

### What can Spark do?
There are three commands in spark: `spark init`, `spark info` and `spark publish`.

`init` will init spark workspace.
`info` will show package's info of workspace.
`publish` will publish any updated packages and generate changelog automatically.

### What diffrences with lerna?
* Spark can publish Single package or custom multiple packages.
* Support `workspack` protocol in `package.json`.
* Use `pnpm <--filter> publish` so you can keep the `workspack` keyword of `dependencies`.
* More friendly output of CLI.
* CLI commands is very very simple!

## Getting Started

### Project structure

Spark need a file structure like this(the same as lerna project):

```
your-repo/
  package.json
  packages/
    package-1/
      package.json
    package-2/
      package.json
```

### Installation

```
# simple install or install it globally with -g
npm install spark --save-dev

# if you install globally, use it `spark <command>`
spark init
spark version
spark publish

# OR use npx in root of project
npx spark init
npx spark publish
npx spark version
```

### Usage

#### init

```sh
$ spark init
```

Initialize `spark workspace`. There will create a `spark.json`, you can make spark manage all of packages or custom packages.

> Spark assumes the repo has already been initialized with `git init`.

Example output on a new git repo:

Example-1. All packages:

```sh
$ spark init
? Do you need spark to manage all projects of packages folder? yes
✔ Spark init successful.
```

Example-2. Custom packages:

```sh
$ spark init
? Do you need spark to manage all projects of packages folder? No
? What packages do you want to manage? @geocld/pkg1
✔ Spark init successful.
```

#### info

```sh
$ spark info <--tree>
```

Print local information of packages.

Example:

```bash
$ spark info
> Current monorepo packages:
  · @geocld/pkg1: v1.0.0
  · @geocld/pkg2: v1.0.0
```

Or Print detail dependencies tree of packages:

```bash
$ spark info --tree

@cmschina/pkg1@1.0.0
╰── @cmschina/pkg2@1.0.0

----------

@cmschina/pkg2@1.0.0
``` 

#### publish

```bash
$ spark publish
```

`publish` is core of spark. When run, this command does the following things:

- Find updated packages since the last release(must with `git tag`, otherwise compare with first commit).
- Select what packages that you want to publish.
- Update `version` of `package.json` automatically.
- Generate `CHANGELOG.md` automatically in selected packages.
- Run `git Commit`, `git tag` and `git push` automatically.
- Run `pnpm publish`

> spark will never publish packages which does not exits in `spark.json`.

#### publish --force
Spark will not publish unmodified packages, if you want to publish unmodified packages, use `--force`:

```bash
lerna publish --force
```

## License

MIT © Geocld
