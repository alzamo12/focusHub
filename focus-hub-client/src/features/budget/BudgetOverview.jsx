const BudgetOverview = ({ budget, expenses }) => {
    // const {amount, month} = budg
    const totalSpent = expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
    const balance = Number(budget?.amount) - Number(totalSpent);

    return (
        <div className="p-6 rounded-2xl shadow-lg bg-primary text-gray-700 flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold">Monthly Budget</h2>
                <p className="mt-1">Budget: {budget?.amount} BDT</p>
                <p>Spent: {totalSpent} BDT</p>
                <p className="font-semibold">Left: {balance} BDT</p>
            </div>
            <div className="text-5xl font-bold">{balance}</div>
        </div>
    );
};

export default BudgetOverview