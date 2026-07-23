import { Suspense, useState } from 'react';
import TasksSuspense from '../../features/Tasks/TasksSuspense';
import LoadingSpinner from '../../components/Spinner/LoadingSpinner';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorHandler from '../../components/Error/ErrorHandler';
import useTittle from '../../hooks/useTittle';
import Pagination from '../../components/Pagination/Pagination';
import TabAndView from '../../components/TabAndView/TabAndView';

const Tasks = () => {
    const [activeTab, setActiveTab] = useState("next");
    const [pageView, setPageView] = useState("flat");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    useTittle("Tasks")


    const handlePageView = e => {
        const view = e.target.value;
        const lowerTxtView = view?.toLowerCase();
        setPage(1);
        setPageView(lowerTxtView);
    };

    const handleActiveTab = (activeTab) => {
        setPage(1);
        setActiveTab(activeTab);
    };

    return (
        <div className="w-full mx-auto bg-[--color-base-100] min-h-screen grid dark:text-white" >
            <div>
                <TabAndView
                    handleActiveTab={handleActiveTab}
                    handlePageView={handlePageView}
                    activeTab={activeTab}
                />
                {/* Class List */}
                <ErrorBoundary
                    fallbackRender={({ error, resetErrorBoundary }) => (
                        <ErrorHandler
                            error={error}
                            resetErrorBoundary={resetErrorBoundary}
                        />
                    )}
                >
                    <Suspense fallback={<LoadingSpinner />} >
                        <TasksSuspense
                            setTotalPages={setTotalPages}
                            pageView={pageView}
                            activeTab={activeTab}
                            page={page}
                        />
                    </Suspense>
                </ErrorBoundary>
            </div>
            <Pagination
                setPage={setPage}
                page={page}
                totalPage={totalPages}
            />
        </div>
    );
};

export default Tasks;