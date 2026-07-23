import { useState } from "react";
import TimeKeeper from "react-timekeeper";

const TimeInput = ({ value, onChange, name, inputCommonStyles }) => {
    const [showClock, setShowClock] = useState(false);

    return (
        <div className="">
            {/* <ToastContainer /> */}
            {/* Input */}
            <input
                type="text"
                value={value}
                placeholder={`${name}`}
                readOnly
                onClick={() => setShowClock(true)}
                className={`${inputCommonStyles}`}
            />

            {/* Clock Popup */}
            {showClock && (
                <div
                    // style={{ transform: "scale(0.9)", transformOrigin: "top left" }} 
                    className="absolute z-50 top-4">
                    <TimeKeeper
                        time={value}

                        onChange={(newTime) => onChange(newTime.formatted12)}
                        onDoneClick={() => setShowClock(false)} // hide clock when done
                        switchToMinuteOnHourSelect
                    />
                </div>
            )}
        </div>
    );
};

export default TimeInput;