import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import ClassesGrid from '../../components/Class/ClassesGrid';
import GroupedClassUI from '../../components/Class/GroupedClassUI';
import Swal from 'sweetalert2';
const Classes = ({ pageView, activeTab, page, setTotalPage }) => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const limit = 5;

    // Fetch user all Classes
    const { data: classesData } = useQuery({
        queryKey: ["classes", user?.email, activeTab, pageView, page, limit],
        queryFn: async () => {
            const res = await axiosSecure.get(`/classes?email=${user?.email}&type=${activeTab}&view=${pageView}&timezone=${timezone}&page=${page}&limit=${limit}`);
            if (res.data.success) {
                setTotalPage(res.data.data.totalPages);
            };
            return res.data
        },
        suspense: true,
        refetchOnWindowFocus: false,
        enabled: !!user?.email && !!activeTab && !!pageView && !!page && !!limit,
    });
    // console.log(error)

    const { classes = [], view = '', type } = classesData?.data || {};
    // console.log(classesData.data)

    const { mutateAsync: deleteAsync } = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.delete(`/classes/${id}`);
            return res.data
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success('your class has deleted successfully');
                queryClient.invalidateQueries(['classes'])
            }
            // console.log(data)
        }
    })

    const handleDelete = (id) => {
        // console.log("class delete hit");
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
                deleteAsync(id);
            }
        });
    };

    const handleEdit = useCallback((id) => {
        document.getElementById(`my_module_${id}`).showModal();
    }, []);

    let content;
    if (classes?.length > 0) {
        const safeView = view?.toLowerCase() ?? 'flat';
        switch (safeView) {
            case 'flat':
                content = (
                    <ClassesGrid
                        classes={classes}
                        handleDelete={handleDelete}
                        handleEdit={handleEdit}
                        activeTab={activeTab}
                    />
                );
                break;
            case 'group':
                content = (
                    <GroupedClassUI
                        activeTab={activeTab}
                        classes={classes}
                        type={type}
                        handleDelete={handleDelete}
                        handleEdit={handleEdit}
                    />
                );
                break;
            default:
                content = (
                    <div className=''>Invalid View</div>
                );
        }
    } else {
        content = (<div className=''>No classes available here</div>)
    }

    return (
        <div className='text-base-content'>
            <h2 className="text-2xl font-bold  mb-4">Class Schedule</h2>
            <div>
                {content}
            </div>
        </div>
    );
};

export default Classes;