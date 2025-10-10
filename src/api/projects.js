import axiosClient from "./axiosClient";

export const getProjects = async () => {
  const response = await axiosClient.get("/projects");
  return response.data;
};

export const getProjectById = async (projectId) => {
  const response = await axiosClient.get(`/projects/${projectId}`);
  return response.data;
};

export const createProject = async (projectData) => {
  const response = await axiosClient.post("/projects", projectData);
  return response.data;
};