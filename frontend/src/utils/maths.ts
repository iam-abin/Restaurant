/**
 *
 * @param {number} number - It can be any number
 * @returns {number} - Returns next power of 10, (eg:- if number is 54, will return 100. if number is 734, will return 100)
 */
export const getNextPowerOfTen = (number: number): number => {
    const length = number.toString().length; // Get the number of digits
    const base = Math.pow(10, length); // Calculate the smallest power of 10 for that length
    return base;
};
