import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { getIssueById, updateIssue } from "../../api/issues";
import { getProjectMembers } from "../../api/projects";
import Modal from "../../components/Modal";
import { useAuth } from "../../context/AuthContext";
import { createComment, getComments } from "../../api/comments";
import { getAttachments, uploadAttachment } from "../../api/attachment";
import { toast } from "react-toastify";
import FileUploder from "../../components/FileUploder";
import { Paperclip } from "lucide-react";

const IssueDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedFile, setSelectedFile] = useState(null);
  const [comment, setComment] = useState({ content: "", userId: user.id });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [issueData, setIssueData] = useState({
    title: "",
    description: "",
    priority: "",
    status: "",
    assigneeId: "",
  });

  const {
    data: issue,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["issueDetails", id],
    queryFn: () => getIssueById(id),
  });

  const { data: members } = useQuery({
    queryKey: ["projectMembers", issue?.projectId],
    queryFn: () => getProjectMembers(issue.projectId),
    enabled: !!issue?.projectId,
  });

  const { data: comments } = useQuery({
    queryKey: ["comments"],
    queryFn: () => getComments(id),
  });

  const { mutate: updateIssueMutation } = useMutation({
    mutationFn: () => updateIssue(id, issueData),
    onSuccess: () => {
      queryClient.invalidateQueries(["issueDetails", id]);
      closeEditModal();
    },
  });

  const { mutate: updateIssueStatusMutation } = useMutation({
    mutationFn: () => updateIssue(id, {...issueData, status: "CLOSED"}),
    onSuccess: () => {
      queryClient.invalidateQueries(["issueDetails", id]);
    },
  })

  const { mutate: updateIssueReopenMutation } = useMutation({
    mutationFn: () => updateIssue(id, {...issueData, status: "OPEN"}),
    onSuccess: () => {
      queryClient.invalidateQueries(["issueDetails", id]);
    },
  })

  const { mutate: createCommentMutation } = useMutation({
    mutationFn: () => createComment(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries(["issueDetails", id]);
      queryClient.invalidateQueries(["comments"]);
      setComment({ content: "", userId: user.id });
    },
  });


  const { data: attachments } = useQuery({
    queryKey: ["attachments", id],
    queryFn: () => getAttachments(id),
  });

  const { mutate: uploadAttachmentMutation } = useMutation({
    mutationFn: () => uploadAttachment(id, selectedFile, user.id),
    onSuccess: () => {
      queryClient.invalidateQueries(["issueDetails", id]);
      setSelectedFile(null);
      toast.success("File uploaded successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload file.");
    },
  });

  useEffect(() => {
    if (issue) {
      setIssueData({
        title: issue.title,
        description: issue.description,
        priority: issue.priority,
        status: issue.status,
        assigneeId: issue.assigneeId,
      });
    }
  }, [issue]);

  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIssueData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setComment((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdateIssue = (e) => {
    e.preventDefault();
    updateIssueMutation();
    toast.success("Issue updated successfully!");
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile && !comment.content) {
      toast.error("Please add a comment or select a file to upload.");
      return;
    }

    if (selectedFile) {
      uploadAttachmentMutation();
    }
    if (comment.content) {
      createCommentMutation();
      toast.success("Comment added successfully!");
    }
  };

  const handleCloseIssue = (e) => {
    e.preventDefault();
    updateIssueStatusMutation();
    toast.success("Issue closed successfully!");
  }

  const handleReopenIssue = (e) => {
    e.preventDefault();
    updateIssueReopenMutation();
    toast.success("Issue reopened successfully!");
  }

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-1/3 bg-gray-700 rounded"></div>
        <div className="bg-[#1C1F25] border border-gray-700 rounded-xl p-6 space-y-4">
          <div className="h-5 w-1/4 bg-gray-700 rounded"></div>
          <div className="h-4 w-full bg-gray-700 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#1C1F25] border border-gray-700 rounded-xl p-4 space-y-2">
            <div className="h-4 w-1/3 bg-gray-700 rounded"></div>
            <div className="h-5 w-1/2 bg-gray-700 rounded"></div>
          </div>
          <div className="bg-[#1C1F25] border border-gray-700 rounded-xl p-4 space-y-2">
            <div className="h-4 w-1/3 bg-gray-700 rounded"></div>
            <div className="h-5 w-1/2 bg-gray-700 rounded"></div>
          </div>
          <div className="bg-[#1C1F25] border border-gray-700 rounded-xl p-4 space-y-2">
            <div className="h-4 w-1/3 bg-gray-700 rounded"></div>
            <div className="h-5 w-1/2 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-60 text-red-400 font-medium">
        Failed to fetch issue details. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-200">
      <div className="flex flex-col md:flex-row items-start justify-between mb-6">
        <h1 className="text-xl flex-10 font-semibold text-white mb-3 mr-2 md:text-3xl">
          {issue.title}
        </h1>
        <button
          onClick={openEditModal}
          className="bg-blue-600 hover:bg-blue-700 flex-1 text-white px-4 py-2 rounded-lg shadow transition cursor-pointer mt-1"
        >
          Edit Issue
        </button>
      </div>

      <div className="bg-[#1C1F25] border border-gray-700 rounded-xl p-6 mb-6 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-3">Description</h2>
        <p className="text-gray-400 mb-4 whitespace-pre-wrap">
          {issue.description}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-semibold text-gray-300">Project:</span>
            <span className="text-gray-400 ml-2">{issue.project.name}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-300">Created At:</span>
            <span className="text-gray-400 ml-2">
              {new Date(issue.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="font-semibold text-gray-300">Last Updated:</span>
            <span className="text-gray-400 ml-2">
              {new Date(issue.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
        <div className="bg-[#1C1F25] border border-gray-700 rounded-xl p-4">
          <span className="font-semibold text-gray-300 block mb-1">Status</span>
          <span className="text-gray-400">
            {issue.status.replace("_", " ")}
          </span>
        </div>
        <div className="bg-[#1C1F25] border border-gray-700 rounded-xl p-4">
          <span className="font-semibold text-gray-300 block mb-1">
            Priority
          </span>
          <span className="text-gray-400">{issue.priority}</span>
        </div>
        <div className="bg-[#1C1F25] border border-gray-700 rounded-xl p-4">
          <span className="font-semibold text-gray-300 block mb-1">
            Reporter
          </span>
          <span className="text-gray-400">{issue.reporter.name}</span>
        </div>
        <div className="bg-[#1C1F25] border border-gray-700 rounded-xl p-4">
          <span className="font-semibold text-gray-300 block mb-1">
            Assignee
          </span>
          <span className="text-gray-400">{issue.assignee.name}</span>
        </div>
      </div>

      {/* Attachments */}
      {attachments && attachments.length > 0 && (
        <div className="bg-[#1C1F25] border border-gray-700 rounded-xl p-6 mb-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-3">Attachments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {attachments.map((attachment) => (
              <a
                key={attachment.id}
                href={attachment.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2A2D36] p-3 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition"
              >
                <Paperclip className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-300 truncate">
                  {attachment.fileUrl.match(/[^/]+(?=\?.*$|$)/)[0]}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      <div className="bg-[#1C1F25] border border-gray-700 rounded-xl p-6 mb-6 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-3">Comments</h2>
        {comments && comments.length === 0 && (
          <p className="text-gray-400">No comments yet</p>
        )}
        {comments && comments.map((comment, idx) => (
          <div key={idx} className="mb-5 border-b border-gray-500 pb-2">
            <div className="flex items-center mb-2">
              <span className="font-semibold text-gray-300 mr-2">
                {comment.author.name}
              </span>
            </div>
            <p className="text-gray-400">{comment.content}</p>
            <p className="text-gray-400">{comment.createdAt}</p>
            <p className="text-gray-400">{comment.updatedAt}</p>
            <p className="text-gray-400">{comment.author.name}</p>
            <p className="text-gray-400">{comment.author.role}</p>
          </div>
        ))}
      </div>

      {/* Add Comment */}
      <div className="bg-[#1C1F25] border border-gray-700 rounded-xl p-6 mb-6 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-3">Add Comments</h2>
        <form onSubmit={handleCommentSubmit}>
          <div className="mb-4">
            <textarea
              id="content"
              name="content"
              rows="3"
              value={comment.content}
              onChange={handleCommentChange}
              placeholder="Enter your comment..."
              className="w-full bg-[#2A2D36] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>

            <FileUploder
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
              onRemoveFile={() => setSelectedFile(null)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button type="submit" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow transition cursor-pointer">
              {selectedFile || comment.content ? "Submit" : "Add Comment or Attachment"}
            </button>
            <button type="button" onClick={issue.status === "CLOSED" ? handleReopenIssue : handleCloseIssue } className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition cursor-pointer">
              {issue.status.replace("_", " ") === "CLOSED" ? "Reopen" : "Close"} Issue
            </button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Edit Issue"
      >
        <form onSubmit={handleUpdateIssue}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Issue Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={issueData.title}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              rows="3"
              required
              className="w-full bg-[#2A2D36] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
                onChange={handleInputChange}
                required
                className="w-full bg-[#2A2D36] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
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
                onChange={handleInputChange}
                required
                className="w-full bg-[#2A2D36] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="CLOSED">Closed</option>
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
              onChange={handleInputChange}
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
              onClick={closeEditModal}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default IssueDetailsPage;
