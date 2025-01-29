/**
 * Checks if a file type matches the specified type.
 *
 * @param {File} file - File to be checked.
 * @param {string} startsWith - Starting value of the target file type (e.g., 'image' for  'image/jpeg', 'image/png'
 * , 'video' for 'video/mp4').
 * @returns {boolean} `true` if the file type is valid, `false` otherwise.
 */
export const checkFileType = (file: File, startsWith: string): boolean => {
    return file.type.startsWith(`${startsWith}/`);
};
