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
