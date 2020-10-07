export class Exception extends Error {
    constructor(public code: number, message: string) {
        super(message);
    }
}
