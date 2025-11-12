import axiosClient from "./axiosClient";

export const uploadAttachment = async (issueId, file, userId) => {
    const formData = new FormData();
    formData.append("files", file);
    formData.append("issueId", issueId);
    formData.append("userId", userId);

    const response = await axiosClient.post(`/issues/${issueId}/attachments`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const getAttachments = async (issueId) => {
    const response = await axiosClient.get(`/issues/${issueId}/attachments`);
    return response.data;
};