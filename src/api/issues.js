import axiosClient from "./axiosClient";

export const getIssuesByUserId = async (userId) => {
  if (!userId) throw new Error("User ID is required to fetch issues.");
  const response = await axiosClient.get(`issues/user/${userId}`);
  return response.data;
};

export const createIssue = async (issueData) => {
  const response = await axiosClient.post("/issues", issueData);
  return response.data;
};

export const updateIssue = async (issueId, issueData) => {
  const response = await axiosClient.put(`/issues/${issueId}`, issueData);
  return response.data;
};

export const deleteIssue = async (issueId) => {
  const response = await axiosClient.delete(`/issues/${issueId}`);
  return response.data;
};

export const getIssueById = async (issueId) => {
  const response = await axiosClient.get(`/issues/${issueId}`);
  return response.data;
};

export const getIssuesByProjectId = async (projectId) => {
  const response = await axiosClient.get(`/issues/project/${projectId}`);
  return response.data;
};

export const getAllIssues = async () => {
  const response = await axiosClient.get("/issues");
  return response.data;
};
