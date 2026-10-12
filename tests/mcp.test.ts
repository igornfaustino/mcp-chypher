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
    return response.structuredContent.encryptedMessage;
}

async function decryptMessage(client: Client, encryptedMessage: string, encryptionKey: string) {
    const response = await client.callTool({
        name: "decrypt_message",
        arguments: {
            encryptedMessage,
            encryptionKey,
        },
    }) as unknown as { structuredContent: { decryptedMessage: string } };
    return response.structuredContent.decryptedMessage;
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
        const message = 'Hello, World!';
        const encrypted = await encryptMessage(client, message, encryptionKey);
        assert.ok(encrypted, 'Encrypted message should be returned');
    });

    it('should decrypt a message', async () => {
        const message = 'Hello, World! MCP Test';
        const encrypted = await encryptMessage(client, message, encryptionKey);
        const decrypted = await decryptMessage(client, encrypted, encryptionKey);
        assert.strictEqual(decrypted, message, 'Decrypted message should match the original');
    });
})