import type { Metadata } from "next";
import { DashboardView } from "@/features/dashboard/components/DashboardView";

export const metadata: Metadata = {
  title: "Panel Principal | Snail",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen mx-auto space-y-8">
      <DashboardView />
    </div>
  );
}
