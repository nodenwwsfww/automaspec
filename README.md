# Modern UI dashboard design

_Automatically synced with your [v0.dev](https://v0.dev) deployments_

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/nodenwwsfwws-projects/v0-modern-ui-dashboard-design)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/aQILC0PTyz9)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/nodenwwsfwws-projects/v0-modern-ui-dashboard-design](https://vercel.com/nodenwwsfwws-projects/v0-modern-ui-dashboard-design)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/aQILC0PTyz9](https://v0.dev/chat/projects/aQILC0PTyz9)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

# Automaspec

## Development

### Git Hooks

This project uses [Lefthook](https://lefthook.dev/) for managing git hooks to ensure code quality and consistency.

#### Pre-commit Hooks

The following checks run on staged files before each commit:

- **Type Checking**: TypeScript type validation (`tsc --noEmit`)
- **ESLint**: Code linting with auto-fix (`eslint --fix`)
- **Prettier**: Code formatting (`prettier --write`)
- **Console Log Check**: Prevents accidental `console.log` statements
- **TODO/FIXME Check**: Warns about TODO/FIXME comments (non-blocking)
- **Lint Staged**: Additional file processing via lint-staged

#### Pre-push Hooks

Before pushing to remote, these comprehensive checks run:

- **Full TypeScript Check**: Complete type validation across the project
- **Full ESLint**: Linting on entire codebase
- **Build Check**: Ensures the project builds successfully (`npm run build`)
- **Database Schema Validation**: Validates Drizzle schema changes (`drizzle-kit check`)

#### Bypassing Hooks

If you need to bypass hooks (use sparingly):

```bash
# Skip pre-commit hooks
git commit --no-verify

# Skip pre-push hooks
git push --no-verify
```

#### Manual Hook Execution

You can manually run hooks for testing:

```bash
# Run pre-commit checks
npx lefthook run pre-commit

# Run pre-push checks
npx lefthook run pre-push
```

#### Setup

Hooks are automatically installed when you run `npm install`. If needed, you can manually install them:

```bash
npx lefthook install
```
