/**
 * Check if a value is an integer
 * @param param value which should meet the regex
 */
export function isInt(param: string): boolean {
    return /[0-9]+/.test(param);
}
