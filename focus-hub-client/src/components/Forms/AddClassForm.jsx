import DatePicker from 'react-datepicker';
import { Controller } from 'react-hook-form';
import "react-datepicker/dist/react-datepicker.css";
import CommonInput from '../Inputs/add_Class_And_Task_Form_Inputs/CommonInput';
import DateInput from '../Inputs/add_Class_And_Task_Form_Inputs/DateInput';
import Clock from '../Inputs/add_Class_And_Task_Form_Inputs/Clock';
import SelectInput from '../Inputs/add_Class_And_Task_Form_Inputs/SelectInput';
import AddButton from '../buttons/addClassAndTaskSubmitButton/AddButton';
import subjects from "../../data/subjects.json";
const AddClassForm = ({ handleSubmit, onSubmit, register, control, buttonText }) => {

    const inputCommonStyles = "input input-bordered w-full bg-white dark:bg-black border-primary dark:text-white"

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:grid md:grid-cols-2 gap-4 mb-6">
            {/* Module name */}
            <CommonInput
                register={register}
                inputCommonStyles={inputCommonStyles}
                placeholder="Module Name"
                inputName="module"
            />

            <SelectInput
                inputName="subject"
                control={control}
                options={subjects}
                placeholder="Choose Subject"
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

            <CommonInput
                register={register}
                inputCommonStyles={inputCommonStyles}
                placeholder="Instructor"
                inputName="instructor"
            />

            <CommonInput
                register={register}
                inputCommonStyles={inputCommonStyles}
                placeholder="Room No."
                inputName="room"
            />

            <CommonInput
                register={register}
                inputCommonStyles={inputCommonStyles}
                placeholder="Building No."
                inputName="building"
            />

            <AddButton text={buttonText} />
        </form>
    );
};

export default AddClassForm;