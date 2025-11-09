import axiosClient from "./axiosClient";

export const getAllUsers = async () => {
    const response = await axiosClient.get("/users");
    return response.data;
}