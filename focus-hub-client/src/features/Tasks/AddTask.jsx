import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import combineDateTime from "../../utils/combineDateTime";
import AddTaskForm from "../../components/Forms/AddTaskForm";


const AddTask = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        control,
        // formState: { errors },
    } = useForm({
        // resolver: zodResolver(classSchema),
        defaultValues: {
            instructor: "Zakir"
        },
    });

    const { mutateAsync: addTaskAsync } = useMutation({
        mutationFn: async (newTask) => {
            const res = await axiosSecure.post("/tasks", newTask);
            return res.data;
        },
        onSuccess: (result) => {
            // console.log(result)
            if (result?.success) {
                toast.success('Your data has inserted successfully')
                queryClient.invalidateQueries(["tasks"]);
            }
        },
        onError: (err) => {
            console.log(err)
            const message = err?.response?.data?.message || "Server error occurred. Please try again later"
            toast.error(message)
        }
    });

    const handleAddTask = (data) => {
        const updatedData = {
            ...data,
            startTime: combineDateTime(data.date, data.startTime),
            endTime: combineDateTime(data.date, data.endTime)
        }
        addTaskAsync(updatedData);
        // console.log(updatedData)
    };
    return (
        <div className="bg-white dark:bg-black border-2 border-primary p-6 w-full mx-auto h-auto">
            <h2 className="card-title mb-4">Describe Your Goal!</h2>
            <AddTaskForm
                handleAddTask={handleAddTask}
                handleSubmit={handleSubmit}
                register={register}
                control={control}
                buttonText={`Add Task`}
            // subjects={subjects}
            // level={level}
            />
        </div>
    );
};

export default AddTask;