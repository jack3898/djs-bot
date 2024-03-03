import { JWT, JWTError } from './jwt.js';
import { expect, it } from 'vitest';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const jwtSchema = z.object({
    testData: z.string()
});

const jwtUtil = new JWT('test_secret', jwtSchema);

it('should sign and verify the secret', async () => {
    const signed = await jwtUtil.sign({ testData: 'test' });
    const verified = await jwtUtil.verify(signed);

    expect(verified).toEqual({ testData: 'test' });
});

it('should throw an error when signing invalid data', async () => {
    // @ts-expect-error - types are naturally complaining about this, but it's intentional.
    const signed = jwtUtil.sign({ invalidKey: 'test' });

    await expect(signed).rejects.toThrow(JWTError);
});

it('should throw an error when verifying invalid token', async () => {
    const signed = await jwtUtil.sign({ testData: 'test' });
    const verified = jwtUtil.verify(signed + 'invalid');

    await expect(verified).rejects.toThrow(JWTError);
});

it('should throw an error when verifying invalid data', async () => {
    // The class is so robust that it will throw a validation error during the signing process.
    // So we need to use the jwt package directly to sign the token.
    const signed = jwt.sign({ invalidKey: 'test' }, 'test_secret');
    const verified = jwtUtil.verify(signed);

    await expect(verified).rejects.toThrow(JWTError);
});

it('should throw an error when verifying invalid secret', async () => {
    const signed = jwt.sign({ testData: 'test' }, 'invalid_secret');
    const verified = jwtUtil.verify(signed);

    await expect(verified).rejects.toThrow(JWTError);
});
