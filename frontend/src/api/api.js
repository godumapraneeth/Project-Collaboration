import axios from "axios";

const baseURL=import.meta.env.VITE_API_URL;

 export const api=axios.create({
    baseURL,
    withCredentials:true,
});

api.interceptors.request.use((config)=>{
    const token=localStorage.getItem("token");
    if(token){
        config.headers.Authorization=`Bearer ${token}`;
    }
    return config;
},(error)=>{
    return Promise.reject(error);
}
)