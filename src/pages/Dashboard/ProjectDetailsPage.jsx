import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

import { getProjectById, updateProject } from "../../api/projects";
import { createIssue, getIssuesByProjectId } from "../../api/issues";
import { getProjectMembers } from "../../api/projects";
import TabButton from "../../components/TabButton";
import Modal from "../../components/Modal";
import { useAuth } from "../../context/AuthContext";

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("Issues");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [projectData, setProjectData] = useState({ name: "", description: "" });
  const [issueData, setIssueData] = useState({
    title: "",
    description: "",
    priority: "",
    status: "",
    assigneeId: "",
    reporterId: user.id,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["projectDetails", id],
    queryFn: () => getProjectById(id),
  });

  const {
    data: projectIssues,
    isLoading: projectIssuesLoading,
    isError: projectIssuesError,
  } = useQuery({
    queryKey: ["projectIssues", id],
    queryFn: () => getIssuesByProjectId(id),
    enabled: activeTab === "Issues",
  });

  const {
    data: members,
    isLoading: membersLoading,
    isError: membersError,
  } = useQuery({
    queryKey: ["projectMembers", id],
    queryFn: () => getProjectMembers(id),
  });

  const { mutate: updateProjectMutation } = useMutation({
    mutationFn: () => updateProject(id, projectData),
    onSuccess: () => {
      queryClient.invalidateQueries(["projectDetails", id]);
      closeEditModal();
    },
  });

  const { mutate: createIssueMutation } = useMutation({
    mutationFn: () => createIssue(id, issueData),
    onSuccess: () => {
      queryClient.invalidateQueries(["projectIssues"]);
      setIssueData({
        title: "",
        description: "",
        priority: "",
        status: "",
        assigneeId: "",
        reporterId: user.id,
      });
      closeModal();
    },
  });

  useEffect(() => {
    if (data) {
      setProjectData({ name: data.name, description: data.description });
    }
  }, [data]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleIssueInputChange = (e) => {
    const { name, value } = e.target;
    setIssueData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdateProject = (e) => {
    e.preventDefault();
    updateProjectMutation();
  };

  const handleCreateIssue = (e) => {
    e.preventDefault();
    createIssueMutation();
  };

  // ✅ Skeleton Loader (Dark theme)
  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-[#1C1F25] border border-gray-700 rounded-xl p-4 shadow-md"
            >
              <div className="flex-1">
                <div className="h-5 w-1/3 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-gray-700 rounded"></div>
              </div>
              <div className="h-4 w-24 bg-gray-700 rounded ml-4"></div>
            </div>
          ))}
      </div>
    );
  }

  // ✅ Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center h-60 text-red-400 font-medium">
        Failed to fetch projects. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white mb-2 sm:mb-0">
          {data.name}
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={openEditModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition cursor-pointer"
          >
            Edit Project
          </button>
          <button
            onClick={openModal}
            disabled={!members || members.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition cursor-pointer"
          >
            New Issue
          </button>
        </div>
      </div>

      {/* Project Info */}
      <div className="bg-[#1C1F25] border border-gray-700 rounded-xl p-6 mb-6 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-3">Description</h2>
        <p className="text-gray-400 mb-4">{data.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-semibold text-gray-300">Project Owner:</span>
            <span className="text-gray-400 ml-2">{data.owner.name}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-300">Created At:</span>
            <span className="text-gray-400 ml-2">
              {new Date(data.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="font-semibold text-gray-300">Last Updated:</span>
            <span className="text-gray-400 ml-2">
              {new Date(data.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-5 border-b border-gray-700 pb-2">
        {["Issues", "Members"].map((tab) => (
          <TabButton
            key={tab}
            tabName={tab}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "Issues" && (
          <div>
            {projectIssuesLoading && (
              <div className="text-center py-10 text-gray-400">
                Loading issues...
              </div>
            )}
            {projectIssuesError && (
              <div className="text-center py-10 text-red-400">
                Failed to load issues.
              </div>
            )}
            {projectIssues && (
              <div className="space-y-3">
                {projectIssues.map((issue) => (
                  <Link key={issue.id} to={`/issues/${issue.id}`}>
                    <div
                      key={issue.id}
                      className="bg-[#1C1F25] border border-gray-700 rounded-xl p-4 flex items-center justify-between shadow-md"
                    >
                      <div>
                        <p className="text-white font-semibold">
                          {issue.title}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Status: {issue.status}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Reporter: {issue.reporter.name}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Assignee: {issue.assignee.name}
                        </p>
                      </div>
                      <button className="text-red-500 hover:text-red-400 transition cursor-pointer">
                        <Trash2 className="w-5 h-5 ml-2" />
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === "Members" && (
          <div>
            {membersLoading && (
              <div className="text-center py-10 text-gray-400">
                Loading members...
              </div>
            )}
            {membersError && (
              <div className="text-center py-10 text-red-400">
                Failed to load members.
              </div>
            )}
            {members && (
              <div className="space-y-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="bg-[#1C1F25] border border-gray-700 rounded-xl p-4 flex items-center justify-between shadow-md"
                  >
                    <div>
                      <p className="text-white font-semibold">
                        {member.user.name}
                      </p>
                      <p className="text-gray-400 text-sm">{member.role}</p>
                    </div>
                    <button className="text-red-500 hover:text-red-400 transition cursor-pointer">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Issue Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create New Issue">
        <form onSubmit={handleCreateIssue}>
          <div className="mb-4">
            <label
              htmlFor="issueTitle"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Issue Title
            </label>
            <input
              type="text"
              id="issueTitle"
              name="title"
              value={issueData.title}
              onChange={handleIssueInputChange}
              required
              className="w-full bg-[#2A2D36] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={issueData.description}
              onChange={handleIssueInputChange}
              rows="3"
              required
              className="w-full bg-[#2A2D36] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="flex justify-between">
            <div className="mb-4">
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={issueData.priority}
                onChange={handleIssueInputChange}
                required
                className="w-55 bg-[#2A2D36] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={issueData.status}
                onChange={handleIssueInputChange}
                required
                className="w-55 bg-[#2A2D36] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Status</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="assigneeId"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Assign To
            </label>
            <select
              id="assigneeId"
              name="assigneeId"
              value={issueData.assigneeId}
              onChange={handleIssueInputChange}
              required
              className="w-full bg-[#2A2D36] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Assignee</option>
              {members &&
                members.map((member) => (
                  <option key={member.user.id} value={member.user.id}>
                    {member.user.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition cursor-pointer"
            >
              Create Task
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Edit Project"
      >
        <form onSubmit={handleUpdateProject}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Project Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={projectData.name}
              onChange={handleInputChange}
              className="w-full bg-[#2A2D36] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={projectData.description}
              onChange={handleInputChange}
              className="w-full bg-[#2A2D36] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeEditModal}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectDetailsPage;
