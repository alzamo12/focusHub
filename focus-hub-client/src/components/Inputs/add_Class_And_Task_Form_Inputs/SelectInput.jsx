import React from 'react';
import { Controller } from 'react-hook-form';
import Select from "react-select";
import useInputStyles from '../../../hooks/useInputStyles';

const SelectInput = ({ control, inputName, options, placeholder }) => {
    // const isDark = localStorage.getItem("theme") === 'dark';
    // const selectBGColor = isDark ? "black" : "white";
    // const cyanColor = "#33c7d8";
    // const skyColor = "#7DD3FC"
    // const customStyles = {
    //     control: (baseStyles) => ({
    //         ...baseStyles,
    //         borderRadius: '5px',
    //         backgroundColor: selectBGColor,
    //         borderColor: isDark ? "#33c7d8" : '#7DD3FC'
    //     }),
    //     menu: (base) => ({
    //         ...base,
    //         backgroundColor: selectBGColor

    //     }),
    //     // The list inside the dropdown
    //     menuList: (base) => ({
    //         ...base,
    //         backgroundColor: selectBGColor
    //     }),

    //     // Each option
    //     option: (base, state) => ({
    //         ...base,
    //         backgroundColor: state.isSelected
    //             ? isDark ? cyanColor : skyColor //4f46e5
    //             : state.isFocused
    //                 ? isDark ? cyanColor : skyColor
    //                 : isDark ? 'black' : 'white',
    //         color: isDark ? "white" : 'black',
    //         cursor: "pointer",
    //         // ":active": {
    //         //     backgroundColor: "hsl(var(--bc) / 0.6)",
    //         // },
    //     }),
    //     placeholder: (base) => ({
    //         ...base,
    //     }),
    //     singleValue: (base) => ({
    //         ...base,
    //         color: isDark && 'white'
    //     }),
    // };
    const customStyles = useInputStyles();
    return (
        <Controller
            name={inputName}
            required={true}
            control={control}
            render={({ field }) => (
                <Select {...field}
                    onChange={(selectedOption) => field.onChange(selectedOption?.value)} // only store value
                    value={options.find((s) => s.value === field.value) || null}
                    options={options} placeholder={placeholder}
                    styles={customStyles}
                    className='border border-primary rounded-[5px]'
                />
            )}

        />
    );
};

export default SelectInput;