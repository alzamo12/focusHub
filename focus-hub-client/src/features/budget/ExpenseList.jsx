const ExpenseList = ({ expenses }) => {
    return (
        <div className="p-6 rounded-2xl shadow-lg bg-white dark:bg-black dark:text-white mt-6 overflow-x-auto">
            <h2 className="text-lg font-bold mb-4">Expense History</h2>

            <table className="table w-full">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Amount (BDT)</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses?.length > 0 ? (
                        expenses.map((exp, index) => (
                            <tr key={index}>
                                <td>{exp.title}</td>
                                <td>{exp.category}</td>
                                <td>{exp.amount}</td>
                                <td>{exp.date}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center text-gray-500">
                                No expenses added yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ExpenseList