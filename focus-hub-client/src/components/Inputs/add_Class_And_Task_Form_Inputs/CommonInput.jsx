import React from 'react';

const CommonInput = ({ register, inputCommonStyles, inputName, placeholder }) => {
    return (
        <input
            {...register(inputName)}
            placeholder={placeholder}
            className={`${inputCommonStyles}`}
        />
    );
};

export default CommonInput;