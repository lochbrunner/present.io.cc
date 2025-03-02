# CLAUDE.md - Guidelines for Claude Code

## Build & Test Commands
- Build: `npm run build`
- Dev mode: `npm start`
- Lint: `npm run lint`
- Format: `npm run format`
- Type check: `npm run typecheck`
- Test all: `npm run test`
- Test single file: `npm test -- path/to/test.spec.ts`

## Code Style Guidelines
- **Formatting**: Use Prettier with config in .prettierrc
- **Imports**: Group and sort imports (React, third-party, internal)
- **Types**: Prefer explicit TypeScript types over `any`
- **Naming**: camelCase for variables/functions, PascalCase for classes/components
- **Error Handling**: Use try/catch blocks and avoid silent failures
- **Components**: Functional components with hooks, avoid class components
- **State Management**: Prefer React Context + useReducer for complex state
- **SCSS**: Use variables and nesting for styling
- **Documentation**: JSDoc for public APIs and complex functions