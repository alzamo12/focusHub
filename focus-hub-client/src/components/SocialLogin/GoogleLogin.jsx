import useAuth from '../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import LoadingSpinner from '../Spinner/LoadingSpinner';

const GoogleLogin = () => {
    const { googleLogin, user: authUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/dashboard";
    // const { mutate } = useCreateUser(from);
    const axiosPublic = useAxiosPublic();
    // const { user: authUser } = useAuth();


    const handleSocialLogin = () => {
        googleLogin()
            .then(async (result) => {
                const user = result?.user;
                if (!user) return;
                const userData = {
                    name: user?.displayName,
                    email: user?.email,
                    photoURL: user?.photoURL
                };
                try {
                    const res = await axiosPublic.post("/users", userData);
                    // console.log(res?.data)
                }
                catch (err) {
                    console.log(err)
                }
                finally {
                    if (user) {
                        // console.log(authUser)
                        navigate(from)
                    }
                }
            })
            .catch(err => {
                console.error(err)
            })
    }
    return (
        <div>
            <button
                onClick={handleSocialLogin}
                type="button"
                className="btn btn-outline w-full rounded-lg flex items-center justify-center gap-3"
            >
                {/* Google icon */}
                <svg width="18" height="18" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M533.5 278.4c0-18.1-1.6-35.6-4.8-52.4H272.1v99.2h147.4c-6.4 34.7-25.9 64.1-55.3 83.8v69.6h89.2c52.1-48 82.1-119 82.1-200.2z" fill="#4285F4" />
                    <path d="M272.1 544.3c73.9 0 135.8-24.5 181.1-66.5l-89.2-69.6c-24.9 16.7-56.7 26.6-91.9 26.6-70.7 0-130.6-47.7-152.1-111.7H28.6v70.4C73.8 489.4 167.6 544.3 272.1 544.3z" fill="#34A853" />
                    <path d="M120 322.7c-11.9-35.3-11.9-73.1 0-108.4V143.9H28.6C10.1 180.9 0 222.9 0 266.9s10.1 86 28.6 123z" fill="#FBBC05" />
                    <path d="M272.1 107.9c38.9 0 74 13.4 101.6 39.7l76.1-76.1C405.7 24.5 343.8 0 272.1 0 167.6 0 73.8 54.9 28.6 143.9l91.4 70.4c21.5-64 81.4-111.7 152.1-111.7z" fill="#EA4335" />
                </svg>
                Continue with Google
            </button>
        </div>
    );
};

export default GoogleLogin;