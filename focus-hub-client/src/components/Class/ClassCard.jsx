import { format } from 'date-fns';
import EditClass from '../../features/classschedule/EditClass';
import { formatTime } from '../../utils/formatTime';
import React from 'react';
import SidebarButton from '../buttons/SidebarModelOpenButton/SidebarButton';

const ClassCard = ({ cls, handleDelete, activeTab }) => {
    const startTime = formatTime(cls?.startTime);
    const endTime = formatTime(cls?.endTime);
    // console.log('classcard cls info', cls)
    // console.log("memorization is not working")
    return (
        <div className=''>
            <div
                key={cls._id}
                className="p-4 rounded-xl flex flex-col lg:flex-row justify-between items-center 
                 bg-base-100 border border-primary hover:shadow-2xl shadow-primary
                  ">
                <div className='w-full space-y-1'>
                    <h3 className="font-bold text-xl md:text-2xl text-[--color-primary]">{cls?.module}</h3>
                    <h3 className="font-bold text-base md:text-lg text-[--color-primary]"><u>Sub:</u> {cls?.subject}</h3>
                    <p className="text-sm text-[--color-accent]">{format(cls?.date, 'MM/dd/yyyy')} | {startTime} - {endTime}</p>
                    <div className='flex flex-col md:flex-row lg:flex-col xl:flex-row w-full lg:w-11/12 justify-between space-y-1'>
                        <p className="text-sm text-[--color-accent]">Instructor: {cls?.instructor}</p>
                        <p className="text-sm text-[--color-accent]">Room: {cls?.room} | Building: {cls.building}</p>
                    </div>
                </div>
                <div className="flex justify-between w-full lg:w-auto mt-4 lg:mt-0 flex-row lg:flex-col gap-2">
                    <button
                        onClick={() => handleDelete(cls._id)}
                        className="btn not-dark:btn-secondary dark:btn-ghost 
                        dark:border-primary text-white"
                    >Delete</button>

                    <SidebarButton
                        text={`Edit`}
                        modalName={`my_modal_${cls._id}`}
                    />
                </div>
            </div>

            {/* Edit Class Modal */}
            <dialog id={`my_modal_${cls._id}`} className="modal">
                <div className="modal-box max-w-4xl mx-auto">
                    {/*  */}
                    <EditClass activeTab={activeTab} cls={cls} />
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default ClassCard;