```
(base) teo@MacBook-Air chat-nextjs % npx create-next-app ./
✔ Would you like to use TypeScript? … No / Yes
✔ Would you like to use ESLint? … No / Yes
✔ Would you like to use Tailwind CSS? … No / Yes
✔ Would you like to use `src/` directory? … No / Yes
✔ Would you like to use App Router? (recommended) … No / Yes
✔ Would you like to customize the default import alias (@/*)? … No / Yes
✔ What import alias would you like configured? … @@/*
Creating a new Next.js app in /Users/teo/Desktop/chat-nextjs.

Using npm.

Initializing project with template: app-tw


Installing dependencies:
- react
- react-dom
- next

Installing devDependencies:
- typescript
- @types/node
- @types/react
- @types/react-dom
- postcss
- tailwindcss
- eslint
- eslint-config-next

npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
npm warn deprecated next@14.2.17: This version has a security vulnerability. Please upgrade to a patched version. See https://nextjs.org/blog/security-update-2025-12-11 for more details.

added 376 packages, and audited 377 packages in 14s

148 packages are looking for funding
  run `npm fund` for details

4 vulnerabilities (3 high, 1 critical)

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
Initialized a git repository.

Success! Created chat-nextjs at /Users/teo/Desktop/chat-nextjs

A new version of `create-next-app` is available!
You can update by running: npm i -g create-next-app
```

---

## [Prisma, Postgres install](https://github.com/ld5ehom/chat-nextjs/commit/5f2d8d1c2e99b44ccf2107859060bf6b9d3863bc)

- Prisma install

```
(base) teo@MacBook-Air chat-nextjs % npm install -D prisma

added 78 packages, and audited 455 packages in 10s

157 packages are looking for funding
  run `npm fund` for details

7 vulnerabilities (6 high, 1 critical)

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
```

- Prisma init

```
(base) teo@MacBook-Air chat-nextjs % npx prisma init

Initialized Prisma in your project

  prisma/
    schema.prisma
  prisma.config.ts
  .env

warn You already have a .gitignore file. Don't forget to add .env in it to not commit any private information.

Next, choose how you want to set up your database:

CONNECT EXISTING DATABASE:
  1. Configure your DATABASE_URL in prisma.config.ts
  2. Run prisma db pull to introspect your database.

CREATE NEW DATABASE:
  Local: npx prisma dev (runs Postgres locally in your terminal)
  Cloud: npx create-db (creates a free Prisma Postgres database)

Then, define your models in prisma/schema.prisma and run prisma migrate dev to apply your schema.

Learn more: https://pris.ly/getting-started
```
