// chart.tsx
import * as React from "react";
import {
  // runtime imports
  VictoryChart as VNChart,
  VictoryLine as VNLine,
  VictoryBar as VNBar,
  VictoryAxis as VNAxis,
  VictoryLegend as VNLegend,
  VictoryTooltip as VNTooltip,
  VictoryScatter as VNScatter,
} from "victory-native";

type ChartData = { x: string | number | Date; y: number };

export type ChartConfig = {
  [key: string]: {
    label?: string;
    color?: string;
  };
};

type ChartProps = {
  data: ChartData[];
  config?: ChartConfig;
  height?: number;
  width?: number;
  children?: React.ReactNode;
};

export const ChartContainer: React.FC<ChartProps> = ({
  data,
  config,
  height = 200,
  width = 350,
  children,
}) => {
  return (
    <VNChart height={height} width={width}>
      {children}
    </VNChart>
  );
};

export const ChartLine: React.FC<{
  data: ChartData[];
  color?: string;
  name?: string;
}> = ({ data, color, name }) => {
  return (
    <VNLine
      data={data as any} // bypass TS bundler resolution issues
      style={{
        data: { stroke: color || "#0f62fe" },
      }}
      name={name as any}
      labels={({ datum }: { datum: any }) => datum.y}
      labelComponent={<VNTooltip />}
    />
  );
};

export const ChartBar: React.FC<{
  data: ChartData[];
  color?: string;
  name?: string;
}> = ({ data, color, name }) => {
  return (
    <VNBar
      data={data as any}
      style={{
        data: { fill: color || "#0f62fe" },
      }}
      name={name as any}
      labels={({ datum }: { datum: any }) => datum.y}
      labelComponent={<VNTooltip />}
    />
  );
};

export const ChartAxis: React.FC<any> = (props) => {
  return <VNAxis {...props} />;
};

export const ChartLegend: React.FC<any> = (props) => {
  return <VNLegend {...props} />;
};

export const ChartTooltip: React.FC<any> = (props) => {
  return <VNTooltip {...props} />;
};

export const ChartScatter: React.FC<{
  data: ChartData[];
  color?: string;
  name?: string;
}> = ({ data, color, name }) => {
  return (
    <VNScatter
      data={data as any}
      style={{
        data: { fill: color || "#0f62fe" },
      }}
      name={name as any}
      labels={({ datum }: { datum: any }) => datum.y}
      labelComponent={<VNTooltip />}
    />
  );
};
