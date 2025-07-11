import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

const ProcessGraph = ({ data }) => {
  const [animatedData, setAnimatedData] = useState([]);
  //Adding Animation to Bars with slightly delay:

  useEffect(() => {
    setAnimatedData([]);
    (async () => {
      for (let i = 0; i < data.length; i++) {
        setAnimatedData((prev) => [...prev, data[i]]);
        await new Promise((res) => setTimeout(res, 300));
      }
    })();
  }, [data]);

  const chartData = animatedData.map((p) => ({
    name: `P${p.id}`,
    arrivalTime: p.arrivalTime,
    burstTime: p.burstTime,
  }));

  return (
    <div className="mt-10 bg-white p-4 rounded-xl shadow max-w-4xl mx-auto">
      <h3 className="text-xl font-bold text-center text-gray-700 mb-4">
        Arrival Time vs Burst Time
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="arrivalTime"
            label={{
              value: "Arrival Time",
              position: "insideBottom",
              offset: -5,
            }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            label={{
              value: "Burst Time",
              angle: -90,
              position: "insideLeft",
            }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Bar
            dataKey="burstTime"
            fill="#60A5FA"
            animationDuration={500}
            isAnimationActive={true}
          >
            <LabelList dataKey="name" position="insideTop" fill="#ffffff" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProcessGraph;
