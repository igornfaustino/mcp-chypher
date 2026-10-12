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

    it('should list the encryption://info resource', async () => {
        const { resources } = await client.listResources();
        const info = resources.find(item => item.uri === 'encryption://info');
        assert.ok(info, 'encryption://info resource should be listed');
    });

    it('should return the encrypt_message_prompt', async () => {
        const result = await client.getPrompt({
            name: 'encrypt_message_prompt',
            arguments: {
                message: 'Secret text',
                encryptionKey,
            }
        })

        const item = result.messages.at(0)?.content as unknown as { text: string }
        const expected = `Please encrypt the following message using the encrypt_message tool.
Message: Secret text
Encryption key: ${encryptionKey}`
        assert.deepStrictEqual(
            item.text,
            expected,
            'Prompt should be in the correct format'
        )
    })
})