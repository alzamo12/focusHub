import { useState } from "react";
import {
    FaCamera,
    FaCheckCircle,
    FaEnvelope,
    FaUser,
    FaPen,
    FaShieldAlt,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify"
import Swal from 'sweetalert2'

const uploadImageToCloudinary = async (file) => {
    if (!file) return null;

    const formData = new FormData();

    formData.append("file", file);
    formData.append(
        "upload_preset",
        'focus-hub'
    );

    const response = await axios.post(
        import.meta.env.VITE_cloudinary_url,
        formData
    );

    return response.data.secure_url;
};

const Profile = () => {
    const { user, updateUser, emailVerification } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.displayName || "");
    const [selectedImage, setSelectedImage] = useState(null);
    const axiosSecure = useAxiosSecure();
    const { mutateAsync: userAsync } = useMutation({
        mutationFn: async (updatedData) => {
            const res = await axiosSecure.patch(`/users?email=${user?.email}`, updatedData);
            return res.data;
        },
        onSuccess: (data) => {
            if (data.data.modifiedCount > 0) {
                toast.success("Profile updated successfully");
            }
            console.log(data)
        },
        onError: (err) => {
            console.log(err);
            const message = err.response?.data?.message || 'Internal server error';
            toast.error(message);
        }
    })

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        // Check file type
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }

        // Check file size - 5MB
        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5MB.");
            return;
        }

        setSelectedImage(file);
    };

    const handleSaveProfile = async () => {
        try {
            /**
             * 1. create Image url using ImageBB or cloudinary
             * 2. update user profile in firebase with the new name and image url
             * 3. update user profile in database with the new name and image url
             */
            const imageUrl = await uploadImageToCloudinary(selectedImage);
            const updatedData = {
                photoURL: user.photoURL, // Default to existing photoURL if no new image is selected
                displayName: user.displayName, // Default to existing displayName if no new name is provided
            };
            if (imageUrl) updatedData.photoURL = imageUrl;
            if (name) updatedData.displayName = name;
            updateUser(updatedData)
                .then((data) => {
                    console.log("Firebase profile updated successfully");
                    console.log(data);
                    const userData = {
                        name: name,
                        photo: imageUrl
                    };
                    userAsync(userData)
                })
            console.log("Image URL:", imageUrl);

            console.log("Name:", name);
            console.log("Image:", selectedImage);

            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    };

    const handleCancel = () => {
        setName(user?.displayName || "");
        setSelectedImage(null);
        setIsEditing(false);
    };

    const handleVerifyEmail = () => {
        emailVerification()
            .then(() => {
                Swal.fire({
                    icon: "success",
                    title: "Verification Email Sent!",
                    html: `
        We've sent a verification link to your email address.<br>
        Please check your inbox and click the link to verify your account.
    `,
                    showCancelButton: true,
                    confirmButtonText: "Open Email",
                    cancelButtonText: "Close",
                    focusConfirm: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.open("https://mail.google.com/", "_blank");
                    }
                });

            }).catch(err => {
                console.log(err)
            })
    };

    const previewImage = selectedImage
        ? URL.createObjectURL(selectedImage)
        : user?.photoURL;

    return (
        <div className=" px-4 py-8 text-base-content md:px-8">

            <div className="mx-auto max-w-4xl">

                {/* ================= HEADER ================= */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-secondary">
                        My Profile
                    </h1>

                    <p className="mt-1 text-base-content/60">
                        Manage your profile and account information.
                    </p>
                </div>


                {/* ================= PROFILE ================= */}
                <div className="overflow-hidden rounded-2xl bg-base-100 shadow-lg">

                    {/* Cover */}
                    <div className="h-32 bg-gradient-to-r from-primary to-secondary md:h-40" />

                    <div className="px-6 pb-7 md:px-10">

                        {/* Profile Picture */}
                        <div className="-mt-16 flex flex-col items-center sm:flex-row sm:items-end sm:justify-between">

                            <div className="relative">

                                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-base-100 bg-base-200 shadow-lg">
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="Profile"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-primary text-5xl font-bold text-base-content">
                                            {user?.displayName?.charAt(0)?.toUpperCase() || "U"}
                                        </div>
                                    )}
                                </div>

                                {isEditing && (
                                    < div >
                                        < input
                                            id="profile-picture"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />

                                        {/* Camera Button */}
                                        <label
                                            htmlFor="profile-picture"
                                            className="btn btn-circle btn-sm absolute bottom-1 right-1 border-2 border-base-100 bg-secondary text-white shadow-md hover:bg-secondary/90"
                                            title="Change profile picture"
                                        >
                                            <FaCamera />
                                        </label>
                                    </div>
                                )
                                }

                            </div>


                            {/* Edit Button */}
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn mt-5 gap-2 border-none bg-secondary text-white hover:bg-secondary/90 sm:mt-0"
                                >
                                    <FaPen className="text-xs" />
                                    Edit Profile
                                </button>
                            )}

                        </div>


                        {/* Profile Info */}
                        <div className="mt-6">

                            {!isEditing ? (
                                <>
                                    <h2 className="text-2xl font-bold">
                                        {user?.displayName || "User"}
                                    </h2>

                                    <div className="mt-2 flex items-center gap-2 text-base-content/60">
                                        <FaEnvelope className="text-sm" />
                                        <span>{user?.email}</span>
                                    </div>
                                </>
                            ) : (

                                <div className="max-w-xl">

                                    {/* Name */}
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Full Name
                                        </span>
                                    </label>

                                    <div className="relative">

                                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />

                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            placeholder="Enter your name"
                                            className="input input-bordered w-full pl-11 focus:border-secondary focus:outline-none"
                                        />

                                    </div>


                                    {/* Buttons */}
                                    <div className="mt-5 flex gap-3">

                                        <button
                                            onClick={handleSaveProfile}
                                            className="btn border-none bg-secondary text-white hover:bg-secondary/90"
                                        >
                                            Save Changes
                                        </button>

                                        <button
                                            onClick={handleCancel}
                                            className="btn btn-ghost"
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </div>
                            )}

                        </div>

                    </div>
                </div>


                {/* ================= EMAIL VERIFICATION ================= */}
                <div className="mt-6 rounded-2xl bg-base-100 shadow-lg">

                    <div className="p-6 md:p-7">

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-start gap-4">

                                {/* Icon */}
                                <div
                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${user?.emailVerified
                                        ? "bg-success/15 text-success"
                                        : "bg-warning/15 text-warning"
                                        }`}
                                >
                                    {user?.emailVerified ? (
                                        <FaCheckCircle className="text-xl" />
                                    ) : (
                                        <FaEnvelope className="text-xl" />
                                    )}
                                </div>


                                {/* Text */}
                                <div>

                                    <h3 className="font-bold">
                                        Email Verification
                                    </h3>

                                    <p className="mt-1 text-sm text-base-content/60">
                                        {user?.email}
                                    </p>

                                    <div className="mt-2">
                                        {user?.emailVerified ? (
                                            <span className="badge badge-success gap-1">
                                                <FaCheckCircle />
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="badge badge-warning">
                                                Not Verified
                                            </span>
                                        )}
                                    </div>

                                </div>

                            </div>


                            {/* Verify Button */}
                            {!user?.emailVerified && (
                                <button
                                    onClick={() => {
                                        handleVerifyEmail()
                                    }}
                                    className="btn btn-sm border-none bg-secondary text-white hover:bg-secondary/90"
                                >
                                    Verify Email
                                </button>
                            )}

                        </div>


                        {/* Warning */}
                        {!user?.emailVerified && (
                            <div className="mt-5 flex items-start gap-3 rounded-xl bg-warning/10 p-4 text-sm">

                                <FaShieldAlt className="mt-0.5 shrink-0 text-warning" />

                                <p>
                                    Your email address hasn't been verified yet.
                                    Please verify it to keep your account secure
                                    and access all features.
                                </p>

                            </div>
                        )}

                    </div>

                </div>


                {/* ================= ACCOUNT INFORMATION ================= */}
                <div className="mt-6 rounded-2xl bg-base-100 shadow-lg">

                    <div className="p-6 md:p-7">

                        <h3 className="text-lg font-bold">
                            Account Information
                        </h3>

                        <p className="mt-1 text-sm text-base-content/60">
                            Your basic account details.
                        </p>


                        <div className="mt-5 grid gap-4 sm:grid-cols-2">

                            {/* Name */}
                            <div className="rounded-xl bg-base-200 p-5">

                                <div className="flex items-center gap-2 text-sm text-base-content/50">
                                    <FaUser />
                                    Name
                                </div>

                                <p className="mt-2 font-semibold">
                                    {user?.displayName || "Not set"}
                                </p>

                            </div>


                            {/* Email */}
                            <div className="rounded-xl bg-base-200 p-5">

                                <div className="flex items-center gap-2 text-sm text-base-content/50">
                                    <FaEnvelope />
                                    Email
                                </div>

                                <p className="mt-2 break-all font-semibold">
                                    {user?.email}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div >
    );
};

export default Profile;