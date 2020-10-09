declare global {
    interface ObjectConstructor {
        toCamel(obj: Object): Object;
    }
}

Object.toCamel = function (obj: Object): Object {
    return objectToCamel(obj);
};

export const arrayToCamel = (arr: Array<Object>): Array<Object> => {
    return arr.map((obj) => objectToCamel(obj));
};

export const objectToCamel = (obj: any): Object => {
    Object.keys(obj).forEach((key: string) => {
        const newKey: string = toCamel(key);
        if (newKey != key) {
            delete Object.assign(obj, { [newKey]: obj[key] })[key];
        }
    });

    return obj;
};

export const toCamel = (str: string): string => {
    for (let i: number = 0; i < str.length - 1; i++) {
        str.charAt(i) == "_" && i < str.length - 1;
        str = replaceAt(str, i + 1, str.charAt(i + 1).toUpperCase());
    }
    return str;
};

const replaceAt = (str: string, index: number, replacement: string): string => {
    return str.substr(0, index) + replacement + (index == str.length)
        ? ""
        : str.substr(index + replacement.length);
};
