import { useState } from "react";
import ProcessInputForm from "../components/ProcessInputForm";

const FCFS = () => {
  const [processes, setProcesses] = useState([]);

  const handleAddProcess = (process) => {
    const id = processes.length + 1;
    setProcesses([...processes, { id, ...process }]);
  };

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">FCFS Scheduling</h2>
      
      <ProcessInputForm onAddProcess={handleAddProcess} />
      
      {/* Display Added Processes */}
      <div className="mt-8 max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Added Processes</h3>
        {processes.length === 0 ? (
          <p className="text-gray-500">No processes added yet.</p>
        ) : (
          <ul className="space-y-3">
            {processes.map((p) => (
              <li key={p.id} className="flex justify-between bg-gray-100 p-3 rounded-md">
                <span className="font-semibold">P{p.id}</span>
                <span>Arrival: {p.arrivalTime}</span>
                <span>Burst: {p.burstTime}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FCFS;
