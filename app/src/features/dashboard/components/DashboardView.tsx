"use client"

import { useAuth } from "@/hooks/useAuth";
import { Appbar } from "./Appbar";
import { BetsGraphics } from "./BetsGraphics";
import { SnailsGraphic } from "./SnailsGraphic";
import { useBalance } from "@/hooks/useBalance";
import { BalanceCard } from "./BalanceCard";
import { useCallback } from "react";

export const DashboardView = () => {

  const { user } = useAuth()
  const { balance, deposit } = useBalance(user?.email!)

  return (
    <div className="flex min-h-screen flex-col">
      <Appbar />

      <main className="flex-1">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8 lg:flex-row lg:items-start lg:justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Bienvenido {user?.fullName}</h2>

          <BalanceCard balance={balance!} onDeposit={deposit} />
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 pb-10 md:grid-cols-2">
          <BetsGraphics />
          <SnailsGraphic />
        </div>
      </main>
    </div>
  )
}
