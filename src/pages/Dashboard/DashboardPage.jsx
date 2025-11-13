import React, { useState, useEffect } from 'react';
import { getProjects } from '../../api/projects';
import { getAllIssues } from '../../api/issues';
import { getAllUsers } from '../../api/users';
import Scorecard from '../../components/Dashboard/Scorecard';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { FolderKanban, ListChecks, Users } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const DashboardPage = () => {
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsData = await getProjects();
        setProjects(projectsData);

        const issuesData = await getAllIssues();
        setIssues(issuesData);

        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const recentIssues = issues.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);

  return (
    <div style={{ padding: '20px' }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Scorecard title="Total Projects" value={projects.length} icon={<FolderKanban className="w-8 h-8 text-blue-500" />} />
        <Scorecard title="Total Issues" value={issues.length} icon={<ListChecks className="w-8 h-8 text-green-500" />} />
        <Scorecard title="Total Users" value={users.length} icon={<Users className="w-8 h-8 text-yellow-500" />} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-white text-lg font-medium mb-4">Issues by Priority</h3>
          <Pie
            data={{
              labels: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
              datasets: [
                {
                  label: 'Issues by Priority',
                  data: [
                    issues.filter(issue => issue.priority === 'LOW').length,
                    issues.filter(issue => issue.priority === 'MEDIUM').length,
                    issues.filter(issue => issue.priority === 'HIGH').length,
                    issues.filter(issue => issue.priority === 'CRITICAL').length,
                  ],
                  backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                  ],
                  borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                  ],
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              // responsive: false,
              // maintainAspectRatio: false,
              // width: 200,
              // height: 200,
              plugins: {
                legend: {
                  display: true,
                  position: 'top',

                },
                title: {
                  display: false,
                  text: 'Issues by Priority',
                },
              },
            }}
          />
        </div>

        <div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-white text-lg font-medium mb-4">Issues per Project</h3>
            <Bar
              data={{
                labels: projects.map(project => project.name),
                datasets: [
                  {
                    label: 'Number of Issues',
                    data: projects.map(project => issues.filter(issue => issue.projectId === project.id).length),
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-white text-lg font-medium mb-4">Issue Status</h3>
            <Bar
              data={{
                labels: ['OPEN', 'IN PROGRESS', 'IN REVIEW', 'RESOLVED', 'CLOSED'],
                datasets: [
                  {
                    label: 'Issue Status',
                    data: [
                      issues.filter(issue => issue.status === 'OPEN').length,
                      issues.filter(issue => issue.status === 'IN_PROGRESS').length,
                      issues.filter(issue => issue.status === 'IN_REVIEW').length,
                      issues.filter(issue => issue.status === 'RESOLVED').length,
                      issues.filter(issue => issue.status === 'CLOSED').length,
                    ],
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                    position: 'top',
                  },
                  title: {
                    display: false,
                    text: 'Issue Status',
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-white text-lg font-medium mb-4">Issues Created Over Time</h3>
          <Line
            data={{
              labels: issues.map(issue => new Date(issue.createdAt).toLocaleDateString()),
              datasets: [
                {
                  label: 'Issues Created',
                  data: issues.map(issue => {
                    const date = new Date(issue.createdAt).toLocaleDateString();
                    return issues.filter(i => new Date(i.createdAt).toLocaleDateString() === date).length;
                  }),
                  fill: false,
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-white text-lg font-medium mb-4">Team Workload</h3>
          <Bar
            data={{
              labels: users.map(user => user.name),
              datasets: [
                {
                  label: 'Open Issues',
                  data: users.map(user => issues.filter(issue => issue.assigneeId === user.id && issue.status !== 'CLOSED').length),
                  backgroundColor: 'rgba(255, 159, 64, 0.2)',
                  borderColor: 'rgba(255, 159, 64, 1)',
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              indexAxis: 'y',
              scales: {
                x: {
                  beginAtZero: true,
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-lg p-6 md:col-span-2">
          <h3 className="text-white text-lg font-medium mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentIssues.map(issue => (
              <div key={issue.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="text-white font-medium">{issue.title}</p>
                  <p className="text-gray-400 text-sm">
                    Updated on {new Date(issue.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    issue.priority === 'LOW' ? 'bg-red-500 text-white' :
                    issue.priority === 'MEDIUM' ? 'bg-blue-500 text-white' :
                    issue.priority === 'HIGH' ? 'bg-yellow-500 text-black' :
                    issue.priority === 'CRITICAL' ? 'bg-purple-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {issue.priority.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    issue.status === 'OPEN' ? 'bg-red-500 text-white' :
                    issue.status === 'IN_PROGRESS' ? 'bg-blue-500 text-white' :
                    issue.status === 'IN_REVIEW' ? 'bg-yellow-500 text-black' :
                    issue.status === 'RESOLVED' ? 'bg-purple-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {issue.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
