import React from 'react';

const TabAndView = ({ activeTab, handleActiveTab, handlePageView }) => {
    return (
        <div className="flex flex-col md:flex-row gap-5 md:gap-10 mb-10 text-black dark:text-white">
            {/* next and prev classes tab */}
            <div className="tabs tabs-border">
                <input
                    type="radio"
                    name="my_tabs_2"
                    checked={activeTab === "next"}
                    onChange={() => handleActiveTab("next")}
                    className="tab"
                    aria-label="Next Classes" />
                {/* <div className="tab-content border-base-300 bg-base-100 p-10">Next Classes</div> */}

                <input
                    type="radio"
                    name="my_tabs_2"
                    checked={activeTab === "prev"}
                    onChange={() => handleActiveTab("prev")}
                    className="tab"
                    aria-label="Previous Classes"
                />
                {/* <div className="tab-content border-base-300 bg-base-100 p-10">Previous Classes</div> */}

            </div>
            {/* make a view toggle button */}
            <select onChange={handlePageView} defaultValue="Flat" className="select mx-3 w-3/4 md:w-72">
                <option>Flat</option>
                <option>Group</option>
            </select>
        </div>
    );
};

export default TabAndView;