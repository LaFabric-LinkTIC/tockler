# Development Notes

## Setup

- Install and enable pnpm via corepack:

  ```bash
  corepack enable pnpm
  ```

- Install dependencies for each package:

  ```bash
  pnpm install
  ```

## Testing

Run test suites from the project root. Both `client/` and `electron/` packages provide a `test` script:

```bash
pnpm --filter ./client test
pnpm --filter ./electron test
```

## Style

Formatting is enforced by Prettier. Important rules from `.prettierrc`:

- Line width: 120 characters
- Indent with 4 spaces
- Use single quotes
- Include trailing commas where possible

## Commits and Pull Requests

- Use a concise summary line for commits and PR titles
- Reference related issues when applicable

