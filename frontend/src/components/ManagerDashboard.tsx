import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

interface TeamGoal {
  id: number;
  thrust_area: string;
  title: string;
  description: string;
  uom: string;
  target: number;
  weightage: number;
  is_locked: boolean;
  owner: { id: string; name: string; };
}

interface CheckIn {
  id: number;
  quarter: string;
  actual_achievement: number;
  status: string;
  manager_comment: string | null;
  progress_score: number;
}

export const ManagerDashboard = () => {
  const [goals, setGoals] = useState<TeamGoal[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [activeGoal, setActiveGoal] = useState<TeamGoal | null>(null);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [reviewComment, setReviewComment] = useState<{ [key: number]: string }>({});

  const managerId = "dev-manager-001"; // DEV MODE

  useEffect(() => {
    fetchTeamGoals();
  }, []);

  const fetchTeamGoals = async () => {
    try {
      const response = await apiClient.get(`/managers/${managerId}/team-goals`);
      setGoals(response.data);
    } catch (err) {
      console.error("Failed to load team goals", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (goalId: number) => {
    try {
      await apiClient.patch(`/goals/${goalId}`, { is_locked: true, manager_id: managerId });
      setGoals(goals.map(g => g.id === goalId ? { ...g, is_locked: true } : g));
    } catch (err) {
      alert("Failed to approve goal.");
    }
  };

  const openReviewModal = async (goal: TeamGoal) => {
    setActiveGoal(goal);
    try {
      const response = await apiClient.get(`/goals/${goal.id}/check-ins`);
      setCheckIns(response.data);
    } catch (err) {
      console.error("Failed to fetch check-ins", err);
    }
  };

  const handleSubmitReview = async (checkInId: number) => {
    try {
      const comment = reviewComment[checkInId];
      if (!comment) return alert("Please enter a comment first.");

      await apiClient.patch(`/check-ins/${checkInId}/review`, {
        manager_comment: comment
      });

      // Update local state to reflect the new comment
      setCheckIns(checkIns.map(ci => ci.id === checkInId ? { ...ci, manager_comment: comment } : ci));
      alert("Review submitted successfully!");
    } catch (err) {
      alert("Failed to submit review.");
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading team goals...</div>;

  return (
    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm mt-6">
      <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-400 mb-6">
        Team Goal Approvals & Reviews
      </h3>

      {goals.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No team goals found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300">
                <th className="p-3">Employee</th>
                <th className="p-3">Thrust Area</th>
                <th className="p-3">Goal Title</th>
                <th className="p-3">Target</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {goals.map((goal) => (
                <tr key={goal.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="p-3 font-medium">{goal.owner.name}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">{goal.thrust_area}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">{goal.title}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">{goal.target} <span className="uppercase text-xs">({goal.uom})</span></td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${goal.is_locked ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {goal.is_locked ? 'Locked' : 'Pending Review'}
                    </span>
                  </td>
                  <td className="p-3">
                    {!goal.is_locked ? (
                      <button onClick={() => handleApprove(goal.id)} className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded shadow">
                        Approve
                      </button>
                    ) : (
                      <button onClick={() => openReviewModal(goal)} className="px-3 py-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 text-sm font-medium rounded shadow">
                        Review Progress
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Check-In Review Modal */}
      {activeGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl max-w-2xl w-full border border-gray-200 dark:border-gray-800 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold">Review Check-ins: <span className="text-primary-600">{activeGoal.title}</span></h4>
              <button onClick={() => setActiveGoal(null)} className="text-gray-500 hover:text-gray-700 font-bold text-xl">&times;</button>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">Employee: {activeGoal.owner.name} | Target: {activeGoal.target} {activeGoal.uom.toUpperCase()}</p>

            {checkIns.length === 0 ? (
              <p className="text-gray-500 italic">No check-ins logged for this goal yet.</p>
            ) : (
              <div className="space-y-6">
                {checkIns.map(ci => (
                  <div key={ci.id} className="p-4 bg-background-light dark:bg-background-dark rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-primary-700 dark:text-primary-400">{ci.quarter} Update</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium capitalize">{ci.status.replace('_', ' ')}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div><span className="text-gray-500">Actual:</span> <span className="font-semibold">{ci.actual_achievement}</span></div>
                      <div><span className="text-gray-500">System Score:</span> <span className="font-semibold text-green-600">{ci.progress_score}%</span></div>
                    </div>

                    {ci.manager_comment ? (
                      <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded border border-green-100 dark:border-green-900/30 text-sm">
                        <strong className="text-green-700 dark:text-green-400 block mb-1">Your Feedback:</strong>
                        <p className="text-gray-700 dark:text-gray-300">{ci.manager_comment}</p>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <textarea 
                          placeholder="Add your structured review comment here..."
                          className="w-full p-2 text-sm rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-primary-500"
                          rows={2}
                          value={reviewComment[ci.id] || ""}
                          onChange={(e) => setReviewComment({...reviewComment, [ci.id]: e.target.value})}
                        />
                        <button 
                          onClick={() => handleSubmitReview(ci.id)}
                          className="mt-2 px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded transition-colors"
                        >
                          Submit Review
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};