"use client";

import { Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from "recharts";
import type { PieSectorShapeProps } from "recharts";

import { Card } from "@/components/ui";
import { userBalance } from "@/lib/data/balance";

const WON_COLOR = "#22c55e";
const LOST_COLOR = "#ef4444";

const betsData = [
  { name: "Ganado", value: userBalance.won, color: WON_COLOR },
  { name: "Perdido", value: userBalance.lost, color: LOST_COLOR },
];

const totalBets = betsData.reduce((total, bet) => total + bet.value, 0);


const toPercentage = (value: number) =>
  totalBets === 0 ? 0 : Math.round((value / totalBets) * 100);

const tooltipStyle = {
  backgroundColor: "var(--background)",
  border: "1px solid var(--border)",
  borderRadius: "0.5rem",
  color: "var(--foreground)",
  fontSize: "0.875rem",
};

const BetSector = (sectorProps: PieSectorShapeProps) => (
  <Sector {...sectorProps} fill={betsData[sectorProps.index]?.color} />
);

export const BetsGraphics = () => {
  return (
    <Card
      title="Balance de apuestas"
      description={`${totalBets} Jugadas`}
      className="flex h-full flex-col gap-6"
    >
      <div className="relative h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value, name) => [
                `${Number(value)} (${toPercentage(Number(value))}%)`,
                name,
              ]}
            />
            <Pie
              data={betsData}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="85%"
              paddingAngle={3}
              cornerRadius={4}
              isAnimationActive={false}
              shape={BetSector}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold tabular-nums tracking-tight text-green-600">
            {toPercentage(userBalance.won)}%
          </span>
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            ganado
          </span>
        </div>
      </div>

      <ul className="flex flex-col gap-2.5">
        {betsData.map(({ name, value, color }) => (
          <li key={name} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2.5 text-zinc-600 dark:text-zinc-400">
              <span
                aria-hidden="true"
                className="size-2.5 rounded-full ring-2 ring-background"
                style={{ backgroundColor: color }}
              />
              {name}
            </span>
            <span className="font-semibold tabular-nums">
              {value}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
};
