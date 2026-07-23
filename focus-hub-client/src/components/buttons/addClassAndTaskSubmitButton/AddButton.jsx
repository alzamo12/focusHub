import React from 'react';

const AddButton = ({ text }) => {
    return (
        <button
            type="submit"
            className="btn col-span-2 not-dark:text-black bg-primary dark:bg-black dark:border-accent dark:hover:shadow-white
                hover:shadow-2xs"
        >
            {text}
        </button>
    );
};

export default AddButton;