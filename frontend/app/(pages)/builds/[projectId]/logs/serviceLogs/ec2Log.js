import { Clock } from "lucide-react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";

export default function EC2log() {
const pathname = usePathname();
const build_id = pathname.split("/")[2];

const [instances, setInstances] = useState([]);

useEffect(() => {
const get_logs = async () => {
try {
const response = await axios.get("http://localhost:8000/canvas/logs", {
  params: { build_id: build_id },
});

const logs = response.data?.logs || {};

const formatted = Object.entries(logs).map(([instance, points]) => ({
  instance,
  data: points
    .map((p) => ({
      time: p.time,
      value: p.value,
    }))
    .reverse(),
}));

setInstances(formatted);
} catch (err) {
console.log("error", err);
}
};

if (build_id) {
get_logs();
}
}, [build_id]);

return (
<div>
<div className="flex justify-center flex-col pt-4">
<div className="flex flex-col gap-4 items-center">
  {instances.map(({ instance, data }) => {
    const latestTime = data[0]?.time || "—";
    const formattedLatestTime =  new Date(latestTime).toLocaleString() 
    const avg =
      data.length
        ? (data.reduce((acc, p) => acc + p.value, 0) / data.length).toFixed(2)
        : "—";
    const min =
      data.length
        ? Math.min(...data.map((p) => p.value)).toFixed(2)
        : "—";
    const max =
      data.length
        ? Math.max(...data.map((p) => p.value)).toFixed(2)
        : "—";

    return (
      <div
        key={instance}
        className="w-7/8 p-6 border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-gray-300"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 w-7/8">
            <div className="w-7/8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-semibold text-gray-900">
                  EC2 Instance – {instance}
                </span>
              </div>

              <h1 className="text-gray-600">
                how much of an EC2 instance’s CPU capacity is currently being used
              </h1>

              <div className="mt-4 rounded-xl bg-gray-100 flex justify-between items-start gap-6">
                <div className="flex-1">
                  <div className="list-disc space-y-1 text-gray-700">
                    <p>
                      TimeStamp <span> - {formattedLatestTime}</span>
                    </p>
                    <p>Average - {avg}</p>
                    <p>
                      minimum - {min}
                      <span> maximum - {max}</span>
                    </p>
                    <p>period - 5m</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-15">
              <LineChart width={300} height={200} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
              </LineChart>
            </div>
          </div>
        </div>
      </div>
    );
  })}

  {instances.length === 0 && (
    <div className="text-gray-500 text-sm">No EC2 CPU logs found for this build.</div>
  )}
</div>
</div>
</div>
);
}

