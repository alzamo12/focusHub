import DOMPurify from "dompurify";
import { Link } from "react-router";

const NoteCard = ({ note, handleDeleteNote }) => {
    // const cleanHTML = DOMPurify.sanitize(note?.content);
    // const cut = note.content.slice(0, 200);
    // const clean = DOMPurify.sanitize(cut);
    // console.log(note)
    return (
        <div className="card bg-base-100 border border-primary text-neutral dark:text-white w-full h-44">
            <div className="card-body items-center text-center">
                {/* <div> */}
                    <h2 className="card-title text-xl">{note?.title}</h2>
                    <h2 className="card-title  text-base">Subject: {note?.subject}</h2>
                {/* </div> */}
                <div className="card-actions justify-end">
                    <Link to={`/dashboard/note/${note?._id}`} className="btn dark:bg-base-100 dark:text-white dark:border dark:border-accent btn-secondary dark:shadow-accent dark:hover:shadow-lg text-white">View</Link>
                    <button onClick={() => handleDeleteNote(note?._id)} className="btn btn-ghost border border-secondary dark:border-primary dark:shadow-primary dark:hover:shadow-lg">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default NoteCard;