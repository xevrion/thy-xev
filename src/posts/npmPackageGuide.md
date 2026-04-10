# Building and Publishing an npm Package
Date: 12-03-2026
Tags: web, guide

## The Problem

Most developers use npm packages every day but have never published one. The process looks intimidating from the outside — tokens, versioning schemes, CI pipelines, scoped names. In practice it's about 20 minutes of setup and a single command.

This is a complete walkthrough: scaffold a TypeScript package, test it locally, publish it to the npm registry, and automate everything after that. The example used here is `tree-size-cli` — a CLI tool that prints a directory tree with file sizes next to each file.

```
my-project/
├── src/
│   ├── index.ts        [2.1 KB]
│   └── utils.ts        [890 B]
├── package.json        [1.4 KB]
└── README.md           [3.2 KB]
```

---

## Anatomy of `package.json`

This file is the identity card of your package. Every field matters.

```json
{
  "name": "tree-size-cli",
  "version": "1.0.1",
  "description": "Print directory trees with file sizes",
  "main": "./dist/index.js",
  "type": "module",
  "bin": {
    "tree-size": "./dist/index.js"
  },
  "scripts": {
    "build": "tsup src/index.ts --format esm",
    "test": "vitest run",
    "lint": "eslint src/**/*.ts"
  },
  "keywords": ["cli", "tree", "directory", "files", "size"],
  "author": "xevrion",
  "license": "MIT",
  "files": ["dist", "README.md", "LICENSE"]
}
```

Key fields:

| Field | What it does |
|---|---|
| `name` | Unique ID on npm. Must be globally unique. |
| `version` | Semver version — explained below |
| `main` | Entry point when someone does `require('your-pkg')` |
| `bin` | Makes it a CLI command after `npm install -g` |
| `keywords` | How people find your package on npm search |
| `files` | Whitelist of what gets published — use this instead of `.npmignore` |

The `files` field is important. Without it, npm publishes everything in your folder — source TypeScript, test files, config files, all of it. Whitelist only `dist/`.

Run `npm pack --dry-run` before any publish to confirm exactly what will be included.

---

## Versioning — Semver

Every npm package uses `MAJOR.MINOR.PATCH`:

| Type | When to use | Example |
|---|---|---|
| `PATCH` | Bug fix, nothing new | `1.0.0` → `1.0.1` |
| `MINOR` | New feature, backwards compatible | `1.0.1` → `1.1.0` |
| `MAJOR` | Breaking change, old code won't work | `1.1.0` → `2.0.0` |

```bash
npm version patch    # updates package.json + creates a git tag
npm version minor
npm version major
```

> **Never publish the same version twice.** npm will reject it with a 403.

### `^` and `~` in `package.json`

When npm installs a dependency it adds a version prefix. These control what's allowed on future `npm install` runs:

```
"^5.1.1"  →  caret: allows minor + patch updates, locks major
             accepts 5.1.1, 5.2.0, 5.9.3 — not 6.0.0

"~5.1.1"  →  tilde: allows patch updates only
             accepts 5.1.1, 5.1.8 — not 5.2.0
```

Memory aid: tilde `~` is the floor (stay on this floor). Caret `^` is the roof (go up, but not to the next building).

`npm install` installs exactly what `package-lock.json` specifies. `npm update` fetches the latest version within the `^`/`~` range and updates the lock file. Always commit `package-lock.json`.

---

## Testing Locally Before Publishing

Three approaches, ordered by how production-like the experience is:

**`npm link` — for active development**

```bash
# inside your package
npm link

# inside any other project
npm link tree-size-cli
```

Creates a global symlink to your local source. Changes reflect instantly without re-linking. Doesn't test the built output — it points to source directly.

**Relative path install**

```bash
# inside the client project
npm install /path/to/tree-size-cli
```

Same as `npm link` without the global symlink. Still points to source, not build.

**`npm pack` — closest to real publish**

```bash
npm run build
npm pack
# produces tree-size-cli-1.0.1.tgz

# in the client project
npm install /path/to/tree-size-cli-1.0.1.tgz
```

This installs the exact tarball that would go to the registry. If it works here, it'll work after `npm publish`.

---

## Publishing

### Manual

```bash
npm test
npm run build
npm version patch
npm publish                     # unscoped packages
npm publish --access public     # scoped packages (@xevrion/pkg)
```

For scoped packages, `--access public` is required. Scoped packages default to private without it — they'll publish successfully but won't be visible without a paid org account.

### With GitHub Actions

Set up once, never touch `npm publish` again.

**Step 1:** Generate an npm token.

Go to npmjs.com → Avatar → Access Tokens → Generate New Token → Granular Access Token. Set Read and Write on packages. Enable **"bypass 2FA"** — this is required for automated publishing, not optional.

Add it to GitHub: repo → Settings → Secrets → Actions → New secret → name it `NPM_TOKEN`.

**Step 2:** Test workflow — runs on every push and PR:

```yaml
# .github/workflows/tests.yml
name: Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22.x'
      - run: npm ci
      - run: npm test
```

**Step 3:** Publish workflow — triggers on git tags:

```yaml
# .github/workflows/publish.yml
name: Publish to npm

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm test
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

To release:

```bash
npm version patch
git push origin --tags
```

GitHub runs tests, builds, and publishes. Done.

---

## Fully Automatic Versioning with `semantic-release`

The workflow above still requires manually running `npm version`. `semantic-release` removes even that step — it reads commit messages and decides the version bump automatically.

It uses **Conventional Commits**:

```bash
fix: handle empty directory edge case       # → PATCH bump
feat: add --ignore flag                     # → MINOR bump
feat!: rewrite output format                # → MAJOR bump
```

Setup:

```bash
npm install -D semantic-release
npx semantic-release-cli setup
```

Add to `package.json`:

```json
"release": { "branches": ["main"] },
"publishConfig": { "access": "public" }
```

Replace `publish.yml` with `release.yml`:

```yaml
name: Release
on:
  workflow_run:
    workflows: ['Tests']
    branches: [main]
    types: [completed]

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      issues: write
      pull-requests: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
      - run: npm ci
      - run: npm audit signatures
      - run: npx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

The release only runs after Tests pass. Workflow: write code → conventional commit → push → done.

---

## Scoped Packages and Monorepos

### Scoped packages (`@you/pkg`)

A scoped package is namespaced under your username:

```json
{ "name": "@xevrion/tree-size-cli" }
```

Benefits: name never conflicts with anyone else's, groups all your packages under one namespace, looks cleaner for org work. Always publish with `--access public` or it defaults to private.

### Monorepos

Multiple packages in one git repo. Useful when packages share logic or are part of the same project:

```
my-tools/
├── packages/
│   ├── tree-size-cli/     ← published package
│   ├── tree-size-core/    ← shared logic
│   └── tree-size-react/   ← React wrapper
├── package.json
└── pnpm-workspace.yaml
```

Tools: **pnpm workspaces** (simplest), **Turborepo** (adds caching + parallel tasks), **nx** (full framework). Come back to this when you have 2+ packages that share code.

---

## Writing a README That Gets Installs

The README is the package's storefront. Most people decide in under 10 seconds.

```markdown
# package-name

One sentence. What it does and why it's useful.

## Install
npm install -g your-package

## Usage
$ your-command ./my-project

## Output
(actual output — code block or screenshot)

## Options
| Flag      | Description           | Default            |
|-----------|-----------------------|--------------------|
| --depth   | Limit tree depth      | unlimited          |
| --ignore  | Comma-separated names | node_modules,.git  |

## License
MIT
```

Rules: first line is one sentence, no backstory. Show output before explaining anything. Install command must be copy-pasteable. For CLI tools, a terminal gif using `vhs` or `asciinema` is worth more than a paragraph of description — record one.

---

## Getting Downloads

npm download counts include CI runs, bots, and mirrors. Don't chase the number — chase GitHub stars and issues, those are real people.

What actually moves the needle:

- Solving a specific problem well
- A README that shows output immediately
- Keywords in `package.json` that match what people search
- One post in the right place at launch — r/node, r/commandline, Hacker News Show HN
- A Dev.to or Hashnode article that ranks on Google long-term

Post at launch. Post again when you ship features. "v1.1 of X — now with `--ignore` flag" is a valid reason to post.

---

## Gotchas

**1. The 2FA 403 on first publish**

The most common failure. npm requires a granular access token with "bypass 2FA" explicitly checked. A regular token without this flag gets a 403 even with valid credentials. The error message doesn't explain itself.

**2. Scoped packages are private by default**

`@xevrion/package` will publish successfully but be invisible to everyone unless you pass `--access public`. No clear error — it silently ends up private.

**3. `bin` script name gets auto-corrected**

npm sanitizes the `bin` field on publish. If your script name has characters npm doesn't like, it gets cleaned silently. Run `npm pkg fix` before publishing to catch this early.

**4. `npm install` vs `npm ci`**

Use `npm ci` in CI pipelines. It installs exactly what's in `package-lock.json` and fails if the lock file is out of sync. `npm install` can silently update things — not what you want in a pipeline.

**5. Publishing source files by accident**

Without a `files` field, npm publishes everything — `src/`, `tests/`, all config files. Consumers download 14 files when they needed 2. Always set `"files": ["dist"]`.

---

## Takeaway

npm publishing is simple once the scaffolding is in place. The complexity people perceive is a one-time setup cost — `package.json` fields, a token, two GitHub Actions workflows. After that, publishing is a commit message and a push.

Total first-time setup: about 20 minutes. Every publish after that: a `git push`.

Full source for `tree-size-cli` available on request.