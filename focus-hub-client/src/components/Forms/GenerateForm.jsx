import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import ISO6391 from "iso-639-1";
import subTopics from "../../data/subTopics.json";
import chapters from "../../data/chapters.json";
import questionTypes from "../../data/questionTypes.json";
import subjects from "../../data/subjects.json";
import useInputStyles from "../../hooks/useInputStyles";

function LanguageSelector({ onChange }) {
    const [value, setValue] = useState(null);

    // build languages once
    const allLanguages = useMemo(
        () =>
            ISO6391.getAllNames().map((name) => ({
                value: ISO6391.getCode(name), // e.g. "en"
                label: name,                  // e.g. "English"
            })),
        []
    );

    const defaultOptions = useMemo(() => allLanguages.slice(0, 50), [allLanguages]);

    // loadOptions can use callback OR return a Promise
    const loadOptions = (inputValue, callback) => {
        // if no input, show defaults
        if (!inputValue) {
            callback(defaultOptions);
            return;
        }

        const q = inputValue.trim().toLowerCase();

        // simple substring filter (fast). For fuzzy matching, integrate fuse.js.
        const filtered = allLanguages.filter((lang) =>
            lang.label.toLowerCase().includes(q) || (lang.value && lang.value.includes(q))
        );

        // return via callback
        callback(filtered);
        // OR return Promise.resolve(filtered)
    };

    const handleChange = (selected) => {
        setValue(selected);
        if (onChange) onChange(selected);
    };

    return (
        <div className="mb-4 full">
            <label className="block mb-2 font-medium">Language</label>
            < AsyncSelect
                cacheOptions
                loadOptions={loadOptions}
                defaultOptions={defaultOptions}
                value={value}
                onChange={handleChange}
                placeholder="Search and select language..."
                isClearable
            />
        </div>
    );
};

const languages = [
    { value: "english", label: "English" },
    { value: "bangla", label: "Bangla" },
];



const GenerateForm = ({ formType, handleSubmit, retryAfter, isPending }) => {
    const [subject, setSubject] = useState(null);
    const [level, setLevel] = useState(null);
    const [chapter, setChapter] = useState(null);
    const [language, setLanguage] = useState(null);
    const [type, setType] = useState(null);
    const [subTopic, setSubTopic] = useState(null);
    const [questionLevels, setQuestionLevels] = useState(null);
    const customStyles = useInputStyles();
    const isDisabled = !subject || !level || !chapter || isPending || retryAfter > 0;

    useEffect(() => {
        if (formType === 'questions') {
            const load = async () => {
                const module = await import(`../../data/questionLevels.json`);
                setQuestionLevels(module.default)
            };
            load()
        } else if (formType === "notes") {
            // load("noteLevels")
            const load = async () => {
                const module = await import("../../data/noteLevels.json");
                setQuestionLevels(module.default)
            };
            load()
        } else {
            throw new Error("Please give us a form type")
        }
    }, [formType])

    return (
        <div className="w-full mx-auto mt-5 p-6 bg-base-100
         border border-primary shadow-lg rounded-xl 
         grid grid-cols-1 lg:grid-cols-2 
         gap-5 dark:text-white">

            {/* Subjects */}
            <div className="mb-4 w-full">
                <label className="block mb-2 font-medium">Subject</label>
                <Select
                    styles={customStyles}
                    options={subjects}
                    value={subject}
                    onChange={setSubject}
                    placeholder="Select subject..."
                />
            </div>

            {/* Levels -- easy,hard, medium */}
            <div className="mb-4 w-full">
                <label className="block mb-2 font-medium">Level</label>
                <Select
                    styles={customStyles}
                    options={questionLevels}
                    value={level}
                    onChange={setLevel}
                    placeholder="Select difficulty level..."
                />
            </div>

            {/* Chapter */}
            <div className="mb-4 full">
                <label className="block mb-2 font-medium">Chapter</label>
                <Select
                    styles={customStyles}
                    options={subject ? chapters[subject.value] : []}
                    value={chapter}
                    onChange={setChapter}
                    placeholder={subject ? "Select chapter..." : "Select a subject first"}
                    isDisabled={!subject}
                />
            </div>

            {/* sub topic */}
            <div className="mb-4 full">
                <label className="block mb-2 font-medium">Sub Topic</label>
                <Select
                    styles={customStyles}
                    options={chapter ? subTopics[subject.value][chapter.value] : []}
                    value={subTopic}
                    onChange={setSubTopic}
                    placeholder={chapter ? "Select sub topic..." : "Select a chapter first"}
                    isDisabled={!chapter}
                />
            </div>

            {/* Question Type */}
            <div className="mb-4 full">
                <label className="block mb-2 font-medium">Question Type</label>
                <Select
                    styles={customStyles}
                    options={questionTypes}
                    value={type}
                    onChange={setType}
                    placeholder="Select question type..."
                />
            </div>

            {/* language */}
            <div className="mb-4 full">
                <label className="block mb-2 font-medium">Language</label>
                <Select
                    styles={customStyles}
                    options={languages}
                    value={language}
                    onChange={setLanguage}
                    placeholder={subject ? "Select language ..." : "Select a subject first"}
                />
            </div>

            <button
                className={`w-64  bg-primary font-bold py-2 px-4 rounded text-black transition 
                       ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                    `}
                onClick={() => {
                    const data = { subject, chapter, level, subTopic, type, language };
                    handleSubmit(data);
                }}
                disabled={isDisabled}
            // disabled={isDisabled}
            >
                {retryAfter > 0 ?
                    <span>retry after {retryAfter} seconds</span>
                    :
                    // <span>Generate Questions</span>
                    formType === 'questions' ? 'Generate Questions' :
                        formType === 'notes' && 'Generate Notes'
                }
            </button>
        </div>
    );
};

export default GenerateForm;