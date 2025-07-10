import { useState } from "react";
import ProcessInputForm from "../components/ProcessInputForm";

// FUNCTION FOR PERFORMING "SJF SCHEDULING ALGORITHM" ===>

const calculateSJF = (processes) => {
  let time = 0;
  let completed = 0;
  let n = processes.length;
  let isVisited = Array(n).fill(false);
  let results = [];
  let totalWT = 0, totalTAT = 0;

  while (completed < n) {
    let idx = -1;
    let minBT = Infinity;

    for (let i = 0; i < n; i++) {
      const p = processes[i];
      if (p.arrivalTime <= time && !isVisited[i]) {
        if (p.burstTime < minBT || (p.burstTime === minBT && p.arrivalTime < processes[idx]?.arrivalTime)) {
          minBT = p.burstTime;
          idx = i;
        }
      }
    }

    if (idx !== -1) {
      const p = processes[idx];
      const startTime = time;
      const completionTime = startTime + p.burstTime;
      const turnaroundTime = completionTime - p.arrivalTime;
      const waitingTime = turnaroundTime - p.burstTime;

      totalWT += waitingTime;
      totalTAT += turnaroundTime;

      results.push({
        ...p,
        startTime,
        completionTime,
        turnaroundTime,
        waitingTime
      });

      isVisited[idx] = true;
      completed++;
      time = completionTime;
    } else {
      time++; // CPU is idle
    }
  }

  const avgWT = (totalWT / n).toFixed(2);
  const avgTAT = (totalTAT / n).toFixed(2);

  return { results, avgWT, avgTAT };
};


const SJF = () => {
  const [processes, setProcesses] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);

  const {
    results: scheduledProcesses,
    avgWT,
    avgTAT,
  } = calculateSJF(processes);

  const handleAddProcess = (process) => {
    const id = processes.length + 1;
    setProcesses([...processes, { id, ...process }]);
  };

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        SJF Scheduling
      </h2>

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
      {/*Reset Button */}
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
              SJF Scheduling Table
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border">
                <thead>
                  <tr className="bg-blue-100 text-gray-700">
                    <th className="border px-4 py-2">PID</th>
                    <th className="border px-4 py-2">AT</th>
                    <th className="border px-4 py-2">BT</th>
                    <th className="border px-4 py-2">ST</th>
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
                      <td className="border px-4 py-2">{p.startTime}</td>
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
              {scheduledProcesses.map((p, index) => (
                <div
                  key={p.id}
                  className="flex flex-col items-center justify-end mx-1 animate-slide"
                  style={{
                    minWidth: `${p.burstTime * 40}px`,
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
        </>
      )}
    </div>
  );
};

export default SJF;
