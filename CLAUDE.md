# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run build      # Compile TypeScript + copy icons to dist/
npm run dev        # Watch mode for development
npm run lint       # Check ESLint rules
npm run lintfix    # Auto-fix linting issues
npm run format     # Format with Prettier
```

## Architecture

This is an **N8N Community Node Package** (`n8n-nodes-linkedinoutreach`) that provides a custom LinkedIn outreach node for N8N workflows.

### Structure

- **`/credentials/`** - Authentication configuration (userId, apiKey, account_id)
- **`/nodes/LinkedinOutreach/`** - Main node implementation
  - `LinkedinOutreach.node.ts` - INodeType implementation with execute logic
  - `descriptions/UserDescription.ts` - Operation definitions and field schemas
  - `GenericFunctions.ts` - Shared `linkedinApiRequest()` helper for API calls
- **`/dist/`** - Compiled output (do not edit directly)

### Backend Integration

The node communicates with a Supabase backend:
- Base URL: `https://rnmqfhwsqojadktbxnrf.supabase.co/functions/v1`
- Endpoints: `/users` (GET), `/users/invite` (POST), `/get-messages` (POST)

### N8N Node Pattern

Operations are defined in description files and referenced in the main node class. The `execute()` method handles routing based on resource/operation combinations.

### External Documentation

- [Unipile Getting Started](https://developer.unipile.com/docs/getting-started)
- [Account Connection Guide](https://developer.unipile.com/docs/connect-accounts#google-chrome-extension-case)
