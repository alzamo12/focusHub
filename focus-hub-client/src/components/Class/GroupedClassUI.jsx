import ClassesGrid from './ClassesGrid';

const GroupedClassUI = ({ classes, handleDelete, handleEdit, activeTab, type }) => {
    // const sortedData = [...classes].sort(
    //     (a, b) => new Date(a.date) - new Date(b.date)
    // );
    // console.log(sortedData)
    const sortedData = [...classes].sort((a, b) => {
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
    return (
        <div>
            {sortedData.map((day) => (
                <div key={day.date} className='my-10'>
                    <h3 className='text-bold text-2xl underline my-4'>{day.date}</h3>

                    <ClassesGrid classes={day?.classes}
                        handleDelete={handleDelete}
                        handleEdit={handleEdit}
                        activeTab={activeTab}
                    />
                </div>
            ))}

        </div>
    );
};

export default GroupedClassUI;