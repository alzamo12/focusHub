import React from 'react';
import DatePicker from 'react-datepicker';
import { Controller } from 'react-hook-form';

const DateInput = ({control, inputCommonStyles}) => {
    return (
        <Controller
            name="date"
            control={control}
            rules={{ required: "Please select a date" }}
            render={({ field, fieldState }) => (
                <div>
                    <DatePicker
                        placeholderText="Select date"
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        wrapperClassName="w-full" // Styles the outer container
                        className={`${inputCommonStyles}`}
                    />
                    {fieldState.error && (
                        <p className="text-red-500 mt-1">{fieldState.error.message}</p>
                    )}
                </div>
            )}

        />
    );
};

export default DateInput;