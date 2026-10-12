import { Client } from "@modelcontextprotocol/sdk/client";
import assert from 'node:assert';
import { after, before, describe, it } from "node:test";

async function encryptMessage(client: Client, message: string, encryptionKey: string) {
    const response = await client.callTool({
        name: "encrypt_message",
        arguments: {
            message,
            encryptionKey,
        },
    }) as unknown as { structuredContent: { encryptedMessage: string } };
    return response
}

describe("MCP Server", () => {
    let client: Client;
    let encryptionKey = 'super-secret-key';

    before(async () => {
        const { createTestClient } = await import("./helpers.ts");
        client = await createTestClient();
    });

    after(async () => {
        await client.close();
    });

    it('should encrypt a message', async () => {
        const encrypted = await encryptMessage(client, 'Hello, World!', encryptionKey);
        assert.ok(encrypted.structuredContent.encryptedMessage, 'Encrypted message should be returned');
    });
    it.todo('should decrypt a message')
})