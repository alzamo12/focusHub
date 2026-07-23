import { useState } from "react";
import DatePicker from 'react-datepicker';

const AddExpenseForm = ({ onSubmit }) => {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Books");
    const [date, setDate] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !amount || !date) return alert("Please fill all fields");

        const data = {
            title,
            amount: parseFloat(amount),
            category,
            date
        };

        // onAdd({
        //     title,
        //     amount: parseFloat(amount),
        //     category,
        //     date,
        // });
        onSubmit(data)

        // reset form
        setTitle("");
        setAmount("");
        setCategory("Books");
        setDate("");
    };
    const inputCommonStyles = "input input-bordered w-full bg-white dark:bg-black border-primary dark:text-white"


    return (
        <form
            onSubmit={handleSubmit}
            className="p-6 rounded-2xl shadow-lg bg-white dark:bg-black dark:text-white mt-6"
        >
            <h2 className="text-lg font-bold mb-4">Add New Expense</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder="Expense Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input input-style w-full"
                />

                <input
                    type="number"
                    placeholder="Amount (BDT)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input input-style w-full"
                />

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="select input-style w-full"
                >
                    <option>Books</option>
                    <option>Courses</option>
                    <option>Stationery</option>
                    <option>Others</option>
                </select>

                {/* <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input input-style w-full"
                /> */}
                <DatePicker
                    placeholderText="Select date"
                    selected={date}
                    onChange={(date) => setDate(date)}
                    wrapperClassName="w-full" // Styles the outer container
                    className={`${inputCommonStyles}`}
                />
            </div>

            <button type="submit" className="btn bg-secondary text-white cursor-pointer font-bold mt-4">
                Add Expense
            </button>
        </form>
    );
};

export default AddExpenseForm