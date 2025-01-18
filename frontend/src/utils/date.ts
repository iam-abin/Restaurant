/**
 * Formats a date string to a human-readable date format along with the time.
 * The resulting format is: day/month/year hour:minute AM/PM (e.g., 19/03/2024 08:50 AM).
 *
 * @param {string} dateString - The date string to be formatted.
 * @returns {string} The formatted date and time string in the format "day/month/year hour:minute AM/PM".
 */
export const formatDateWithTime = (dateString: string): string => {
    const date: Date = new Date(dateString);

    const formattedDateTime: string = date.toLocaleString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    // Extract individual components
    const [datePart, timePart]: string[] = formattedDateTime.split(', ');
    const [month, day, year]: string[] = datePart.split('/');

    // Format as day/month/year
    const formattedDate: string = `${day}/${month}/${year} ${timePart}`;
    return formattedDate;
};

/**
 * Formats a date string to a human-readable date format (e.g., 03/19/2024).
 *
 * @param {string} dateString - The date string to be formatted.
 * @returns {string} The formatted date string in the default locale date format.
 */
export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
};

/**
 *
 * @returns Returns the current year, using local time.
 */
export const getThisYear = () => new Date().getFullYear();
