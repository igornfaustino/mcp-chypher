
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod/v3';
import { decrypt, encrypt } from './service.ts';

export const server = new McpServer({
    name: '@igornfaustino/chypher',
    version: '0.0.1',
});

server.registerTool('encrypt_message', {
    description: 'Encrypts a message using a given key.',
    inputSchema: {
        message: z.string().describe('The message to be encrypted.'),
        encryptionKey: z.string().describe('The key used for encryption.'),
    },
    outputSchema: {
        encryptedMessage: z.string().describe('The encrypted message.'),
    }
}, async ({ message, encryptionKey }) => {
    try {
        const encryptedMessage = await encrypt(message, encryptionKey);
        return {
            content: [{
                type: 'text',
                text: encryptedMessage,
            }],
            structuredContent: {
                encryptedMessage: encryptedMessage,
            }
        };
    } catch (error) {
        return {
            isError: true,
            content: [{
                type: 'text',
                text: `failed to encrypt message: ${error instanceof Error ? error.message : String(error)}`,
            }]
        };
    }
});

server.registerTool('decrypt_message', {
    description: 'Decrypts a message using a given key.',
    inputSchema: {
        encryptedMessage: z.string().describe('The encrypted message to be decrypted.'),
        encryptionKey: z.string().describe('The key used for decryption.'),
    },
    outputSchema: {
        decryptedMessage: z.string().describe('The decrypted message.'),
    }
}, async ({ encryptedMessage, encryptionKey }) => {
    try {
        const message = await decrypt(encryptedMessage, encryptionKey);
        return {
            content: [{
                type: 'text',
                text: message,
            }],
            structuredContent: {
                decryptedMessage: message,
            }
        };
    } catch (error) {
        return {
            isError: true,
            content: [{
                type: 'text',
                text: `failed to decrypt message: ${error instanceof Error ? error.message : String(error)}`,
            }]
        };
    }
});