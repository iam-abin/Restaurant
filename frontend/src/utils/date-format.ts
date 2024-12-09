// to format date along with time eg:- 19/03/2024 08:50 AM
export const formatDateWithTime = (dateString: string): string => {
    const date = new Date(dateString);

    const formattedDateTime = date.toLocaleString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    // Extract individual components
    const [datePart, timePart] = formattedDateTime.split(", ");
    const [month, day, year] = datePart.split("/");

    // Format as day/month/year
    const formattedDate = `${day}/${month}/${year} ${timePart}`;
    return formattedDate;
};

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
};