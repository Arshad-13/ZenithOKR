import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

interface AuditLog {
  id: number;
  goal_id: number;
  changed_by: string;
  change_summary: string;
  timestamp: string;
}

export const AdminDashboard = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      // Updated to match your Phase 2 backend structure
      const response = await apiClient.get('/admin/audit-logs'); 
      setLogs(response.data);
    } catch (err) {
      setError("Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <div className="p-6 text-gray-500">Loading audit trail...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm mt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-400">
            System Audit Trail
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Immutable log of all changes made to locked goals.
          </p>
        </div>
      </div>

      {logs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No audit records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Goal ID</th>
                <th className="p-3">Changed By (User ID)</th>
                <th className="p-3">Modification Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <td className="p-3 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3 font-medium text-gray-900 dark:text-gray-100">#{log.goal_id}</td>
                  <td className="p-3 text-sm font-mono text-gray-500 dark:text-gray-400">{log.changed_by}</td>
                  <td className="p-3 text-sm">
                    {/* Highlight key actions like APPROVAL for easy reading */}
                    {log.change_summary.includes('APPROVED') ? (
                      <span className="text-green-600 dark:text-green-400 font-medium">{log.change_summary}</span>
                    ) : (
                      <span className="text-gray-700 dark:text-gray-300">{log.change_summary}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};