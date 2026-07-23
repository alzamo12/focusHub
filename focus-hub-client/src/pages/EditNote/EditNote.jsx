import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DOMPurify from "dompurify";
import { useNavigate, useParams } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useState } from 'react';
import NoteForm from '../../components/Forms/NoteForm';
import LoadingSpinner from '../../components/Spinner/LoadingSpinner';
import { toast } from 'react-toastify';
import useTittle from '../../hooks/useTittle';
import { dataURLToFile } from '../../utils/dataURLToFile';
import axios from 'axios';

const EditNote = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const [currentNote, setCurrentNote] = useState("");
    const [title, setTitle] = useState("");
    const [sub, setSub] = useState(null);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    useTittle("Edit Note")

    const { data: note, isLoading } = useQuery({
        queryKey: ['noteDetails', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/notes/${id}`);
            if (res.data.success) {
                const cleanHTML = DOMPurify.sanitize(res.data.data.content);
                setCurrentNote(cleanHTML)
                setTitle(res.data.data.title)
                setSub({
                    value: res.data.data.subject,
                    label: res.data.data.subject
                })
            }
            return res.data
        }
    });
    const { mutateAsync: noteEditAsync } = useMutation({
        mutationFn: async (noteData) => {
            const res = await axiosSecure.patch(`/notes/${id}`, noteData);
            return res.data
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success("Your note updated successfully");
                queryClient.invalidateQueries({ queryKey: ['noteDetails', 'note'] });
                navigate(`/dashboard/note/${id}`)
            };
            // console.log(data);
        },
        onError: (err) => {
            toast.error(err.message)
        }
    })
    if (isLoading) return <LoadingSpinner />
    // console.log(note)

    const handleEditNote = async () => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(currentNote, "text/html");
        // console.log(doc.body.textContent)
        if (!sub) return toast.error("Please select a subject")
        if (!title) return toast.error("Please give a title")
        if (!doc.body.textContent) return toast.error("Please write something on your note")

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

        let updatedHtml = doc.body.innerHTML;

        // 7. Sanitize before storing
        updatedHtml = DOMPurify.sanitize(updatedHtml);
        const noteData = {
            content: updatedHtml,
            title,
            subject: sub.value
        };
        // console.log(noteData);
        noteEditAsync(noteData)
    };
    return (
        <div className='max-w-screen-2xl ' >
            <h2 className="text-2xl font-bold text-center my-4 text-base-200 ">📒 Edit Note</h2>
            {/* note add form */}
            <NoteForm
                currentNote={currentNote}
                setCurrentNote={setCurrentNote}
                title={title}
                setTitle={setTitle}
                sub={sub}
                setSub={setSub}
                handleNote={handleEditNote}
                btnText="Edit Note"
            />
        </div >
    );
};

export default EditNote;