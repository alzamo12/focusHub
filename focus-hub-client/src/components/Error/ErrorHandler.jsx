
const ErrorHandler = ({ error }) => {
    // console.log('error handler', error)
    return (
        <div className="gap-4 flex items-center">
            <span>{error.message}</span> <br />
            <button
                className="btn btn-ghost text-red-600 border border-red-600"
                onClick={() => window.location.reload()}>
                Try again
            </button>
        </div>
    );
};

export default ErrorHandler;