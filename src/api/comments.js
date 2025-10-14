import axiosClient from "./axiosClient";

export const getComments = async (issuesId) => {
  const response = await axiosClient.get(`/issues/${issuesId}/comments`);
  return response.data;
};

export const createComment = async (issueId, commentData) => {
  const token = localStorage.getItem("token");

  const response = await axiosClient.post( `/issues/${issueId}/comments`, commentData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
