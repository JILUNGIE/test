import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  Area,
  XAxis,
  YAxis,
} from "recharts";
import useTheme from "../hooks/useTheme";
import { useEffect } from "react";

interface IBaseChart {
  data: { value: number | undefined }[];
}

function BaseChart({ data }: IBaseChart) {
  const { dark } = useTheme();
  useEffect(() => {
    console.log(dark);
  }, [dark]);
  //#1C1C1C
  return (
    <ResponsiveContainer>
      <AreaChart data={data}>
        <CartesianGrid
          stroke="#333"
          strokeDasharray="5 5"
          fill={dark ? "#1c1c1c" : "#a8a8a8"}
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
