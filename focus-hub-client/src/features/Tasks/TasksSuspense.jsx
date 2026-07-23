import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import TasksGrid from '../../components/Tasks/TasksGrid';
import GroupTaskUI from '../../components/Tasks/GroupTaskUI';
const TasksSuspense = ({ setTotalPages, activeTab, pageView, page }) => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const limit = 5;
    // add a task
    const { data: tasksData } = useQuery({
        queryKey: ['task', user?.email, activeTab, pageView, page, limit],
        queryFn: async () => {
            const res = await axiosSecure.get(`/tasks?email=${user?.email}&type=${activeTab}&view=${pageView}&page=${page}&limit=${limit}`);
            if (res.data.success) {
                setTotalPages(res.data.data.totalPages);
            }
            return res.data
        },
        suspense: true
    });
    // console.log(tasksData)
    const { tasks = [], view = 'flat', type } = tasksData.data || {};

    // delete a task by id
    const { mutateAsync: deleteAsync } = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.delete(`/tasks/${id}`);
            return res.data
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success('your task has deleted successfully');
                queryClient.invalidateQueries({ queryKey: ['task'] })
            }
            // console.log(data)
        },
        onError: (err) => {
            const message = err.response.data.message || 'Internal error';
            toast.error(message);
            // console.log(err.response.data)
        }
    });

    // delete task function
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteAsync(id);
            }
        });
    };

    // edit task function
    const handleEdit = (id) => {
        // console.log(id)
        document.getElementById(`my_module_${id}`).showModal();
    };

    let content;
    if (tasks?.length > 0) {
        const safeView = view?.toLowerCase() ?? 'flat';
        switch (safeView) {
            case 'flat':
                content = (
                    <TasksGrid
                        type={type}
                        tasks={tasks}
                        handleDelete={handleDelete}
                        handleEdit={handleEdit}
                        activeTab={activeTab}
                    />
                );
                break;
            case 'group':
                content = (
                    <GroupTaskUI
                        tasks={tasks}
                        handleDelete={handleDelete}
                        handleEdit={handleEdit}
                        type={type}
                    />
                );
                break;
            default:
                content = (
                    <div>Invalid View</div>
                );
        }
    } else {
        content = (<div>No classes available here</div>)
    }
    return (
        <div>
            <h2 className="text-2xl font-bold text-[--color-primary] mb-4">Tasks Schedule</h2>
            <div>
                {content}
            </div>
        </div>
    );
};

export default TasksSuspense;