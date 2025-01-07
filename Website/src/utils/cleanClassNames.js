export const CClean = (classes) => {
    return classes
        .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
        .trim();
};