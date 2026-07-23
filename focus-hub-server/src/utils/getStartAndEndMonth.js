export const getStartAndEndMonth = (year = 2026, month = 7) => {
    const numYear = Number(year);
    const numMonth = Number(month);

    const now = new Date();

    const startOfMonth = new Date(numYear, numMonth - 1, 1);
    const endOfMonth = new Date(numYear, numMonth, 1);

    const result = {
        startOfMonth,
        endOfMonth
    };

    return result;
}