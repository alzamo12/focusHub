// import TaskCard from '../../features/Tasks/TaskCard';
import TaskCard from "../../components/Tasks/TaskCard";
import useSortedData from '../../hooks/useSortedData';

const TasksGrid = ({ type, tasks, activeTab, handleDelete, handleEdit }) => {
    const sortedData = useSortedData({ tasks, type });
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {sortedData?.length > 0 ?
                sortedData?.map((task) => (
                    <TaskCard key={task._id} activeTab={activeTab} task={task} handleDelete={handleDelete} handleEdit={handleEdit} />
                ))
                :
                <div>No classes available here</div>
            }
        </div>
    );
};

export default TasksGrid;