import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getIssuesByUserId } from "../../api/issues";
import { useAuth } from "../../context/AuthContext";
import TabButton from "../../components/TabButton";

const IssuesPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Open");
  
  const {
    data: issues,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["issues", user?.id],
    queryFn: () => getIssuesByUserId(user?.id),
    enabled: !!user,
  });

  // ✅ useMemo hook also runs always
  const filteredIssues = useMemo(() => {
    if (!issues) return [];
    if (activeTab === "Open") {
      return issues.filter((issue) => issue.status === "OPEN");
    } else if (activeTab === "Closed") {
      return issues.filter((issue) => issue.status === "CLOSED");
    } else {
      return issues;
    }
  }, [issues, activeTab]);

  // ✅ render conditions go *after* all hooks
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

  if (isError) {
    return (
      <div className="flex items-center justify-center h-60 text-red-400 font-medium">
        Failed to fetch issues. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl font-bold text-white">Issues</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-5 border-b border-gray-700 pb-2">
        {["Open", "Closed", "All"].map((tab) => (
          <TabButton
            key={tab}
            tabName={tab}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        ))}
      </div>

      {filteredIssues.length === 0 ? (
        <div className="text-gray-400 text-center py-10">
          No {activeTab.toLowerCase()} issues found.
        </div>
      ) : (
        <div className="space-y-2">
          {filteredIssues.map((issue) => (
            <Link key={issue.id} to={`/issues/${issue.id}`}>
              <div className="border border-gray-700 rounded-xl p-3 hover:border-blue-600 transition cursor-pointer shadow-md hover:shadow-lg">
                <div className="flex items-center justify-between space-x-3">
                  <h3 className="text-lg text-white font-semibold mb-1"> {issue.title} </h3>
                  <p className="text-sm text-gray-400"> Created: {new Date(issue.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default IssuesPage;
