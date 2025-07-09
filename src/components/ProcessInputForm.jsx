import { useState } from "react";

const processInputForm = ({ onAddProcess }) =>{
    const [arrivalTime , setArrivalTime] = useState("");
    const [burstTime , setBurstTime] = useState("");

    const handleSubmit = (e) =>{
        e.preventDefault();


        if(arrivalTime === "" || burstTime === "") return;
        if(arrivalTime < 0 || burstTime < 0){
            alert("Arrival Time must be >= 0 and Burst Time must be > 0.");
            return;
        }

        onAddProcess({
            arrivalTime : Number(arrivalTime),
            burstTime : Number(burstTime),
        })

        setArrivalTime("");
        setBurstTime("");
    };

    return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md p-6 rounded-xl w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add a Process</h2>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Arrival Time</label>
        <input
          type="number"
          value={arrivalTime}
          onChange={(e) => setArrivalTime(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. 0"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Burst Time</label>
        <input
          type="number"
          value={burstTime}
          onChange={(e) => setBurstTime(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. 5"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Add Process
      </button>
    </form>
  );
};

export default processInputForm;