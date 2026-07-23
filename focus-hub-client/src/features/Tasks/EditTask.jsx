import React from 'react';
import AddTaskForm from '../../components/Forms/AddTaskForm';
import { useForm } from 'react-hook-form';
import { formatTime } from '../../utils/formatTime';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import combineDateTime from '../../utils/combineDateTime';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const EditTask = ({ task }) => {
    const { module, subject, startTime, endTime, date, level, description, userEmail } = task;
    const { user } = useAuth();
    const {
        control,
        register,
        handleSubmit
    } = useForm({
        defaultValues: {
            module: module,
            subject: subject,
            date: date,
            level: level,
            description: description,
            startTime: formatTime(startTime),
            endTime: formatTime(endTime)
        }
    });
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { mutateAsync: editAsync } = useMutation({
        mutationFn: async (data) => {
            const res = await axiosSecure.patch(`/tasks/${task._id}`, data);
            // const res = await axiosSecure.patch(`/tasks/6a60866ee5cb288279fa45db`, data);
            return res.data
        },
        onSuccess: async (data) => {
            // console.log(data)
            if (data.success) {
                toast.success("Data updated Successfully")
                queryClient.invalidateQueries({ queryKey: ['task'] });
            }
        },
        onError: err => {
            const message = err.response.data.message || 'Internal error';
            toast.error(message)
        }
    })

    const handleEditTask = (data) => {
        if (user.email !== userEmail) {
            return alert("you can't change this class")
        }

        const newData = {
            ...data,
            startTime: combineDateTime(data.date, data.startTime),
            endTime: combineDateTime(data.date, data.endTime)
        }
        editAsync(newData)
    }

    return (
        <div className="bg-white dark:bg-black border-2 border-primary p-6 w-full mx-auto h-auto">
            <h2 className="card-title mb-4">Edit Task</h2>
            <AddTaskForm
                handleAddTask={handleEditTask}
                handleSubmit={handleSubmit}
                control={control}
                register={register}
                buttonText="Edit Task"
            />
        </div>
    );
};

export default EditTask;