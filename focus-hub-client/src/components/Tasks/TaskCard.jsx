import { format } from 'date-fns';
import { formatTime } from '../../utils/formatTime';
import SidebarButton from '../../components/buttons/SidebarModelOpenButton/SidebarButton';
import { NotebookPen } from 'lucide-react';
import EditTask from '../../features/Tasks/EditTask';

const TaskCard = ({ task, handleDelete }) => {
    const startTime = formatTime(task?.startTime);
    const endTime = formatTime(task?.endTime);
    return (
    
        <div className=''>
            <div
                key={task._id}
                className="p-4 rounded-xl flex flex-col lg:flex-row justify-between items-center 
                 bg-base-100 dark:text-white border border-primary hover:shadow-2xl shadow-primary
                  ">
                <div className='w-full space-y-1'>
                    <div className='flex gap-4'>
                        <h3 className="font-bold text-xl md:text-2xl text-[--color-primary]">{task?.module}</h3>
                        <button
                            className='cursor-pointer dark:text-primary'
                            onClick={() => document.getElementById(`my_task_description_${task._id}`).showModal()}
                        ><NotebookPen width={20} height={25} />
                        </button>
                    </div>
                    <h3 className="font-bold text-base md:text-lg text-[--color-primary]"><u>Sub:</u> {task?.subject}</h3>
                    <p className="text-sm text-[--color-accent]">{format(task?.date, 'MM/dd/yyyy')} | {startTime} - {endTime}</p>
                    <div className="badge badge-soft badge-info mt-2 dark:text-primary">{task.level}</div>
                </div>
                <div className="flex justify-between w-full lg:w-auto mt-4 lg:mt-0 flex-row lg:flex-col gap-2">
                    <button
                        onClick={() => handleDelete(task._id)}
                        className="btn not-dark:btn-secondary dark:btn-ghost 
                        dark:border-primary text-white"
                    >Delete</button>

                    <SidebarButton
                        text={`Edit`}
                        modalName={`my_task_${task._id}`}
                    />
                </div>
            </div>

            {/* Edit Class Modal */}
            <dialog id={`my_task_${task._id}`} className="modal">
                <div className="modal-box max-w-4xl mx-auto p-0">
                    {/*  */}
                    <EditTask task={task} />
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            {/* description modal */}
            <dialog id={`my_task_description_${task._id}`} className="modal border border-primary">
                <div className="modal-box border-2 border-primary">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost text-secondary absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Task Description</h3>
                    <p className="py-4">{task?.description}</p>
                </div>
            </dialog>
        </div>
    );
};

export default TaskCard;