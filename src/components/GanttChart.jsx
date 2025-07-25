import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GanttChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const labels = data.map((p) => `P${p.id}`);
  const startTimes = data.map((p) => p.startTime);
  const durations = data.map((p) => p.burstTime);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Start Time",
        data: startTimes,
        backgroundColor: "transparent",
        stack: "combined",
      },
      {
        label: "Burst Time",
        data: durations,
        backgroundColor: "#3B82F6",
        stack: "combined",
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Stacked Gantt Chart of Process Execution",
      },
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Processes",
        },
        stacked: true,
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 bg-white p-6 rounded-xl shadow">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default GanttChart;
