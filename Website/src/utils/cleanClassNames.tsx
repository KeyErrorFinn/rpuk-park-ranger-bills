export const CClean = (classes: string) => {
    return classes
        .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
        .trim();
};