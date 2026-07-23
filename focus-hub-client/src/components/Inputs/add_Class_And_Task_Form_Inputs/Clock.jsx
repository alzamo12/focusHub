import React from 'react';
import { Controller } from 'react-hook-form';
import TimeInput from '../TimeInput';

const Clock = ({ inputName, control, inputCommonStyles }) => {
    return (
        <Controller
            name={inputName}
            control={control}
            render={({ field }) => (
                <TimeInput {...field} inputCommonStyles={inputCommonStyles} />
            )}
        />

    );
};

export default Clock;