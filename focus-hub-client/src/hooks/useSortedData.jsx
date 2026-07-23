
const useSortedData = ({ tasks, type }) => {
    const sortedData = [...tasks].sort((a, b) => {
        const dateA = new Date(a.startTime);
        const dateB = new Date(b.startTime);

        if (type.toLowerCase() === "next") {
            return dateA - dateB; // ascending
        } else if (type.toLowerCase() === "prev") {
            return dateB - dateA; // descending
        } else {
            return 0; // no change if type is unknown
        }
    });
    return sortedData
};

export default useSortedData;