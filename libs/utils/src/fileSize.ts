/**
 * Convert file sizes between different units.
 *
 * You might find this class overkill, but I think it's handy!
 * It forces you to think about the units you're working with and ensures you're not mixing them up.
 *
 * Works in base 10, not base 2! (1KB = 1000B, not 1024B). This is the standard for file sizes on disk. RAM is a different story.
 */
export class Bytes {
    constructor(public B: number) {}

    static fromB(B: number): Bytes {
        return new this(B);
    }

    static fromKB(kB: number): Bytes {
        return new this(kB * 1000);
    }

    static fromMB(mB: number): Bytes {
        return new this(mB * Math.pow(1000, 2));
    }

    static fromGB(gB: number): Bytes {
        return new this(gB * Math.pow(1000, 3));
    }

    static fromTB(tB: number): Bytes {
        return new this(tB * Math.pow(1000, 4));
    }

    get kB(): number {
        return this.B / 1000;
    }

    get mB(): number {
        return this.kB / 1000;
    }

    get gB(): number {
        return this.mB / 1000;
    }

    get tB(): number {
        return this.gB / 1000;
    }

    get BFriendly(): `${number}B` {
        return `${this.B}B`;
    }

    get kBFriendly(): `${number}KB` {
        return `${this.kB}KB`;
    }

    get mBFriendly(): `${number}MB` {
        return `${this.mB}MB`;
    }

    get gBFriendly(): `${number}GB` {
        return `${this.gB}GB`;
    }

    get tBFriendly(): `${number}TB` {
        return `${this.tB}TB`;
    }

    toString(): string {
        return this.mBFriendly;
    }
}
