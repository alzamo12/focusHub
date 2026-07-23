import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DOMPurify from "dompurify";
import { Link, useNavigate, useParams } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import LoadingSpinner from '../../components/Spinner/LoadingSpinner';
import ReactQuill from 'react-quill-new';
import "react-quill-new/dist/quill.bubble.css";
// import 'react-quill-new/dist/quill.snow.css';
import NoteViewer from '../../components/NoteViewer/NoteViewer';

const NoteDetails = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { data: { data: note = {} } = {}, isLoading } = useQuery({
        queryKey: ['noteDetails', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/notes/${id}`);
            return res.data
        }
    });

    const { mutateAsync: deleteNoteAsync } = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.delete(`/notes/${id}`);
            return res.data
        },
        onSuccess: async (data) => {
            if (data.success) {
                toast.success("Note deleted Successfully");
                queryClient.invalidateQueries({ queryKey: ['note'] })
                navigate("/dashboard/notes")
            }
            // console.log(data);
        },
        onError: async (err) => {
            console.log(err);
            toast.error(err.message)
        }
    });

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

    if (isLoading) return <LoadingSpinner />

    const cleanNoteContent = DOMPurify.sanitize(note?.content ?? "", {
        ADD_ATTR: ["style"],
    });
    // console.log('clean', cleanNoteContent, 'not-clean', note.content)

    return (
        <div
            className="bg-white border rounded-xl shadow p-4 space-y-2"
        >

            <div className="flex flex-col md:flex-row-reverse justify-between items-center">
                <div className="space-x-2 flex w-full md:w-auto justify-between my-3">
                    <Link
                        to={`/dashboard/editNote/${note?._id}`}
                        className="px-6 py-1 bg-secondary dark:bg-base-100 text-white rounded-lg cursor-pointer"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="px-6 py-1 bg-base-100 border border-primary text-red-600 rounded-lg cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
                <div className='flex flex-col md:flex-row-reverse w-auto px-5 md:px-0 py-2 md:py-0 md:w-1/2 md:justify-between  text-center border border-secondary md:border-0 rounded-2xl'>
                    <h3 className="font-semibold text-xl md:text-2xl"><i>Title:</i> {note?.title}</h3>
                    <h3 className="font-semibold text-lg"><i>Subject:</i> {note?.subject}</h3>
                </div>

            </div>
            <ReactQuill
                value={cleanNoteContent}
                readOnly
                theme="bubble"
            // className='dark:b'
            />
            {/* <NoteViewer html={cleanNoteContent}/> */}
            <p className="text-gray-400 text-sm">
                Created: {new Date(note.createdAt).toLocaleString()}
            </p>
        </div>
    );
};

export default NoteDetails;