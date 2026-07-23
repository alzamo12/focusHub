import Select from "react-select";
import "../../css/noteform.css"
import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import SelectInput from "../Inputs/add_Class_And_Task_Form_Inputs/SelectInput";
import useInputStyles from "../../hooks/useInputStyles";
// React.lazy(() => import('react-quill-new'));
// const ReactQuill =  <Suspense>{React.lazy(() => import('react-quill-new'))}</Suspense>
import subjects from "../../data/subjects.json"
// const subjects = [
//     { value: "Physics", label: "Physics" },
//     { value: "Math", label: "Math" },
//     { value: "Chemistry", label: "Chemistry" },
//     { value: "History", label: "History" },
//     // { value: "History", label: "History" },
// ];

function MobileToolbar() {
    return (
        <div id="mobile-toolbar">
            {/* Always visible */}
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />

            {/* Insert */}
            <details>
                <summary>Insert</summary>

                <button className="ql-image" />
                <button className="ql-link" />
                <button className="ql-formula" />
                {/* Table button if using quill-table */}
            </details>

            {/* Colors */}
            <details>
                <summary>Color</summary>

                <select className="ql-color" defaultValue="">
                    <option value=""></option>
                    <option value="red"></option>
                    <option value="blue"></option>
                    <option value="green"></option>
                    <option value="#ff9800"></option>
                </select>

                <select className="ql-background" defaultValue="">
                    <option value=""></option>
                    <option value="yellow"></option>
                    <option value="lightgreen"></option>
                    <option value="#90caf9"></option>
                </select>
            </details>

            {/* Alignment */}
            <details>
                <summary>Align</summary>

                <select className="ql-align"></select>
            </details>
        </div>
    );
}
const NoteForm = ({ currentNote, setCurrentNote, title, setTitle, sub, setSub, handleNote, btnText }) => {
    const customStyles = useInputStyles();
    const quillRef = useRef(null);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showTableMenu, setShowTableMenu] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);

        // Set initial value
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    const mobileToolbar = [
        ["bold", "italic", "underline"],
        [{ header: [1, 2, false] }],
        [{ color: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["table", "table-edit"],
        ["link", "image"],
        // ["clean"],
    ];
    const desktopToolbar = [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],

        // Modern, grouped table manipulation array layout strings
        ["table", "table-insert-row-above", "table-insert-row-below", "table-insert-column-left", "table-insert-column-right"],
        ["table-delete-row", "table-delete-column", "table-delete-table"],
        // ['formula'],
        // ["increaseImageSize", "decreaseImageSize"],
        ["clean"],
    ];
    const modules = {
        toolbar: {
            container: isMobile ? mobileToolbar : desktopToolbar,
            handlers: {
                // Main initialization handler
                table() {
                    this.quill.getModule("table").insertTable(3, 3);
                },
                // Context structural editing triggers bound directly to internal operations
                "table-insert-row-above"() {
                    this.quill.getModule("table").insertRowAbove();
                },
                "table-insert-row-below"() {
                    this.quill.getModule("table").insertRowBelow();
                },
                "table-insert-column-left"() {
                    this.quill.getModule("table").insertColumnLeft();
                },
                "table-insert-column-right"() {
                    this.quill.getModule("table").insertColumnRight();
                },
                "table-delete-row"() {
                    this.quill.getModule("table").deleteRow();
                },
                "table-delete-column"() {
                    this.quill.getModule("table").deleteColumn();
                },
                "table-delete-table"() {
                    this.quill.getModule("table").deleteTable();
                },
                "table-edit": function () {
                    setShowTableMenu(!showTableMenu); // Open a modal, drawer, or dropdown
                },

            },
        },
        table: true,
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "color",
        "background",
        "list",
        "bullet",
        "link",
        "image",
        "table",
        "blockquote",
        "code-block",
        "script",   // for sub/sup
        "strike",
    ];

    const getTable = () => quillRef.current?.getEditor().getModule("table");

    return (
        <div className="bg-base-100 shadow-lg rounded-2xl lg:py-6 space-y-4 w-full">
            {/* subject input */}
            <div className='flex flex-col md:flex-row gap-4 w-full'>
                <div className='w-full md:w-1/2'>
                    <Select
                        options={subjects}
                        value={sub}
                        onChange={setSub}
                        placeholder="Please select your subject"
                        className='w-full input-lg rounded-md'
                        styles={customStyles}
                    />


                </div>
                <input
                    type="text"
                    className="w-full md:w-1/2 border border-primary 
                    rounded-md input-lg px-2 text-lg dark:bg-black dark:text-white py-1" 
                    placeholder="Enter note title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            {/* {isMobile && <MobileToolbar />} */}
            {/*   text editor form */}
          {/* <div className="w-full min-w-0 overflow-x-hidden"> */}
                  <ReactQuill
                    // ref={noteRef}
                    ref={quillRef}
                    theme='snow'
                    value={currentNote}
                    onChange={setCurrentNote}
                    height="300px"
                    modules={modules}
                    formats={formats}
                    style={{ height: "400px", paddingBottom: "40px" }}
                    className=' not-dark:bg-white  rounded-2xl border 
                    border-primary dark:text-black'
                    placeholder='Write your note here ....'
                />
          {/* </div> */}

            {/* submit button */}
            <button
                onClick={handleNote}
                className="w-full mt-10 2xl:mt-4 py-2 bg-white dark:bg-black dark:text-accent border border-primary  text-secondary rounded-lg hover:bg-secondary hover:text-white"
            >
                {btnText}
            </button>

            {/* modal */}

            {showTableMenu && (
                <div>
                    <div class="fixed inset-0 bg-black/50 z-40"></div>

                    <div className="dropdown-content md:hidden menu 
                dark:bg-black bg-white rounded-box rounded-tr-none shadow 
                px-8 z-100 absolute top-[45%] left-[25%] pt-4
                ">

                        <button
                            onClick={() => setShowTableMenu(false)}
                            className="btn btn-sm btn-circle btn-ghost 
                    absolute top-0 right-0"
                        >✕</button>

                        <button 
                        className="border-b-2 border-primary mb-2"
                        onClick={() => getTable()?.insertRowAbove()}>
                            Row Above
                        </button>

                        <button 
                        className="border-b-2 border-primary mb-2"
                        onClick={() => getTable()?.insertRowBelow()}>
                            Row Below
                        </button>

                        <button 
                        className="border-b-2 border-primary mb-2"
                        onClick={() => getTable()?.insertColumnLeft()}>
                            Column Left
                        </button>

                        <button 
                        className="border-b-2 border-primary mb-2"
                        onClick={() => getTable()?.insertColumnRight()}>
                            Column Right
                        </button>

                        <button 
                        className="border-b-2 border-primary mb-2"
                        onClick={() => getTable()?.deleteRow()}>
                            Delete Row
                        </button>

                        <button 
                        className="border-b-2 border-primary mb-2"
                        onClick={() => getTable()?.deleteColumn()}>
                            Delete Column
                        </button>

                        <button 
                        className="border-b-2 border-primary mb-2"
                        onClick={() => getTable()?.deleteTable()}>
                            Delete Table
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoteForm;