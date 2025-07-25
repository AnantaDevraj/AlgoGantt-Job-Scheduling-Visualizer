import { useState } from "react";
import ProcessInputForm from "../components/ProcessInputForm";
import GanttChart from "../components/GanttChart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// FUNCTION FOR PERFORMING "ROUND ROBIN SCHEDULING ALGORITHM" ===>

const calculateRoundRobinSchedule = (processes, timeQuantum = 2) => {
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const n = sorted.length;
  const remainingTime = sorted.map((p) => p.burstTime);
  const isCompleted = new Array(n).fill(false);

  const result = [];
  let currentTime = 0;
  let completed = 0;
  const queue = [];
  const visited = new Array(n).fill(false);

  let totalWT = 0;
  let totalTAT = 0;

  // Push first arrived processes
  for (let i = 0; i < n; i++) {
    if (sorted[i].arrivalTime <= currentTime && !visited[i]) {
      queue.push(i);
      visited[i] = true;
    }
  }

  while (completed < n) {
    if (queue.length === 0) {
      currentTime++;
      for (let i = 0; i < n; i++) {
        if (sorted[i].arrivalTime <= currentTime && !visited[i]) {
          queue.push(i);
          visited[i] = true;
        }
      }
      continue;
    }

    const idx = queue.shift();
    const process = sorted[idx];

    const startTime = currentTime;
    const execTime = Math.min(timeQuantum, remainingTime[idx]);
    currentTime += execTime;
    remainingTime[idx] -= execTime;

    result.push({
      ...process,
      id: process.id,
      startTime,
      completionTime: currentTime,
      execTime,
    });

    for (let i = 0; i < n; i++) {
      if (
        sorted[i].arrivalTime <= currentTime &&
        !visited[i] &&
        remainingTime[i] > 0
      ) {
        queue.push(i);
        visited[i] = true;
      }
    }

    if (remainingTime[idx] > 0) {
      queue.push(idx);
    } else if (!isCompleted[idx]) {
      isCompleted[idx] = true;
      const turnaroundTime = currentTime - process.arrivalTime;
      const waitingTime = turnaroundTime - process.burstTime;
      totalTAT += turnaroundTime;
      totalWT += waitingTime;

      sorted[idx] = {
        ...process,
        completionTime: currentTime,
        turnaroundTime,
        waitingTime,
      };
      completed++;
    }
  }

  const finalProcesses = sorted.map((p) => ({
    ...p,
  }));

  const avgWT = (totalWT / n).toFixed(2);
  const avgTAT = (totalTAT / n).toFixed(2);

  return { results: finalProcesses, ganttChart: result, avgWT, avgTAT };
};

const RoundRobin = () => {
  const [processes, setProcesses] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const[timeQuantum ,setTimeQuantum] = useState(2);

  const {
    results: scheduledProcesses,
    ganttChart,
    avgWT,
    avgTAT,
  } = calculateRoundRobinSchedule(processes, timeQuantum); // Time Quantum = 2

  const handleAddProcess = (process) => {
    const id = processes.length + 1;
    setProcesses([...processes, { id, ...process }]);
  };

  const chartData = scheduledProcesses.map((p) => ({
    name: `P${p.id}`,
    Arrival: p.arrivalTime,
    Burst: p.burstTime,
    Waiting: p.waitingTime,
  }));

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        Round Robin Scheduling
      </h2>
      <div className="my-4 flex justify-center">
        <label className="block mb-1 font-medium text-2xl">Time Quantum : </label>
        <input
          type="number"
          min="1"
          value={timeQuantum}
          onChange={(e) => setTimeQuantum(Number(e.target.value))}
          className="border p-2 rounded w-32 mx-3"
        />
      </div>

      <ProcessInputForm onAddProcess={handleAddProcess} />

      {/* Display Added Processes */}
      <div className="mt-8 max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Added Processes</h3>
        {processes.length === 0 ? (
          <p className="text-gray-500">No processes added yet.</p>
        ) : (
          <ul className="space-y-3">
            {processes.map((p) => (
              <li
                key={p.id}
                className="flex justify-between bg-gray-100 p-3 rounded-md"
              >
                <span className="font-semibold">P{p.id}</span>
                <span>Arrival: {p.arrivalTime}</span>
                <span>Burst: {p.burstTime}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      

      {/* Start Scheduling Button */}
      {processes.length > 0 && !showSchedule && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowSchedule(true)}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-all"
          >
            ▶️ Start Scheduling
          </button>
        </div>
      )}

      {/* Reset Button */}
      {(processes.length > 0 || showSchedule) && (
        <div className="text-center mt-6">
          <button
            onClick={() => {
              setProcesses([]);
              setShowSchedule(false);
            }}
            className="px-5 py-2 bg-red-500 text-white font-semibold rounded-md shadow hover:bg-red-600 transition-all"
          >
            🔄 Reset
          </button>
        </div>
      )}

      {/* Scheduling Result Table */}
      {showSchedule && scheduledProcesses.length > 0 && (
        <>
          <div className="mt-10 max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Round Robin Scheduling Table
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border">
                <thead>
                  <tr className="bg-blue-100 text-gray-700">
                    <th className="border px-4 py-2">PID</th>
                    <th className="border px-4 py-2">AT</th>
                    <th className="border px-4 py-2">BT</th>
                    <th className="border px-4 py-2">CT</th>
                    <th className="border px-4 py-2">TAT</th>
                    <th className="border px-4 py-2">WT</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduledProcesses.map((p) => (
                    <tr key={p.id} className="text-center">
                      <td className="border px-4 py-2">P{p.id}</td>
                      <td className="border px-4 py-2">{p.arrivalTime}</td>
                      <td className="border px-4 py-2">{p.burstTime}</td>
                      <td className="border px-4 py-2">{p.completionTime}</td>
                      <td className="border px-4 py-2">{p.turnaroundTime}</td>
                      <td className="border px-4 py-2">{p.waitingTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <p className="font-medium">
                Average Waiting Time:{" "}
                <span className="text-blue-600">{avgWT}</span>
              </p>
              <p className="font-medium">
                Average Turnaround Time:{" "}
                <span className="text-blue-600">{avgTAT}</span>
              </p>
            </div>
          </div>

          {/* Gantt Chart */}
          <div className="mt-10 max-w-5xl mx-auto bg-gray-100 p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
              Gantt Chart
            </h3>
            <div className="flex items-center border border-gray-300 rounded overflow-x-auto px-4 py-2">
              {ganttChart.map((p, index) => (
                <div
                  key={`${p.id}-${index}`}
                  className="flex flex-col items-center justify-end mx-1 animate-slide"
                  style={{
                    minWidth: `${p.execTime * 40}px`,
                    backgroundColor: "#60A5FA",
                    color: "white",
                    borderRadius: "6px",
                    padding: "8px 4px",
                    animationDelay: `${index * 0.3}s`,
                    animationDuration: "0.5s",
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="font-bold text-sm">P{p.id}</div>
                  <div className="text-xs">
                    {p.startTime} → {p.completionTime}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart Comparison */}
          <div className="mt-10 max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Time Comparison Chart
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Arrival" fill="#8884d8" />
                <Bar dataKey="Burst" fill="#82ca9d" />
                <Bar dataKey="Waiting" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {showSchedule && ganttChart.length > 0 && (
        <GanttChart data={ganttChart} />
      )}
    </div>
  );
};

export default RoundRobin;
