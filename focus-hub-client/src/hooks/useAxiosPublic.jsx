import axios from "axios";

const axiosPublic = axios.create({
    // baseURL: 'http://localhost:5000/api',
    // baseURL: 'https://focus-hub-server.onrender.com/',
    baseURL: "https://focus-hub-server.vercel.app/api"
    // withCredentials: true
})
const useAxiosPublic = () => {
    return axiosPublic
};

export default useAxiosPublic;