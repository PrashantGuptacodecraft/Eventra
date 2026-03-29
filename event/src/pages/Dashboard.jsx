import React from 'react'
import { useApp } from '../context/AppContext'

const Dashboard = () => {
  const { user, tasks, events } = useApp()


   const done = 1;
  const total = 3;
  const percent = Math.round((done / total) * 100);
  
  return (
    <div>
       <div className="page-top">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Hello, {user?.name || user?.username}! Here is your summary.</div>
        </div>
      </div>

{/* Cards */}
<div className="stats-row">
        <div className="stat-card " style={{ borderTopColor: '#1a73e8' }}>
          <div className="stat-number" style={{ color: '#1a73e8' }}>/</div>
          <div className="stat-label">Total Tasks</div>
        </div>

<div className="stat-card" style={{ borderTopColor: '#2e7d32' }}>
          <div className="stat-number" style={{ color: '#2e7d32' }}>/</div>
          <div className="stat-label">Completed</div>
        </div>
 <div className="stat-card" style={{ borderTopColor: '#c62828' }}>
          <div className="stat-number" style={{ color: '#c62828' }}>/</div>
          <div className="stat-label">Pending</div>
        </div>

        <div className="stat-card" style={{ borderTopColor: '#7b1fa2' }}>
          <div className="stat-number" style={{ color: '#7b1fa2' }}>/</div>
          <div className="stat-label">Upcoming Events</div>
        </div>
        <div className="stat-card" style={{ borderTopColor: '#f57f17' }}>
          <div className="stat-number" style={{ color: '#f57f17' }}>{user?.points || 0}</div>
          <div className="stat-label">Points Earned</div>
        </div>

        {/* progress new pannel */}
         <div className="card border-0 shadow-sm rounded-4 p-4">
      
      {/* Header */}
      <div className="d-flex align-items-center mb-2">
        <span className="me-2 fs-4">📈</span>
        <h5 className="fw-bold mb-0">Task Progress</h5>
      </div>

      {/* Text + % */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="text-secondary fs-5">
          {done} of {total} tasks done
        </span>
        <span className="text-primary fw-bold fs-5">
          {percent}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="progress" style={{ height: "12px", borderRadius: "10px" }}>
        <div
          className="progress-bar bg-primary"
          role="progressbar"
          style={{ width: `${percent}%`, borderRadius: "10px" }}
          aria-valuenow={percent}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>

    </div>





        {/* last pannel */}

         <div className="card border-0 shadow-sm rounded-4 p-4">
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Recent Tasks</h4>
        <button className="btn btn-primary rounded-pill px-4">
          View All
        </button>
      </div>

      {/* Task 1 */}
      <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
        <span className="fs-5">Complete Math Assignment</span>
        <span className="badge rounded-pill border border-danger text-danger px-3 py-2">
          High
        </span>
      </div>

      {/* Task 2 */}
      <div className="d-flex justify-content-between align-items-center py-3 border-bottom  ">
        <span className="fs-5">Read Chapter 5 Physics</span>
        <span className="badge rounded-pill border border-warning text-warning px-3 py-2">
          Medium
        </span>
      </div>

      {/* Task 3 */}
      <div className="d-flex justify-content-between align-items-center py-3">
        <span className="fs-5">Submit History Essay</span>
        <span className="badge rounded-pill border border-danger text-danger px-3 py-2">
          High
        </span>
      </div>

    </div>


        </div>



      
    </div>
  )
}

export default Dashboard
