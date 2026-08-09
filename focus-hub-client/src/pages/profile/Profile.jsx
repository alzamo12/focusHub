import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import { Mail } from 'lucide-react';
import { toast } from "react-toastify";

const Profile = () => {
    const { user, emailVerification } = useAuth();
    const isVerified = user?.emailVerified;
    return (
        <div className="text-base-content">
            this is profile page
            {
                isVerified ? '' :
                    <button className="btn btn-primary" onClick={() => {
                        // Call the email verification function from the auth context
                        emailVerification()
                            .then(() => {
                                Swal.fire({
                                    title: "Verify Your Email",
                                    icon: "info",
                                    html: `
        <p class="text-base-content/70 mb-4">
            We've sent a verification link to your email address.
        </p>

        <a 
            href="https://mail.google.com/" 
            target="_blank"
            class="font-semibold text-primary hover:underline"
        >
            Open your email
        </a>

        <p class="text-sm text-base-content/50 mt-3">
            Please check your inbox or spam folder.
        </p>
    `,

                                    showCloseButton: true,
                                    showCancelButton: true,
                                    focusConfirm: false,

                                    confirmButtonText: "I've Verified",
                                    // cancelButtonText: "Resend Email",

                                    confirmButtonColor: "#570df8",
                                    cancelButtonColor: "#6b7280",

                                    customClass: {
                                        popup: "rounded-2xl",
                                        title: "text-2xl font-bold",
                                        confirmButton: "rounded-lg px-5",
                                        cancelButton: "rounded-lg px-5"
                                    }
                                });
                            }).catch((err) => {
                                toast.error("Please try again later")
                            })
                    }}>
                        Verify Email
                    </button>
            }
        </div>
    );
};

export default Profile; 