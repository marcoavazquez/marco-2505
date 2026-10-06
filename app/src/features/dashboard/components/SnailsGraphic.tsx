"use client";

import type { TooltipContentProps } from "recharts";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BarShapeProps } from "recharts";

import { Card } from "@/components/ui";
import { dailyRaces } from "@/lib/data/racing";

const HIGHLIGHT_COLOR = "#22c55e";
const MUTED_COLOR = "#d4d4d8";

interface SnailStanding {
  name: string;
  wins: number;
  races: string[];
}

const buildStandings = (): SnailStanding[] => {
  const participants = dailyRaces[0]?.snails ?? [];
  const standings = new Map<string, SnailStanding>(
    participants.map(({ id, name }) => [id, { name, wins: 0, races: [] }]),
  );

  dailyRaces.forEach((race) => {
    const standing = standings.get(race.winner);

    if (!standing) return;

    standing.wins += 1;
    standing.races.push(race.name);
  });

  return [...standings.values()];
};

const standings = buildStandings();
const topWins = Math.max(...standings.map(({ wins }) => wins), 0);

const barColor = (wins: number) =>
  wins > 0 && wins === topWins ? HIGHLIGHT_COLOR : MUTED_COLOR;

const tooltipStyle = {
  backgroundColor: "var(--background)",
  border: "1px solid var(--border)",
  borderRadius: "0.5rem",
  color: "var(--foreground)",
  fontSize: "0.875rem",
};

const RaceTooltip = ({ active, payload }: TooltipContentProps) => {
  if (!active || !payload?.length) return null;

  const { name, wins, races } = payload[0].payload as SnailStanding;

  return (
    <div style={tooltipStyle} className="flex flex-col gap-1 px-3 py-2 text-sm">
      <span className="font-semibold">{name}</span>
      <span className="text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
        {wins} {wins === 1 ? "victoria" : "victorias"}
      </span>
      {races.length > 0 && (
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {races.join(", ")}
        </span>
      )}
    </div>
  );
};

const RaceBar = (barProps: BarShapeProps) => (
  <Rectangle
    {...barProps}
    fill={barColor(standings[barProps.index]?.wins ?? 0)}
  />
);

export const SnailsGraphic = () => {
  return (
    <Card
      title="Carreras del día"
      description={`Victorias por caracol en ${dailyRaces.length} carreras`}
      className="flex h-full flex-col gap-6"
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={standings}
            margin={{ top: 8, right: 8, bottom: 0, left: -20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--secondary)", fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--secondary)", fontSize: 12 }}
            />
            <Tooltip content={RaceTooltip} cursor={{ fill: "var(--border)", opacity: 0.4 }} />
            <Bar
              dataKey="wins"
              name="Victorias"
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
              isAnimationActive={false}
              shape={RaceBar}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
