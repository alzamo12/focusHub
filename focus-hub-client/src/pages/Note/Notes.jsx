import React, { Suspense, useState } from 'react';
import NoteCard from '../../features/notes/NoteCard';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from "../../hooks/useAxiosSecure"
import { toast } from "react-toastify"
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2'
import LoadingSpinner from "../../components/Spinner/LoadingSpinner"
import useTittle from '../../hooks/useTittle';
import axios from 'axios';
import DOMPurify from "dompurify";
import 'react-quill-new/dist/quill.snow.css';
import NoteTab from '../../features/notes/NoteTab';
import NoteCards from '../../features/notes/NoteCards';
import GenerateNote from '../../features/notes/GenerateNote';
import { useRef } from 'react';
import Pagination from '../../components/Pagination/Pagination';
import { dataURLToFile } from '../../utils/dataURLToFile';
const NoteForm = React.lazy(() => import('../../components/Forms/NoteForm'));

const subjects = [
    { value: "Physics", label: "Physics" },
    { value: "Math", label: "Math" },
    // { value: "Higher Math", label: "Math" },
    { value: "Chemistry", label: "Chemistry" },
    { value: "History", label: "History" },
    { value: "All", label: "All" },
];
const Notes = () => {
    const [currentNote, setCurrentNote] = useState("");
    const [title, setTitle] = useState("");
    const noteRef = useRef(null);
    const [activeTab, setActiveTab] = useState("create_note");
    const [sub, setSub] = useState(null);
    const [selectedSub, setSelectedSub] = useState(null);
    const [page, setPage] = useState(1);
    // const [totalPages, setTotalPages] = useState(1);
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const limit = 5;
    useTittle("Notes")


    // add note in database
    const { mutateAsync: addNoteAsync } = useMutation({
        mutationFn: async (noteData) => {
            const res = await axiosSecure.post(`/notes`, noteData);
            return res.data
        }, onSuccess: (data) => {
            if (data.success) {
                toast.success("note added successfully")
                queryClient.invalidateQueries({ queryKey: ['note'] })
            }
            // console.log(data)
        }, onError: (err) => {
            console.log(err)
            const message = err.response.data.message || "Internal server error";
            toast.error(message);
        }
    });

    // delete note from db
    const { mutateAsync: deleteNoteAsync } = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.delete(`/notes/${id}`);
            return res.data
        },
        onSuccess: async (data) => {
            if (data.success) {
                toast.success("Note deleted Successfully");
                queryClient.invalidateQueries({ queryKey: ['note'] })
            }
            // console.log(data);
        },
        onError: async (err) => {
            console.log(err);
            const message = err.response.data.message || 'Internal server error';
            toast.error(message)
        }
    });

    // get notes
    const { data: { notesData = {}, totalPages = 1 } = {}, isLoading, isPending } = useQuery({
        queryKey: ['note', user.email, selectedSub, page, limit],
        queryFn: async () => {
            const res = await axiosSecure.get(`/notes?email=${user?.email}&subject=${selectedSub?.value}&page=${page}&limit=${limit}`);

            // if (res.data.success) {
            //     setTotalPages(res.data.data.totalPages)
            // }
            return res.data.data
        }
    });

    const handleSaveNote = async () => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(currentNote, "text/html");
        // console.log(doc.body.textContent)
        if (!sub) return toast.error("Please select a subject")
        if (!title) return toast.error("Please give a title")
        if (!doc.body.textContent) return toast.error("Please write something on your note")


        // const images = doc.querySelectorAll("img");
        const images = Array.from(doc.querySelectorAll("img"));
        // console.log("Total images:", images.length);

        const uploadImages = images.map(async (img) => {
            const src = img.src;
            if (src.startsWith('http')) return;

            const file = dataURLToFile(src, "note-image.png");


            // 4. Upload to Cloudinary
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "focus-hub");

            const response = await axios.post(
                import.meta.env.VITE_cloudinary_url,
                formData
            );

            // 5. Replace src with Cloudinary URL
            img.src = response.data.secure_url;
            // console.log(img.src)
        });

        await Promise.all(uploadImages)
        // handleGenerateImageLink(doc)

        let updatedHtml = doc.body.innerHTML;

        // 7. Sanitize before storing
        updatedHtml = DOMPurify.sanitize(updatedHtml);


        // console.log('data is of note', title, sub, updatedHtml);
        const noteData = {
            subject: sub?.value,
            title,
            content: updatedHtml
        };
        // console.log(noteData)
        // console.log(images)
        addNoteAsync(noteData)
        // P(noteData)
    };

    const handleEditNote = () => {

    };

    const handleDeleteNote = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteNoteAsync(id)
            }
        });

    };

    const handleActiveTab = (activeTab) => {
        setActiveTab(activeTab);
    };

    const handleGeneratedSaveNote = (note) => {
        // const note_html = marked.parse(note)
        // const editor = noteRef.current.getEditor();
        // const delta = editor.clipboard.convert({
        //     html: note,
        // });
        // editor.setContents(delta);
        const clean = note
            .replace(/^```json\s*/i, "")
            .replace(/\s*```$/, "");

        const delta = JSON.parse(clean);

        setCurrentNote(delta);
        setActiveTab("create_note")
    };
    // console.log('this is notes data', notesData)

    return (
        <div className='max-w-screen-2xl overflow-y-hidden dark:text-white' >

            <h2 className="text-2xl font-bold text-center my-4">📒 Study Notes</h2>

            <div className=" w-full mx-auto bg-[--color-base-100] min-h-screen grid">
                <div>
                    <NoteTab activeTab={activeTab} handleActiveTab={handleActiveTab} />

                    {
                        activeTab === "create_note" ?
                            (
                                <div>
                                    <Suspense fallback={<LoadingSpinner />}>
                                        < NoteForm
                                            noteRef={noteRef}
                                            currentNote={currentNote}
                                            setCurrentNote={setCurrentNote}
                                            title={title}
                                            setTitle={setTitle}
                                            sub={sub}
                                            setSub={setSub}
                                            handleNote={handleSaveNote}
                                            btnText="Add Note"
                                        />
                                    </Suspense>

                                    <NoteCards
                                        subjects={subjects}
                                        selectedSub={selectedSub}
                                        setSelectedSub={setSelectedSub}
                                        notes={notesData}
                                        handleEditNote={handleEditNote}
                                        handleDeleteNote={handleDeleteNote}
                                        isLoading={isLoading}
                                        isPending={isPending}
                                    />
                                    <Pagination
                                        setPage={setPage}
                                        page={page}
                                        totalPage={totalPages}
                                    />
                                </div>
                            ) : activeTab === 'generate_note' &&
                            (<GenerateNote handleGeneratedSaveNote={handleGeneratedSaveNote} />
                            )
                    }

                </div>
            </div>


        </div >
    );
};

export default Notes;