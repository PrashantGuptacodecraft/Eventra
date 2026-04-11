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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Home</h1>
        <p className="text-gray-600">
          Hello, {user?.name || user?.username}! Here is your summary.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{totalTasks}</div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-red-600">{pendingTasks}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-purple-600">{upcomingEvents}</div>
          <div className="text-sm text-gray-600">Upcoming Events</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-orange-600">{user?.points || 0}</div>
          <div className="text-sm text-gray-600">Points Earned</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-semibold">Task Progress</h3>
          </div>
          <div className="flex justify-between items-center mb-2">
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

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Recent Tasks</h3>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div>
                  <h4
                    className={`font-medium ${task.done ? "line-through text-gray-500" : "text-gray-800"}`}
                  >
                    {task.title}
                  </h4>
                  <p className="text-sm text-gray-600">
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

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm overflow-hidden flex flex-col mt-6 w-full">
        <div className="flex items-center mb-4 text-orange-600">
          <h3 className="text-xl font-semibold text-gray-800">Leaderboard</h3>
        </div>
        <div className="space-y-3">
          {[...(users || [])]
            .filter((u) => u.role !== "admin")
            .sort((a, b) => (b.points || 0) - (a.points || 0))
            .slice(0, 10)
            .map((u, index) => (
              <div
                key={u.id}
                className={`flex items-center justify-between p-3 rounded border transition-all ${
                  u.id === user?.id
                    ? "bg-orange-50 border-orange-200 shadow-sm"
                    : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 shadow-sm ${
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
                  <div>
                    <h4 className="font-medium text-gray-800 text-sm">
                      {u.name || u.username}{" "}
                      {u.id === user?.id && (
                        <span className="text-orange-600 text-xs ml-1 font-bold">(You)</span>
                      )}
                    </h4>
                    <p className="text-xs text-gray-500 capitalize">{u.role}</p>
                  </div>
                </div>
                <div className="font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded text-sm">
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
