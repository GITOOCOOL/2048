import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const DeveloperMenu = ({ onClose }) => {
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseURL = `${API_BASE_URL}/logs`;

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [analyzing, setAnalyzing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newIssue, setNewIssue] = useState({
    title: "",
    content: "",
    priority: "medium",
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(baseURL);
      setLogs(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/analyze`);
      setLogs([response.data, ...logs]);
      setSelectedLog(response.data);
    } catch (error) {
      console.error("Error analyzing:", error);
      alert("Analysis failed. See console.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    if (!newIssue.title || !newIssue.content) {
      alert("Please fill in title and content");
      return;
    }

    try {
      const response = await axios.post(baseURL, {
        ...newIssue,
        type: "system_log",
        status: "pending",
        source: "user",
      });
      setLogs([response.data, ...logs]);
      setSelectedLog(response.data);
      setShowCreateForm(false);
      setNewIssue({ title: "", content: "", priority: "medium" });
    } catch (error) {
      console.error("Error creating issue:", error);
      alert("Failed to create issue.");
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filterStatus !== "all" && log.status !== filterStatus) return false;
    if (filterPriority !== "all" && log.priority !== filterPriority)
      return false;
    if (filterSource !== "all" && log.source !== filterSource) return false;
    return true;
  });

  const GeminiIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width="16"
      height="16"
      style={{ marginRight: "5px", color: "#e91e63" }}
    >
      <path d="M19.07 4.93L17.07 7.93L19.07 10.93L22.07 8.93L19.07 4.93ZM20 9L18.5 11.25L17 9L15.5 6.75L17 4.5L18.5 6.75L20 9ZM10 4L8 8L4 10L8 12L10 16L12 12L16 10L12 8L10 4ZM10 13.5L11 11.5L13 10.5L11 9.5L10 7.5L9 9.5L7 10.5L9 11.5L10 13.5ZM5 16L4 18L2 19L4 20L5 22L6 20L8 19L6 18L5 16Z" />
    </svg>
  );

  const CodegenIcon = () => (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      width="16" 
      height="16" 
      style={{ marginRight: "5px", color: "#9b59b6" }}
    >
      <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
    </svg>
  );

  return (
    <div className="developer-menu-overlay">
      <div className="developer-menu-content">
        <div className="dev-header">
          <h2>Developer Roadmap & Logs</h2>
          <div className="dev-filters">
            <button
              className="create-btn"
              onClick={() => setShowCreateForm(true)}
              title="New Issue"
            >
              +
            </button>
            <button
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? "Scanning..." : "✨ Analyze with AI"}
            </button>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="solved">Solved</option>
              <option value="in-progress">In Progress</option>
              <option value="pending">Pending</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
            >
              <option value="all">All Sources</option>
              <option value="user">User</option>
              <option value="gemini">Gemini</option>
              <option value="system">System</option>
              <option value="codegen">Codegen</option>
            </select>
          </div>
          <button className="close-btn" onClick={onClose}>
            X
          </button>
        </div>
        <div className="dev-body">
          {showCreateForm && (
            <div className="create-form-overlay">
              <div className="create-form">
                <h3>New Issue / Log</h3>
                <form onSubmit={handleCreateIssue}>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={newIssue.title}
                      onChange={(e) =>
                        setNewIssue({ ...newIssue, title: e.target.value })
                      }
                      placeholder="E.g., Bug: Score not updating"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      value={newIssue.priority}
                      onChange={(e) =>
                        setNewIssue({ ...newIssue, priority: e.target.value })
                      }
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Content (Markdown)</label>
                    <textarea
                      value={newIssue.content}
                      onChange={(e) =>
                        setNewIssue({ ...newIssue, content: e.target.value })
                      }
                      placeholder="Describe the issue or update..."
                      rows={5}
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="save-btn">
                      Save Issue
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {loading ? (
            <p>Loading logs...</p>
          ) : (
            <div className="logs-container">
              <div className="logs-list">
                <h3>History ({filteredLogs.length})</h3>
                <ul>
                  {filteredLogs.map((log) => (
                    <li
                      key={log._id}
                      className={`log-item ${
                        selectedLog?._id === log._id ? "active" : ""
                      } source-${log.source}`}
                      onClick={() => setSelectedLog(log)}
                    >
                      <div className="log-item-header">
                        <span className={`status-dot status-${log.status}`}></span>
                        {log.source === "gemini" && <GeminiIcon />}
                        {log.source === "codegen" && <CodegenIcon />}
                        <span className="log-title">{log.title}</span>
                      </div>
                      <div className="log-item-meta">
                        <span className="log-date">
                          {new Date(log.createdAt).toLocaleDateString()}
                        </span>
                        {log.priority === "high" && (
                          <span className="badge-priority-high">High</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="log-detail">
                {selectedLog ? (
                  <>
                    <h3 className={`detail-title source-text-${selectedLog.source}`}>
                      {selectedLog.title}
                    </h3>
                    <div className="log-meta">
                      <span className={`badge status-${selectedLog.status}`}>
                        {selectedLog.status}
                      </span>
                      <span className={`badge priority-${selectedLog.priority}`}>
                        {selectedLog.priority}
                      </span>
                      <span className="badge-source">
                        Source: {selectedLog.source}
                      </span>
                      <span>
                        Date: {new Date(selectedLog.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="log-markdown">
                      <pre>{selectedLog.content}</pre>
                    </div>
                  </>
                ) : (
                  <div className="placeholder">
                    Select a log to view details
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeveloperMenu;
