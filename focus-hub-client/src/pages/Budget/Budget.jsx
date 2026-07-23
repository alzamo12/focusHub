import BudgetOverview from "../../features/budget/BudgetOverview";
import AddExpenseForm from "../../features/budget/AddExpenseForm";
import ExpenseList from "../../features/budget/ExpenseList";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner/LoadingSpinner"
import AddBudgetForm from "../../features/budget/AddBudgetForm";
import useTittle from "../../hooks/useTittle";

const Budget = () => {
    // const [budget, setBudget] = useState(2000); // example fixed budget
    // const [expenses, setExpenses] = useState([]);
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const date = new Date();
    const month = date.toISOString().slice(0, 7);
    useTittle("Budget");
    // const axiosPublic = useAxiosPublic();
    // console.log(month)
    const { mutateAsync: addBudgetAsync } = useMutation({
        mutationFn: async (data) => {
            const res = await axiosSecure.put("/budget", data);
            return res.data
        },
        onSuccess: (data) => {
            // console.log(data)
            if (data.success) {
                toast.success("Budget added successfully")
                queryClient.invalidateQueries({ queryKey: ["budget"] })
            }
        },
        onError: async (err) => {
            const message = err.response.data.message || 'Internal server error';
            toast.error(message)
            console.log(err)
        }
    });

    // get budget of a specific month -- fetch budget
    const { data: { data: budget = {} } = {}, isLoading: budgetLoading } = useQuery({
        queryKey: ['budget', month],
        queryFn: async () => {
            const res = await axiosSecure.get(`/budget?email=${user.email}&month=${month}`);
            // console.log('this is budget', res.data)
            return res.data
        }
    })

    // fetch expense
    const { data: { data: myExpenses = {} } = {}, isLoading: expensesLoding } = useQuery({
        queryKey: ["expense", budget?._id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/expenses?budgetId=${budget?._id}`);
            // console.log('your expenses', res.data)
            return res.data
        },
        refetchOnWindowFocus: false,
        enabled: !budgetLoading
    });

    // add expense
    const { mutateAsync: addExpensesAsync } = useMutation({
        mutationFn: async (data) => {
            const res = await axiosSecure.post("/expenses", data);
            return res.data
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success("Expense added successfully");
                queryClient.invalidateQueries({ queryKey: ["expense"] })
            }
            // console.log(data)
        },
        onError: err => {
            console.log(err)
            const message = err.response.data.message;
            toast.error(message)
        }
    });

    const addExpense = (data) => {
        const newData = {
            ...data,
            userEmail: user?.email,
            budgetId: budget?._id,
            currency: "BDT"
        }
        addExpensesAsync(newData)
    };

    const handleAddBudget = (data) => {
        const { amount, month } = data;
        const newData = {
            month,
            amount: amount + parseInt(budget?.amount ? budget.amount : 0),
            userEmail: user?.email
        };
        // console.log(newData, budget?.amount)
        addBudgetAsync(newData)
    };
    // console.log('budget email', user?.email)


    if (expensesLoding || budgetLoading) {
        return <Spinner />
    };

    return (
        <div className="my-8">
            <h2 className="font-bold dark:text-white text-center text-3xl">Plan Your Budget</h2>
            <div className="mx-auto my-12 space-y-6 flex flex-col md:flex-row justify-between">

                <div className="w-full md:w-4/12">
                    <AddBudgetForm month={month} handleAddBudget={handleAddBudget} />
                </div>

                {/* Budget Overview */}
                <div className="w-full md:w-7/12">
                    {!budget ?
                        <div className="card-title">PLease add a budget first</div> :

                        <div className="w-full">
                            <BudgetOverview budget={budget} expenses={myExpenses} />

                            <AddExpenseForm onSubmit={addExpense} />

                            <ExpenseList expenses={myExpenses} />
                        </div>
                    }
                </div>

            </div>
        </div>
    );
};

export default Budget;