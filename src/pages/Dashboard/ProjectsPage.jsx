import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  getProjects,
  getUserMemberProjects,
} from "../../api/projects";
import { useAuth } from "../../context/AuthContext";
import TabButton from "../../components/TabButton";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";

const ProjectsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    ownerId: user.id,
  });

  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const { data: memberProjects } = useQuery({
    queryKey: ["memberProjects"],
    queryFn: getUserMemberProjects,
  });

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      setIsModalOpen(false);
      setNewProject({ name: "", description: "", ownerId: user.id });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createProjectMutation.mutate(newProject);
    toast.success("Project created successfully!");
  };

  // ✅ Always call hooks before conditional returns
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (activeTab === "Owner") {
      return projects.filter((project) => project.ownerId === user?.id);
    }
    if (activeTab === "Member") {
      return memberProjects || []; // Use memberProjects when "Member" tab is active
    }
    return projects; // default for "All"
  }, [projects, memberProjects, activeTab, user]);

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

  // ✅ Main UI
  return (
    <div className="min-h-scree text-gray-200 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl font-bold text-white">Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition cursor-pointer"
        >
          + New Project
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-5 border-b border-gray-700 pb-2">
        {["All", "Owner", "Member"].map((tab) => (
          <TabButton
            key={tab}
            tabName={tab}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        ))}
      </div>

      {/* Projects */}
      {filteredProjects.length === 0 ? (
        <div className="text-gray-400 text-center py-10">
          No {activeTab.toLowerCase()} projects found.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project) => (
            <Link to={project.id} key={project.id}>
              <div className="border border-gray-700 rounded-xl p-4 hover:border-blue-600 transition cursor-pointer shadow-md hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg text-white font-semibold mb-1">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Project Name</label>
            <input
              type="text"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Description</label>
            <textarea
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
              rows="3"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white cursor-pointer"
              disabled={createProjectMutation.isPending}
            >
              {createProjectMutation.isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
