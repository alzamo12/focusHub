import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import AddClassForm from '../../components/Forms/AddClassForm';
import { toast } from 'react-toastify';
import { formatTime } from '../../utils/formatTime';
import combineDateTime from '../../utils/combineDateTime';


const subjects = [
    { value: "math", label: "Math" },
    { value: "english", label: "English" },
    { value: "bangla", label: "Bangla" },
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "biology", label: "Biology" },
    { value: "ict", label: "ICT" },
    { value: "religion", label: "Religion" },
    { value: "economics", label: "Economics" },
    { value: "geography", label: "Geography" }
];
const EditClass = ({ cls, activeTab }) => {
    const { _id, userEmail, module, instructor, room, building, subject, date, startTime, endTime } = cls;
    const queryClient = useQueryClient();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const {
        register,
        handleSubmit,
        control,
    } = useForm({
        defaultValues: {
            module: module,
            instructor: instructor,
            room: room,
            building: building,
            subject: subject,
            date: date,
            startTime: formatTime(startTime),
            endTime: formatTime(endTime)
        },
    });

    const { mutateAsync: classEditAsync } = useMutation({
        mutationFn: async (data) => {
            const res = await axiosSecure.patch(`/classes/${_id}`, data);
            return res?.data
        },
        onSuccess: async (data) => {
            // console.log(data)
            if (data.success) {
                toast.success("class updated successfully");
                queryClient.invalidateQueries(["classes", user?.email, activeTab])
            }
        },
        onError: (err) => {
            console.log(err)
            toast.error(err.message)
        }
    })

    const onSubmit = (data) => {
        // console.log(data)
        if (user.email !== userEmail) {
            return alert("you can't change this class")
        }

        const newData = {
            ...data,
            startTime: combineDateTime(data.date, data.startTime),
            endTime: combineDateTime(data.date, data.endTime)
        }

        classEditAsync(newData)
        // mutateAsync(newData);
        // console.log(data)
    };

    return (
        <div className="p-6 w-full mx-auto bg-[--color-base-100] h-auto">
            <h2 className="text-2xl font-bold text-[--color-primary] mb-4">Class Schedule</h2>

            <AddClassForm
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                register={register}
                control={control}
                subjects={subjects}
                buttonText={`Edit Class`}
            />
        </div>
    );
};

export default EditClass;