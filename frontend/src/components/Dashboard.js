import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

// Simple SVG Donut Chart Component
const DonutChart = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  
  if (total === 0) return <div className="no-data-chart">No tasks yet</div>;

  // Calculate percentages for stroke-dasharray
  const completedPct = (completed / total) * 100;
  const pendingPct = (pending / total) * 100;

  return (
    <div className="chart-wrapper">
      <svg viewBox="0 0 42 42" className="donut-chart">
        <circle className="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
        <circle className="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#E2E8F0" strokeWidth="5"></circle>
        
        {/* Completed Segment (Green) */}
        <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#10B981" strokeWidth="5" 
          strokeDasharray={`${completedPct} ${100 - completedPct}`} strokeDashoffset="25"></circle>
        
        {/* Pending Segment (Indigo) - Offset by completed */}
        <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#4F46E5" strokeWidth="5" 
          strokeDasharray={`${pendingPct} ${100 - pendingPct}`} strokeDashoffset={25 - completedPct}></circle>
      </svg>
      <div className="chart-legend">
        <span className="legend-item"><span className="dot green"></span> Completed</span>
        <span className="legend-item"><span className="dot indigo"></span> Pending</span>
      </div>
    </div>
  );
};

const Dashboard = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [profile, setProfile] = useState({});
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const API_URL = 'http://localhost/React Web App';

  useEffect(() => {
    fetchTasks();
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get(`${API_URL}/tasks.php?user_id=${user.id}`);
    setTasks(res.data);
  };

  const fetchProfile = async () => {
    const res = await axios.get(`${API_URL}/profile.php?user_id=${user.id}`);
    setProfile(res.data);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/tasks.php`, { ...newTask, user_id: user.id });
    setNewTask({ title: '', description: '' });
    fetchTasks();
  };

  const handleUpdateStatus = async (id, status) => {
    await axios.put(`${API_URL}/tasks.php`, { id, status });
    fetchTasks();
  };

  const handleDeleteTask = async (id) => {
    await axios.delete(`${API_URL}/tasks.php?id=${id}`);
    fetchTasks();
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/profile.php`, { ...profile, user_id: user.id });
    setIsEditingProfile(false);
    fetchProfile();
  };

  return (
    <div className="dashboard">
      
      {/* Left Sidebar: Profile & Charts */}
      <div className="dashboard-sidebar">
        <div className="profile-card">
          <h3>Profile</h3>
          {isEditingProfile ? (
            <form onSubmit={handleProfileUpdate}>
              <input value={profile.full_name || ''} onChange={e => setProfile({...profile, full_name: e.target.value})} placeholder="Full Name" />
              <textarea value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} placeholder="Bio" />
              <button type="submit" className="save-btn">Save Profile</button>
              <button type="button" onClick={() => setIsEditingProfile(false)} className="cancel-btn">Cancel</button>
            </form>
          ) : (
            <div className="profile-view">
              <div className="avatar-circle">{profile.username ? profile.username[0].toUpperCase() : 'U'}</div>
              <h4>{profile.full_name || profile.username}</h4>
              <p className="bio">{profile.bio || 'No bio set.'}</p>
              <button onClick={() => setIsEditingProfile(true)} className="edit-btn">Edit Profile</button>
            </div>
          )}
        </div>

        <div className="chart-card">
          <h3>Task Distribution</h3>
          <DonutChart tasks={tasks} />
        </div>
      </div>

      {/* Right Content: Stats & Tasks */}
      <div className="dashboard-content">
        {/* Top Stats Row */}
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Tasks</h4>
            <p className="stat-number">{tasks.length}</p>
          </div>
          <div className="stat-card">
            <h4>Completed</h4>
            <p className="stat-number text-green">{tasks.filter(t => t.status === 'completed').length}</p>
          </div>
          <div className="stat-card">
            <h4>Pending</h4>
            <p className="stat-number text-indigo">{tasks.filter(t => t.status === 'pending').length}</p>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="tasks-section">
          <h3>My Tasks</h3>
          <form onSubmit={handleAddTask} className="task-form">
            <div className="input-group">
              <input value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="New Task Title..." required />
              <textarea value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} placeholder="Description (optional)" />
            </div>
            <button type="submit" className="add-task-btn">Add Task</button>
          </form>

          <ul className="task-list">
            {tasks.length === 0 && <p className="empty-state">No tasks yet. Add one above!</p>}
            {tasks.map(task => (
              <li key={task.id} className={`task-item ${task.status}`}>
                <div className="task-content">
                  <strong>{task.title}</strong>
                  <p>{task.description}</p>
                  <small>Status: {task.status}</small>
                </div>
                <div className="actions">
                  {task.status !== 'completed' && (
                    <button onClick={() => handleUpdateStatus(task.id, 'completed')} className="complete-btn"><i className="fa fa-check"></i> Done</button>
                  )}
                  <button onClick={() => handleDeleteTask(task.id)} className="delete-btn"><i className="fa fa-trash"></i> Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;