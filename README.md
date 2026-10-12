# mcp-chypher

A learning project to explore the **Model Context Protocol (MCP)** by building a simple encryption/decryption MCP server.

This project was created to understand how MCP servers work — including tools, resources, and prompts — using the official `@modelcontextprotocol/sdk`.

---

## What it does

| Capability | Name | Description |
|---|---|---|
| 🔧 Tool | `encrypt_message` | Encrypts a plain-text message with a passphrase |
| 🔧 Tool | `decrypt_message` | Decrypts a previously encrypted message with the same passphrase |
| 📄 Resource | `encryption://info` | Returns details about the algorithm, key derivation, and output format |
| 💬 Prompt | `encrypt_message_prompt` | Pre-built prompt that asks the agent to encrypt a message |

### How encryption works

- **Algorithm**: AES-256-CBC
- **Key derivation**: `scrypt(passphrase, fixedSalt, 32)` — you pass any passphrase string; the server derives a strong 32-byte key automatically
- **Output format**: `<IV in hex>:<ciphertext in hex>` — keep the full string to decrypt later
- **IV**: a fresh random 16-byte IV is generated on every encryption call, so the same message encrypted twice produces different output

---

## Prerequisites

- **Node.js v24+** (see `engines` in `package.json`)

---

## Installation

```bash
npm install
```

No build step is needed — the server runs TypeScript directly via Node.js native TypeScript support (`--experimental-strip-types`).

---

## Using in VS Code

### 1. Add the MCP server configuration

Create (or open) `.vscode/mcp.json` in your workspace and add:

```json
{
  "servers": {
    "mcp-chypher": {
      "command": "node",
      "args": ["--experimental-strip-types", "ABSOLUTE_PATH_TO_PROJECT/src/index.ts"]
    }
  }
}
```

> **Tip:** You can also add this server to your user-level MCP config at `~/.vscode/mcp.json` to make it available in every workspace.

### 2. Reload VS Code

Open the Command Palette (`Cmd+Shift+P`) and run **Developer: Reload Window** (or just restart VS Code).

### 3. Use it in Copilot Chat

Open Copilot Chat (Agent mode) and try:

```
Encrypt the message "Hello, World!" using the passphrase "my-secret-key"
```

```
Decrypt this message: a3f1...:<ciphertext> using the passphrase "my-secret-key"
```

```
Show me the encryption://info resource
```

The agent will automatically call the appropriate tool and return the result.

---

## Running the MCP Inspector

The MCP Inspector lets you explore and test all tools, resources, and prompts interactively in a browser UI:

```bash
npm run mcp:inspect
```

This opens the inspector at `http://localhost:5173` and connects it to the running server.

---

## Running tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (with debugger)
npm run test:dev
```

The test suite covers:
- Encrypting a message
- Decrypting a message with the correct passphrase
- Listing and reading the `encryption://info` resource
- Fetching the `encrypt_message_prompt`
- Error: decrypting with the wrong passphrase
- Error: decrypting a malformed ciphertext

---

## Project structure

```
src/
  index.ts    # Entry point — connects the server to stdio transport
  mcp.ts      # All tools, resources, and prompts are registered here
  service.ts  # Encryption/decryption logic using Node.js crypto
tests/
  mcp.test.ts # Integration tests using the MCP SDK test client
  helpers.ts  # Test helper to create a test client
```

---

## Available scripts

| Script | Description |
|---|---|
| `npm start` | Start the server (used by MCP clients) |
| `npm run dev` | Start with file-watch and Node.js inspector |
| `npm test` | Run all tests |
| `npm run test:dev` | Run tests in watch mode |
| `npm run mcp:inspect` | Open the MCP Inspector UI |

---

## Learning goals

This project demonstrates:

1. **MCP Server setup** — Creating an `McpServer` instance and connecting via `StdioServerTransport`
2. **Tools** — Registering tools with input/output schemas using Zod
3. **Resources** — Exposing static/dynamic resources via URI schemes
4. **Prompts** — Creating reusable prompt templates with argument schemas
5. **Testing** — Using the MCP SDK's test client for integration tests
6. **TypeScript** — Running TS directly in Node.js without a build step

---

## License

ISC