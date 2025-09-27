import { api } from "./api";

export const fetchChats=async(projectId)=>{
    const res=await api.get(`/chat/${projectId}`);
    return res.data;
}

export const postChat=async(projectId,message)=>{
    const res=await api.post(`/chat/${projectId}`,{message});
    return res.data;
}