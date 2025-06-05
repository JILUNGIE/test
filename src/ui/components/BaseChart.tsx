import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  Area,
  XAxis,
  YAxis,
} from "recharts";

interface IBaseChart {
  data: { value: number | undefined }[];
  isDark: boolean;
}

function BaseChart({ data, isDark }: IBaseChart) {
  return (
    <ResponsiveContainer>
      <AreaChart data={data}>
        <CartesianGrid
          stroke="#333"
          strokeDasharray="5 5"
          fill={isDark ? "#1c1c1c" : "#a8a8a8"}
        />
        <Area
          fillOpacity={0.3}
          strokeWidth={3}
          dataKey="value"
          type="monotone"
          isAnimationActive={false}
        />
        <XAxis stroke="transparent" height={0} />
        <YAxis domain={[0, 100]} stroke="transparent" width={0} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default BaseChart;
