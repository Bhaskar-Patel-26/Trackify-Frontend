import axiosClient from "./axiosClient";

export const getComments = async (issuesId) => {
  const response = await axiosClient.get(`/issues/${issuesId}/comments`);
  return response.data;
};
