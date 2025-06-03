import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { PieChart } from "@mui/x-charts/PieChart";

interface DemographicsPieChartProps {
  title: string;
  data: { label: string; value: number; color: string }[];
}

export default function DemographicsPieChart({
  title,
  data,
}: DemographicsPieChartProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <PieChart
          series={[
            {
              data: data.map((item, index) => ({
                id: index,
                value: item.value,
                label: `${item.label} (${item.value})`,
                color: item.color,
              })),
            },
          ]}
          width={400}
          height={200}
        />
      </CardContent>
    </Card>
  );
}
