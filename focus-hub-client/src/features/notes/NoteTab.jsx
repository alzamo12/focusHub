import React from 'react';

const NoteTab = ({ activeTab, handleActiveTab }) => {
    return (
        <div className="flex gap-10">
            {/* next and prev classes tab */}
            <div className="tabs tabs-border mb-10">
                <input
                    type="radio"
                    name="my_tabs_2"
                    checked={activeTab === "create_note"}
                    onChange={() => handleActiveTab("create_note")}
                    className="tab"
                    aria-label="Create Note" />

                <input
                    type="radio"
                    name="my_tabs_2"
                    checked={activeTab === "generate_note"}
                    onChange={() => handleActiveTab("generate_note")}
                    className="tab"
                    aria-label="Generate Note"
                />

            </div>

        </div>
    );
};

export default NoteTab;