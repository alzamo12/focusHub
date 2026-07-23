import React from 'react';

const useInputStyles = () => {
    const isDark = localStorage.getItem("theme") === 'dark';
    const selectBGColor = isDark ? "black" : "white";
    const cyanColor = "#33c7d8";
    const skyColor = "#7DD3FC"
    const customStyles = {
        control: (baseStyles) => ({
            ...baseStyles,
            borderRadius: '5px',
            backgroundColor: selectBGColor,
            borderColor: isDark ? "#33c7d8" : '#7DD3FC'
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: selectBGColor

        }),
        // The list inside the dropdown
        menuList: (base) => ({
            ...base,
            backgroundColor: selectBGColor
        }),

        // Each option
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? isDark ? cyanColor : skyColor //4f46e5
                : state.isFocused
                    ? isDark ? cyanColor : skyColor
                    : isDark ? 'black' : 'white',
            color: isDark ? "white" : 'black',
            cursor: "pointer",
            // ":active": {
            //     backgroundColor: "hsl(var(--bc) / 0.6)",
            // },
        }),
        placeholder: (base) => ({
            ...base,
        }),
        singleValue: (base) => ({
            ...base,
            color: isDark && 'white'
        }),
    };
    return customStyles
};

export default useInputStyles;