import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const token = localStorage.getItem("token");

  const [data, setData] = useState({});
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [selectedProject, setSelectedProject] = useState("");
  const [projectName, setProjectName] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [assignedUser, setAssignedUser] = useState("");

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // 🔥 REFRESH ALL DATA
  const refreshAll = async (projectId = selectedProject) => {
    try {
      const dash = await axios.get(
        "http://localhost:5000/api/dashboard",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(dash.data);

      const proj = await axios.get(
        "http://localhost:5000/api/projects",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects(proj.data);

      const userRes = await axios.get(
        "http://localhost:5000/api/users",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(userRes.data);

      let currentProject = projectId;

      // ✅ No projects
      if (proj.data.length === 0) {
        setSelectedProject("");
        setTasks([]);
        return;
      }

      // ✅ Fix invalid/deleted project
      if (
        !currentProject ||
        !proj.data.find((p) => p._id === currentProject)
      ) {
        currentProject = proj.data[0]._id;
      }

      // ✅ Always sync state
      setSelectedProject(currentProject);

      // Fetch tasks
      const taskRes = await axios.get(
        `http://localhost:5000/api/tasks?projectId=${currentProject}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(taskRes.data);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  useEffect(() => {
  if (!selectedProject) {
    setTasks([]);
    return;
  }

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/tasks?projectId=${selectedProject}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchTasks();
}, [selectedProject]);

  // CREATE PROJECT
  const createProject = async () => {
    if (!projectName) return alert("Enter project name");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/projects",
        { name: projectName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProjectName("");
      await refreshAll(res.data._id);

    } catch {
      alert("Error creating project");
    }
  };

  // DELETE PROJECT
  const deleteProject = async () => {
    if (!selectedProject) return;

    if (!window.confirm("Delete this project?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/projects/${selectedProject}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedProject("");
      await refreshAll();

    } catch {
      alert("Error deleting project");
    }
  };

  // CREATE TASK
  const createTask = async () => {
    if (!title) return alert("Title required");
    if (!selectedProject) return alert("Select a project");

    try {
      await axios.post(
        "http://localhost:5000/api/tasks",
        {
          title,
          description,
          projectId: selectedProject,
          status: "todo",
          deadline: deadline || null,
          assignedTo: assignedUser || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTitle("");
      setDescription("");
      setDeadline("");
      setAssignedUser("");

      await refreshAll();

    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.error || "Error creating task");
    }
  };

  // UPDATE TASK
  const updateTask = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await refreshAll();

    } catch {
      alert("Error updating task");
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/tasks/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await refreshAll();

    } catch {
      alert("Error deleting task");
    }
  };

  return (
    <div className="p-6 bg-[#0f172a] min-h-screen text-white">

      {/* HEADER */}
      <div className="grid grid-cols-3 items-center mb-6">

  <h1 className="text-2xl font-bold">Dashboard</h1>

  <h1 className="text-2xl font-semibold text-blue-400 text-center">
    Team Task Manager
  </h1>

  <div className="text-right">
    <button
      onClick={handleLogout}
      className="bg-red-500 px-4 py-2 rounded"
    >
      Logout
    </button>
  </div>

</div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {["total", "completed", "pending", "overdue"].map((key) => (
          <div key={key} className="bg-[#1e293b] p-6 rounded-xl text-center">
            <p className="text-gray-400 capitalize">{key}</p>
            <h2 className="text-2xl font-bold">{data[key] || 0}</h2>
          </div>
        ))}
      </div>

      {/* PROJECT */}
      <div className="bg-[#1e293b] p-6 rounded-xl mb-6">
  <h2 className="mb-4">Projects</h2>

  {/* 🔼 CREATE PROJECT (TOP) */}
  <div className="flex gap-3 mb-4">
    <input
      placeholder="New project"
      value={projectName}
      onChange={(e) => setProjectName(e.target.value)}
      className="flex-1 p-3 bg-[#334155] rounded text-white"
    />

    <button
      onClick={createProject}
      className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
    >
      Create Project
    </button>
  </div>

  {/* 🔽 SELECT + DELETE */}
  <div className="flex gap-3">
    <select
      className="flex-1 p-3 bg-[#334155] rounded text-white"
      value={selectedProject || ""}
      onChange={(e) => setSelectedProject(e.target.value)}
    >
      {projects.length === 0 ? (
        <option value="">No projects available</option>
      ) : (
        projects.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))
      )}
    </select>

    <button
      onClick={deleteProject}
      disabled={!selectedProject}
      className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
    >
      Delete
    </button>
  </div>
</div>

      {/* CREATE TASK */}
      <div className="bg-gray-800 p-4 rounded mb-6">
        {!selectedProject && (
          <p className="text-red-400 mb-2">
            Please create/select a project first
          </p>
        )}

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-2 bg-gray-700"
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 mb-2 bg-gray-700"
        />

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full p-2 mb-2 bg-gray-700"
        />

        <select
          value={assignedUser}
          onChange={(e) => setAssignedUser(e.target.value)}
          className="w-full p-2 mb-2 bg-gray-700"
        >
          <option value="">Assign user</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

        <button
          onClick={createTask}
          disabled={!selectedProject}
          className="bg-green-600 px-3 py-1 rounded disabled:opacity-50"
        >
          Add Task
        </button>
      </div>

      {/* TASK TABLE */}
      <div className="bg-gray-800 p-5 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Tasks</h2>

        {tasks.length === 0 ? (
          <p className="text-gray-400">No tasks available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-700 text-gray-300">
                  <th className="p-3">Title</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Assigned</th>
                  <th className="p-3">Deadline</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {tasks.map((t) => {
                  const isOverdue =
                    t.deadline &&
                    new Date(t.deadline) < new Date() &&
                    t.status !== "done";

                  return (
                    <tr key={t._id} className="border-b border-gray-700">
                      <td className="p-3">{t.title}</td>
                      <td className="p-3 text-gray-400">{t.description}</td>
                      <td className="p-3">
                        {t.assignedTo?.name || "Unassigned"}
                      </td>
                      <td className="p-3">
                        {t.deadline
                          ? new Date(t.deadline).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          isOverdue
                            ? "bg-red-500"
                            : t.status === "done"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}>
                          {isOverdue ? "Overdue" : t.status}
                        </span>
                      </td>
                      <td className="p-3 flex gap-2 justify-center">
                        {t.status !== "done" && (
                          <button
                            onClick={() => updateTask(t._id, "done")}
                            className="bg-green-600 px-2 py-1 rounded text-xs"
                          >
                            Done
                          </button>
                        )}
                        <button
                          onClick={() => deleteTask(t._id)}
                          className="bg-red-600 px-2 py-1 rounded text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

export default Dashboard;