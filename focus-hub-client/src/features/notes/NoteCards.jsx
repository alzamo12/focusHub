import LoadingSpinner from '../../components/Spinner/LoadingSpinner';
import NoteCard from './NoteCard';
import Select from "react-select";
import useInputStyles from '../../hooks/useInputStyles';
const NoteCards = ({ subjects, selectedSub, setSelectedSub, notes, handleEditNote, handleDeleteNote, isLoading, isPending }) => {
    const customStyles = useInputStyles();
    return (
        <div className='mt-10 relative'>
            <Select
                styles={customStyles}
                options={subjects}
                value={selectedSub}
                onChange={setSelectedSub}
                placeholder="Please select your subject"
                className='w-full md:w-1/3 input-lg rounded-md'
            />
            <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between my-8 md:gap-20">
                {
                    isLoading || isPending ? <LoadingSpinner /> :
                        notes?.length === 0 ? (
                            <p className="text-center text-gray-500">No notes yet.</p>
                        ) : (
                            notes?.map((note) => (
                                <NoteCard
                                    key={note._id}
                                    note={note}
                                    handleEditNote={handleEditNote}
                                    handleDeleteNote={handleDeleteNote}
                                />
                            ))
                        )
                }
            </div>
        </div>
    );
};

export default NoteCards;