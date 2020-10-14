export const getConditionals = (filter?: Object): string => {
    let conditional = "TRUE";
    if (filter) {
        Object.keys(filter).forEach((key: string) => {
            conditional += ` AND ${escape(key)} = '${escape(
                (filter as any)[key]
            )}'`;
        });
    }

    return conditional;
};
