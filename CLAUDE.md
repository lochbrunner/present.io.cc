# CLAUDE.md - Guidelines for Claude Code

## Build & Test Commands
- Build: `npm run build`
- Dev mode: `npm start`
- Lint: `npm run lint` (ESLint with TypeScript, React, Hooks plugins)
- Format: `npm run format` (Prettier)
- Type check: `npm run typecheck` (TypeScript)
- Test all: `npm run test` (Jest)
- Test single file: `npm test -- path/to/test.spec.ts`
- Deploy to GitHub Pages: `npm run deploy`

## Code Style Guidelines
- **Formatting**: Prettier (singleQuote: true, tabWidth: 2, printWidth: 100)
- **Imports**: Group imports (React, third-party, internal)
- **Types**: Use TypeScript interfaces/types, avoid `any`
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Components**: Functional components with hooks, explicit React.FC typing
- **State Management**: useState for simple state, useReducer for complex
- **SCSS**: Use variables and nesting, follow BEM methodology
- **Documentation**: JSDoc for public APIs and complex functions
- **Error Handling**: Use try/catch blocks with specific error handling