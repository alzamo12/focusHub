import DatePicker from 'react-datepicker';
import { Controller } from 'react-hook-form';
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import TimeInput from '../../components/Inputs/TimeInput';
import ReactQuill from "react-quill-new"
import CommonInput from '../../components/Inputs/add_Class_And_Task_Form_Inputs/CommonInput';
import DateInput from '../../components/Inputs/add_Class_And_Task_Form_Inputs/DateInput';
import Clock from '../../components/Inputs/add_Class_And_Task_Form_Inputs/Clock';
import SelectInput from '../../components/Inputs/add_Class_And_Task_Form_Inputs/SelectInput';
import AddButton from '../../components/buttons/addClassAndTaskSubmitButton/AddButton';
import subjects from "../../data/subjects.json";

const level = [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
    { value: "complex", label: "Complex" },
];
const AddTaskForm = ({ register, handleSubmit, handleAddTask, control, buttonText }) => {
    const inputCommonStyles = "input input-bordered w-full bg-white dark:bg-black border-primary dark:text-white"

    return (
        <form onSubmit={handleSubmit(handleAddTask)} className="flex flex-col md:space-y-0 md:grid md:grid-cols-2 gap-4 mb-6">
            <CommonInput
                register={register}
                inputCommonStyles={inputCommonStyles}
                placeholder="Module Name"
                inputName="module"
            />

            <SelectInput
                inputName={`subject`}
                control={control}
                options={subjects}
                placeholder={`Choose Subject`}
            />

            <DateInput
                control={control}
                inputCommonStyles={inputCommonStyles}
            />

            <Clock
                inputName="startTime"
                control={control}
                inputCommonStyles={inputCommonStyles}
            />

            <Clock
                inputName="endTime"
                control={control}
                inputCommonStyles={inputCommonStyles}
            />

            <SelectInput
                inputName={`level`}
                control={control}
                options={level}
                placeholder={`Choose Level`}
            />

            <CommonInput
                register={register}
                inputCommonStyles={`${inputCommonStyles} textarea col-span-2`}
                placeholder="Describe your task"
                inputName="description"
            />

            <AddButton text={buttonText} />
        </form>
    );
};

export default AddTaskForm;