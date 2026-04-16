import React from "react";
import { useApp } from "../context/AppContext";

const Dashboard = () => {
  const { user, tasks, events, users } = useApp();

  const userTasks = tasks.filter((task) => task.userId === user.id);
  const totalTasks = userTasks.length;
  const completedTasks = userTasks.filter((task) => task.done).length;
  const pendingTasks = totalTasks - completedTasks;
  const upcomingEvents = events.filter(
    (event) => new Date(event.date) > new Date(),
  ).length;
  const percent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const recentTasks = userTasks.slice(-3).reverse();

  return (
    <div className="container-fluid px-3 px-md-4 px-xl-5 py-4 py-md-5">
      <div className="mb-4 mb-md-5">
        <h1 className="text-3xl font-bold text-gray-800">Home</h1>
        <p className="text-gray-600">
          Hello, {user?.name || user?.username}! Here is your summary.
        </p>
      </div>

      <div className="row g-3 mb-4 mb-md-5">
        <div className="col-12 col-sm-6 col-xl">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm h-100">
            <div className="text-2xl font-bold text-blue-600">{totalTasks}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm h-100">
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm h-100">
            <div className="text-2xl font-bold text-red-600">{pendingTasks}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm h-100">
            <div className="text-2xl font-bold text-purple-600">{upcomingEvents}</div>
            <div className="text-sm text-gray-600">Upcoming Events</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm h-100">
            <div className="text-2xl font-bold text-orange-600">{user?.points || 0}</div>
            <div className="text-sm text-gray-600">Points Earned</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 p-md-6 shadow-sm h-100">
            <div className="d-flex align-items-center mb-4">
              <h3 className="text-xl font-semibold mb-0">Task Progress</h3>
            </div>
            <div className="d-flex justify-content-between align-items-center gap-3 mb-2 flex-wrap">
              <span className="text-gray-600">
                {completedTasks} of {totalTasks} tasks done
              </span>
              <span className="text-blue-600 font-bold">{percent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="col-12 col-xl-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 p-md-6 shadow-sm h-100">
            <div className="d-flex justify-content-between align-items-start gap-3 mb-4 flex-wrap">
              <h3 className="text-xl font-semibold mb-0">Recent Tasks</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-100">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 p-3 bg-gray-50 rounded"
                >
                  <div className="min-w-0">
                    <h4
                      className={`font-medium mb-1 ${task.done ? "line-through text-gray-500" : "text-gray-800"}`}
                    >
                      {task.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-0">
                      Priority: {task.priority}{" "}
                      {task.deadline &&
                        `| Due: ${new Date(task.deadline).toLocaleDateString()}`}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs ${task.done ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                  >
                    {task.done ? "Done" : "Pending"}
                  </span>
                </div>
              ))}
              {recentTasks.length === 0 && (
                <p className="text-gray-500 text-center py-4">No tasks yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 p-md-6 shadow-sm overflow-hidden flex flex-col mt-4 mt-md-5 w-full">
        <div className="d-flex align-items-center mb-4 text-orange-600">
          <h3 className="text-xl font-semibold text-gray-800 mb-0">Leaderboard</h3>
        </div>
        <div className="space-y-3">
          {[...(users || [])]
            .filter((u) => u.role !== "admin")
            .sort((a, b) => (b.points || 0) - (a.points || 0))
            .slice(0, 10)
            .map((u, index) => (
              <div
                key={u.id}
                className={`d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 p-3 rounded border transition-all ${
                  u.id === user?.id
                    ? "bg-orange-50 border-orange-200 shadow-sm"
                    : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                }`}
              >
                <div className="d-flex align-items-center min-w-0">
                  <div
                    className={`w-8 h-8 rounded-full d-flex align-items-center justify-content-center font-bold mr-3 shadow-sm flex-shrink-0 ${
                      index === 0
                        ? "bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-900"
                        : index === 1
                          ? "bg-gradient-to-br from-gray-200 to-gray-400 text-gray-800"
                          : index === 2
                            ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    #{index + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-gray-800 text-sm mb-1">
                      {u.name || u.username}{" "}
                      {u.id === user?.id && (
                        <span className="text-orange-600 text-xs ml-1 font-bold">(You)</span>
                      )}
                    </h4>
                    <p className="text-xs text-gray-500 capitalize mb-0">{u.role}</p>
                  </div>
                </div>
                <div className="font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded text-sm flex-shrink-0">
                  {u.points || 0}{" "}
                  <span className="text-xs font-normal text-orange-500">pts</span>
                </div>
              </div>
            ))}
          {(!users || users.length === 0) && (
            <p className="text-gray-500 text-center py-4">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
