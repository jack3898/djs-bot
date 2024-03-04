import { Bytes } from './fileSize.js';
import { it, expect } from 'vitest';

it("should take KB and return it's value in bytes", () => {
    const bytes = Bytes.fromKB(1);

    expect(bytes.B).toBe(1000);
});

it("should take MB and return it's value in bytes", () => {
    const bytes = Bytes.fromMB(1);

    expect(bytes.B).toBe(1000000);
});

it("should take GB and return it's value in bytes", () => {
    const bytes = Bytes.fromGB(1);

    expect(bytes.B).toBe(1000000000);
});

it("should take TB and return it's value in bytes", () => {
    const bytes = Bytes.fromTB(1);

    expect(bytes.B).toBe(1000000000000);
});

it('should give bytes', () => {
    const bytes = new Bytes(1000);

    expect(bytes.B).toBe(1000);
});

it('should give kilobytes', () => {
    const bytes = new Bytes(1000);

    expect(bytes.kB).toBe(1);
});

it('should give megabytes', () => {
    const bytes = new Bytes(1000000);

    expect(bytes.mB).toBe(1);
});

it('should give gigabytes', () => {
    const bytes = new Bytes(1000000000);

    expect(bytes.gB).toBe(1);
});

it('should give terabytes', () => {
    const bytes = new Bytes(1000000000000);

    expect(bytes.tB).toBe(1);
});

it('should give bytes friendly', () => {
    const bytes = new Bytes(1000);

    expect(bytes.BFriendly).toBe('1000B');
});

it('should give kilobytes friendly', () => {
    const bytes = Bytes.fromKB(1);

    expect(bytes.kBFriendly).toBe('1KB');
});

it('should give megabytes friendly', () => {
    const bytes = Bytes.fromMB(1);

    expect(bytes.mBFriendly).toBe('1MB');
});

it('should give gigabytes friendly', () => {
    const bytes = Bytes.fromGB(1);

    expect(bytes.gBFriendly).toBe('1GB');
});

it('should give terabytes friendly', () => {
    const bytes = Bytes.fromTB(1);

    expect(bytes.tBFriendly).toBe('1TB');
});

it("should be stringified to it's value in megabytes", () => {
    const bytes = Bytes.fromMB(1);

    expect(`${bytes}`).toBe('1MB');
});
