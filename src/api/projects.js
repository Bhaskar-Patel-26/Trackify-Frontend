import axiosClient from "./axiosClient";

export const getProjects = async () => {
  const response = await axiosClient.get("/projects");
  return response.data;
};

export const getUserMemberProjects = async () => {
  const token = localStorage.getItem("token"); // or sessionStorage, depending on where you saved it

  const response = await axiosClient.get("/projects/myProjects", {
    headers: { Authorization: `Bearer ${token}`}
  });

  return response.data;
};

export const getProjectById = async (projectId) => {
  const response = await axiosClient.get(`/projects/${projectId}`);
  return response.data;
};


export const createProject = async (projectData) => {
  console.log(projectData)
  let response
  try {
    response = await axiosClient.post("/projects", projectData);
  } catch (error) {
    console.log(error)
  }
  return response.data;
};

export const updateProject = async (id, data) => {
  const response = await axiosClient.put(`/projects/${id}`, data);
  return response.data;
};

export const getProjectMembers = async (projectId) => {
  const response = await axiosClient.get(`/projects/${projectId}/members`);
  return response.data;
};