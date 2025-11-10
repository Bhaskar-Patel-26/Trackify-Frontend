import axiosClient from "./axiosClient";

export const getAllUsers = async () => {
    const response = await axiosClient.get("/users");
    return response.data;
}

export const updateUser = async (userId, userData) => {
    const response = await axiosClient.put(`/users/${userId}`, userData);
    return response.data;
}