import React from 'react';

const SidebarButton = ({ text, modalName }) => {
    return (
        <button
            className="btn not-dark:btn-secondary dark:btn-ghost dark:border-primary text-white"
            onClick={() => document.getElementById(`${modalName}`).showModal()}
        >{text}
        </button>

    );
};

export default SidebarButton;